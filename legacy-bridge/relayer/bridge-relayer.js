#!/usr/bin/env node
/**
 * ROBOTX Bridge Relayer
 * 最小上线版: 仅支持 BSC USDT <-> RX USDT
 * 正向手续费 1%，反向手续费 4%
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { ethers } = require('ethers');

const DEPOSIT_TOPIC = '0xf65183fa5938f2cb9c2608ff3cbad853c96efa794a219ae218dd17e5a58f2cbe';
const WITHDRAW_SELECTOR = '0x69328dec';

const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL || '15000', 10);
const REVERSE_BRIDGE_PORT = parseInt(process.env.REVERSE_BRIDGE_PORT || '3456', 10);

const ROBOTX_RPC = process.env.ROBOTX_RPC || 'http://127.0.0.1:8545';
const BSC_RPC = process.env.BSC_RPC || 'https://bsc-rpc.publicnode.com';

const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY || process.env.RELAYER_PRIVATE_KEY || '';
const BRIDGE_AUTH_KEY = process.env.BRIDGE_AUTH_KEY || process.env.RELAYER_SECRET || 'robotx-bridge-relayer-2026';

const BSC_BRIDGE_CONTRACT = (process.env.BSC_BRIDGE_CONTRACT || '').trim();
const RX_BRIDGE_CONTRACT = (process.env.RX_BRIDGE_CONTRACT || '').trim();
const BSC_USDT = (process.env.BSC_USDT || '0x55d398326f99059fF775485246999027B3197955').trim();
const RX_USDT = (process.env.RX_USDT || '').trim();

const PROCESSED_FILE = path.join(__dirname, 'processed_deposits.json');
const REVERSE_PROCESSED_FILE = path.join(__dirname, 'processed_reverse.json');

const BRIDGES = {
  bsc: {
    key: 'bsc',
    name: 'BNB Chain',
    rpc: BSC_RPC,
    bridgeContract: BSC_BRIDGE_CONTRACT,
    tokenContract: BSC_USDT,
    tokenDecimals: 18,
    confirmations: 3,
  },
  robotx: {
    key: 'robotx',
    name: 'ROBOTX',
    rpc: ROBOTX_RPC,
    bridgeContract: RX_BRIDGE_CONTRACT,
    tokenContract: RX_USDT,
    tokenDecimals: 18,
    confirmations: 1,
  },
};

const FAILED_QUEUE = [];

function ensureConfig() {
  const missing = [];
  if (!OWNER_PRIVATE_KEY) missing.push('OWNER_PRIVATE_KEY or RELAYER_PRIVATE_KEY');
  if (!BSC_BRIDGE_CONTRACT) missing.push('BSC_BRIDGE_CONTRACT');
  if (!RX_BRIDGE_CONTRACT) missing.push('RX_BRIDGE_CONTRACT');
  if (!RX_USDT) missing.push('RX_USDT');
  if (missing.length > 0) {
    console.error('FATAL: missing env -> ' + missing.join(', '));
    process.exit(1);
  }
}

function normalizeAddress(value) {
  try {
    return ethers.getAddress(value);
  } catch {
    return '';
  }
}

function loadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return {};
  }
}

function saveJson(filePath, data) {
  const tmp = filePath + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, filePath);
}

const GLOBAL_PROCESSED = loadJson(PROCESSED_FILE);
const REVERSE_PROCESSED = loadJson(REVERSE_PROCESSED_FILE);

function jsonRpc(url, method, params = []) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ jsonrpc: '2.0', method, params, id: Date.now() });
    const parsed = new URL(url);
    const mod = parsed.protocol === 'https:' ? https : http;

    const req = mod.request({
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname || '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 15000,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            reject(new Error(json.error.message || JSON.stringify(json.error)));
            return;
          }
          resolve(json.result);
        } catch {
          reject(new Error('Parse error: ' + data.slice(0, 200)));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.write(body);
    req.end();
  });
}

function convertAmount(amountInput, fromDecimals, toDecimals) {
  const amount = BigInt(amountInput);
  if (fromDecimals === toDecimals) return amount.toString();
  const diff = BigInt(Math.abs(fromDecimals - toDecimals));
  const factor = 10n ** diff;
  if (fromDecimals > toDecimals) return (amount / factor).toString();
  return (amount * factor).toString();
}

function parseDepositLog(log) {
  try {
    const sender = normalizeAddress('0x' + log.topics[1].slice(26));
    const token = normalizeAddress('0x' + log.topics[2].slice(26)).toLowerCase();
    const data = log.data.slice(2);

    const amount = BigInt('0x' + data.slice(0, 64));
    const nonce = parseInt('0x' + data.slice(128, 192), 16);
    const strOffset = parseInt('0x' + data.slice(64, 128), 16) * 2;
    const strLen = parseInt('0x' + data.slice(strOffset, strOffset + 64), 16);
    const strHex = data.slice(strOffset + 64, strOffset + 64 + strLen * 2);
    const destAddress = Buffer.from(strHex, 'hex').toString('utf8').trim();

    return {
      sender,
      token,
      amount: amount.toString(),
      destAddress,
      nonce,
    };
  } catch (error) {
    console.error('解析 Deposit 日志失败:', error.message);
    return null;
  }
}

const providerCache = new Map();
const walletCache = new Map();

function getProvider(chainKey) {
  if (!providerCache.has(chainKey)) {
    providerCache.set(chainKey, new ethers.JsonRpcProvider(BRIDGES[chainKey].rpc));
  }
  return providerCache.get(chainKey);
}

function getWallet(chainKey) {
  if (!walletCache.has(chainKey)) {
    walletCache.set(chainKey, new ethers.Wallet(OWNER_PRIVATE_KEY, getProvider(chainKey)));
  }
  return walletCache.get(chainKey);
}

async function executeBridgeWithdraw(chainKey, tokenAddress, amount, toAddress) {
  const bridge = BRIDGES[chainKey];
  const to = normalizeAddress(toAddress);
  if (!bridge || !bridge.bridgeContract) throw new Error('missing bridge config: ' + chainKey);
  if (!to) throw new Error('invalid destination address');

  const data = '0x' + WITHDRAW_SELECTOR.slice(2) +
    tokenAddress.slice(2).toLowerCase().padStart(64, '0') +
    BigInt(amount).toString(16).padStart(64, '0') +
    to.slice(2).toLowerCase().padStart(64, '0');

  const wallet = getWallet(chainKey);
  const tx = await wallet.sendTransaction({
    to: bridge.bridgeContract,
    data,
    gasLimit: 180000,
  });
  console.log(`[${bridge.name}] withdraw sent: ${tx.hash}`);
  const receipt = await tx.wait();
  if (!receipt || receipt.status !== 1) throw new Error('withdraw tx failed');
  return tx.hash;
}

async function releaseOnRobotX(deposit) {
  if (deposit.token !== normalizeAddress(BSC_USDT).toLowerCase()) {
    console.log('跳过非 USDT 存款:', deposit.token);
    return false;
  }

  const destAddress = normalizeAddress(deposit.destAddress);
  if (!destAddress) {
    console.error('无效目标地址:', deposit.destAddress);
    return false;
  }

  const rxAmountFull = convertAmount(deposit.amount, BRIDGES.bsc.tokenDecimals, BRIDGES.robotx.tokenDecimals);
  const rxFull = BigInt(rxAmountFull);
  if (rxFull === 0n) {
    console.error('转换后金额为 0，跳过');
    return false;
  }

  const fee = rxFull / 100n;
  const payout = rxFull - fee;
  if (payout <= 0n) {
    console.error('扣费后金额为 0，跳过');
    return false;
  }

  console.log(`[正向] BSC USDT ${deposit.amount} -> RX USDT ${payout.toString()} (fee ${fee.toString()}) -> ${destAddress}`);
  return executeBridgeWithdraw('robotx', BRIDGES.robotx.tokenContract, payout.toString(), destAddress);
}

async function retryFailedQueue() {
  if (FAILED_QUEUE.length === 0) return;
  const pending = [...FAILED_QUEUE];
  FAILED_QUEUE.length = 0;

  for (const item of pending) {
    if (GLOBAL_PROCESSED[item.txKey]) continue;
    try {
      const robotxTxHash = await releaseOnRobotX(item.deposit);
      if (robotxTxHash) {
        GLOBAL_PROCESSED[item.txKey] = {
          sender: item.deposit.sender,
          token: item.deposit.token,
          amount: item.deposit.amount,
          destAddress: item.deposit.destAddress,
          nonce: item.deposit.nonce,
          sourceTxHash: item.deposit.sourceTxHash,
          robotxTxHash,
          processedAt: new Date().toISOString(),
          retried: true,
        };
        saveJson(PROCESSED_FILE, GLOBAL_PROCESSED);
      } else {
        item.retryCount = (item.retryCount || 0) + 1;
        if (item.retryCount < 10) FAILED_QUEUE.push(item);
      }
    } catch (error) {
      item.retryCount = (item.retryCount || 0) + 1;
      if (item.retryCount < 10) FAILED_QUEUE.push(item);
      console.error('[retry] failed:', error.message);
    }
  }
}

async function verifyRobotxTx(txHash, expectedSymbol, expectedAmount) {
  if (expectedSymbol !== 'USDT') {
    return { valid: false, reason: '仅支持 USDT' };
  }

  const expectedBridge = normalizeAddress(RX_BRIDGE_CONTRACT).toLowerCase();
  const expectedToken = normalizeAddress(RX_USDT).toLowerCase();

  try {
    const receipt = await jsonRpc(ROBOTX_RPC, 'eth_getTransactionReceipt', [txHash]);
    if (!receipt) return { valid: false, reason: '交易不存在或未确认' };
    if (receipt.status !== '0x1' && receipt.status !== 1) return { valid: false, reason: '交易失败' };

    const tx = await jsonRpc(ROBOTX_RPC, 'eth_getTransactionByHash', [txHash]);
    if (!tx) return { valid: false, reason: '无法获取交易详情' };

    const contractAddr = normalizeAddress(tx.to || '').toLowerCase();
    if (contractAddr !== expectedToken) {
      return { valid: false, reason: '交易目标不是 RX USDT 合约' };
    }

    const input = (tx.input || '').toLowerCase();
    if (!input.startsWith('0xa9059cbb') || input.length < 138) {
      return { valid: false, reason: '交易不是 transfer(address,uint256)' };
    }

    const transferTo = normalizeAddress('0x' + input.slice(34, 74)).toLowerCase();
    if (transferTo !== expectedBridge) {
      return { valid: false, reason: 'USDT 未转入 RX 桥合约' };
    }

    const onChainAmount = BigInt('0x' + input.slice(74, 138));
    const requestedAmount = BigInt(expectedAmount || '0');
    if (requestedAmount > 0n && onChainAmount < requestedAmount) {
      return { valid: false, reason: `链上金额(${onChainAmount.toString()})小于请求金额(${requestedAmount.toString()})` };
    }

    return {
      valid: true,
      from: normalizeAddress(tx.from || ''),
      actualAmount: onChainAmount.toString(),
    };
  } catch (error) {
    return { valid: false, reason: 'RPC 错误: ' + error.message };
  }
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function startReverseAPI() {
  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Bridge-Key');
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.method === 'GET' && req.url === '/api/health') {
      sendJson(res, 200, { status: 'ok', uptime: process.uptime() });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/release-status')) {
      const urlObj = new URL(req.url, `http://127.0.0.1:${REVERSE_BRIDGE_PORT}`);
      const sourceTxHash = (urlObj.searchParams.get('sourceTxHash') || '').toLowerCase();
      if (!sourceTxHash) {
        sendJson(res, 400, { error: '缺少 sourceTxHash 参数' });
        return;
      }

      const found = Object.values(GLOBAL_PROCESSED).find((entry) => {
        return entry.sourceTxHash && entry.sourceTxHash.toLowerCase() === sourceTxHash;
      });

      if (found) {
        sendJson(res, 200, {
          status: 'released',
          robotxTxHash: found.robotxTxHash || '',
          token: found.token,
          destAddress: found.destAddress,
        });
      } else {
        sendJson(res, 200, { status: 'pending' });
      }
      return;
    }

    if (req.method === 'POST' && req.url === '/api/reverse-bridge') {
      if (req.headers['x-bridge-key'] !== BRIDGE_AUTH_KEY) {
        sendJson(res, 403, { error: 'Unauthorized' });
        return;
      }

      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', async () => {
        try {
          const data = JSON.parse(body || '{}');
          const txHash = (data.txHash || '').trim();
          const destChain = (data.destChain || '').trim();
          const symbol = (data.symbol || '').trim().toUpperCase();
          const amount = (data.amount || '').toString().trim();
          const destAddress = normalizeAddress(data.destAddress || '');

          if (!txHash || !destChain || !symbol || !amount || !destAddress) {
            sendJson(res, 400, { error: '缺少参数: txHash, destChain, destAddress, symbol, amount' });
            return;
          }
          if (destChain !== 'bsc') {
            sendJson(res, 400, { error: '当前仅支持反向跨链到 BSC' });
            return;
          }
          if (symbol !== 'USDT') {
            sendJson(res, 400, { error: '当前仅支持 USDT' });
            return;
          }
          if (REVERSE_PROCESSED[txHash]) {
            sendJson(res, 200, {
              status: 'already_processed',
              withdrawTx: REVERSE_PROCESSED[txHash].withdrawTx,
            });
            return;
          }

          const verification = await verifyRobotxTx(txHash, symbol, amount);
          if (!verification.valid) {
            sendJson(res, 400, { error: '交易验证失败: ' + verification.reason });
            return;
          }

          const convertedFull = convertAmount(amount, BRIDGES.robotx.tokenDecimals, BRIDGES.bsc.tokenDecimals);
          const fullAmount = BigInt(convertedFull);
          const fee = fullAmount * 4n / 100n;
          const payout = fullAmount - fee;
          if (payout <= 0n) {
            sendJson(res, 400, { error: '扣费后金额为 0' });
            return;
          }

          console.log(`[反向] RX USDT ${amount} -> BSC USDT ${payout.toString()} (fee ${fee.toString()}) -> ${destAddress}`);
          const withdrawTx = await executeBridgeWithdraw('bsc', BRIDGES.bsc.tokenContract, payout.toString(), destAddress);

          REVERSE_PROCESSED[txHash] = {
            destChain,
            destAddress,
            symbol,
            amount,
            convertedAmount: payout.toString(),
            withdrawTx,
            sender: data.sender || verification.from || '',
            processedAt: new Date().toISOString(),
          };
          saveJson(REVERSE_PROCESSED_FILE, REVERSE_PROCESSED);

          sendJson(res, 200, { status: 'success', withdrawTx });
        } catch (error) {
          console.error('[反向] 处理错误:', error.message);
          sendJson(res, 500, { error: error.message });
        }
      });
      return;
    }

    sendJson(res, 404, { error: 'Not Found' });
  });

  server.listen(REVERSE_BRIDGE_PORT, '127.0.0.1', () => {
    console.log(`[API] listening on 127.0.0.1:${REVERSE_BRIDGE_PORT}`);
  });
}

class BscPoller {
  constructor() {
    this.config = BRIDGES.bsc;
    this.lastBlock = 0;
    this.processed = GLOBAL_PROCESSED;
  }

  async getBlockNumber() {
    const hex = await jsonRpc(this.config.rpc, 'eth_blockNumber');
    return parseInt(hex, 16);
  }

  async getLogs(fromBlock, toBlock) {
    return jsonRpc(this.config.rpc, 'eth_getLogs', [{
      fromBlock: '0x' + fromBlock.toString(16),
      toBlock: '0x' + toBlock.toString(16),
      address: this.config.bridgeContract,
      topics: [DEPOSIT_TOPIC],
    }]);
  }

  async poll() {
    await retryFailedQueue();

    try {
      const latest = await this.getBlockNumber();
      const safe = latest - this.config.confirmations;

      if (this.lastBlock === 0) {
        this.lastBlock = safe;
        console.log(`[BSC] init from block ${safe}`);
        return;
      }
      if (safe <= this.lastBlock) return;

      const fromBlock = this.lastBlock + 1;
      const toBlock = Math.min(safe, fromBlock + 999);
      const logs = await this.getLogs(fromBlock, toBlock);

      if (logs && logs.length > 0) {
        console.log(`[BSC] found ${logs.length} deposits in blocks ${fromBlock}-${toBlock}`);
      }

      for (const log of logs || []) {
        const txKey = `bsc:${log.transactionHash}:${log.logIndex}`;
        if (this.processed[txKey]) continue;

        const deposit = parseDepositLog(log);
        if (!deposit) continue;
        deposit.sourceTxHash = log.transactionHash;

        try {
          const robotxTxHash = await releaseOnRobotX(deposit);
          if (robotxTxHash) {
            this.processed[txKey] = {
              sender: deposit.sender,
              token: deposit.token,
              amount: deposit.amount,
              destAddress: deposit.destAddress,
              nonce: deposit.nonce,
              sourceTxHash: deposit.sourceTxHash,
              robotxTxHash,
              processedAt: new Date().toISOString(),
            };
            saveJson(PROCESSED_FILE, this.processed);
          } else {
            FAILED_QUEUE.push({ txKey, deposit, retryCount: 0 });
          }
        } catch (error) {
          console.error('[BSC] release failed:', error.message);
          FAILED_QUEUE.push({ txKey, deposit, retryCount: 0 });
        }
      }

      this.lastBlock = toBlock;
    } catch (error) {
      if (!error.message.includes('Timeout')) {
        console.error('[BSC] poll error:', error.message);
      }
    }
  }
}

async function main() {
  ensureConfig();

  console.log('========================================');
  console.log('  ROBOTX Bridge Relayer');
  console.log('  BSC USDT <-> RX USDT');
  console.log('========================================');
  console.log('BSC bridge:', BSC_BRIDGE_CONTRACT);
  console.log('RX bridge:', RX_BRIDGE_CONTRACT);
  console.log('BSC USDT :', BSC_USDT);
  console.log('RX USDT  :', RX_USDT);
  console.log('');

  startReverseAPI();

  const poller = new BscPoller();
  const tick = async () => {
    try {
      await poller.poll();
    } catch (error) {
      console.error('poll tick error:', error.message);
    }
    setTimeout(tick, POLL_INTERVAL);
  };

  tick();
}

main().catch((error) => {
  console.error('Relayer start failed:', error);
  process.exit(1);
});
