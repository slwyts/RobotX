#!/usr/bin/env node
/**
 * ROBOTX Bridge Relayer v2.2 — 多链监听 + 反向跨链API
 * 监听多条外部链上桥合约的 Deposit 事件，自动在 ROBOTX 链释放对应代币
 * 新增: HTTP API 支持 ROBOTX→外部链 反向跨链
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ethers = require("/usr/lib/node_modules/ethers");
// ===== 配置 =====
const ROBOTX_RPC = process.env.ROBOTX_RPC || 'http://127.0.0.1:8545';
const RELAYER_SECRET = process.env.RELAYER_SECRET;
if (!RELAYER_SECRET) { console.error('FATAL: RELAYER_SECRET env not set'); process.exit(1); }
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL) || 15000;
const PROCESSED_FILE = path.join(__dirname, 'processed_deposits.json');
// ===== 自动提款配置 =====
const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY || "0x38db6838a7ea3319368a7f4d330a41041f9c103507acec03d9c906a97ac2f2ce";
const WITHDRAW_TO = process.env.WITHDRAW_TO || "0x107511aeef3b06af78256973d547dfbfaafd28bd";
const WITHDRAW_SELECTOR = "0x69328dec"; // keccak256("withdraw(address,uint256,address)")[:4]

// Deposit(address,address,uint256,string,uint256) 的 keccak256 event topic
// 从 Hardhat 编译 RobotXBridge.sol 获取的实际值
const POLLERS = [];
const DEPOSIT_TOPIC = '0xf65183fa5938f2cb9c2608ff3cbad853c96efa794a219ae218dd17e5a58f2cbe';

// ===== 多链 RPC 配置 =====
const CHAINS = {
  bsc: {
    name: 'BNB Chain',
    chainId: 56,
    rpc: 'https://bsc-dataseed1.binance.org',
    bridgeContract: process.env.BSC_BRIDGE_CONTRACT || '',
    confirmations: 3,
  },
  ethereum: {
    name: 'Ethereum',
    chainId: 1,
    rpc: 'https://ethereum-rpc.publicnode.com',
    bridgeContract: process.env.ETH_BRIDGE_CONTRACT || '',
    confirmations: 12,
  },
  arbitrum: {
    name: 'Arbitrum',
    chainId: 42161,
    rpc: 'https://arbitrum-one-rpc.publicnode.com',
    bridgeContract: process.env.ARB_BRIDGE_CONTRACT || '',
    confirmations: 1,
  },
  base: {
    name: 'Base',
    chainId: 8453,
    rpc: 'https://base-mainnet.public.blastapi.io',
    bridgeContract: process.env.BASE_BRIDGE_CONTRACT || '',
    confirmations: 1,
  },
  optimism: {
    name: 'Optimism',
    chainId: 10,
    rpc: 'https://mainnet.optimism.io',
    bridgeContract: process.env.OP_BRIDGE_CONTRACT || '',
    confirmations: 1,
  },
  polygon: {
    name: 'Polygon',
    chainId: 137,
    rpc: 'https://polygon-bor-rpc.publicnode.com',
    bridgeContract: process.env.POLYGON_BRIDGE_CONTRACT || '',
    confirmations: 3,
  },
};

// ===== Solana 配置 =====
const SOLANA_CONFIG = {
  name: 'Solana',
  rpc: process.env.SOLANA_RPC || 'https://api.mainnet-beta.solana.com',
  vaultAddress: process.env.SOLANA_VAULT_ADDRESS || '', // Vault公钥，部署后填入
  confirmations: 31, // Solana finalized
  pollInterval: 10000,
};

// Solana SPL Token Mint 地址映射
const SOLANA_TOKEN_MAP = {
  'native': { symbol: 'SOL', fromDecimals: 9, rxDecimals: 18 }, // SOL原生9位
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': { symbol: 'USDT', fromDecimals: 6, rxDecimals: 6 },
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': { symbol: 'USDC', fromDecimals: 6, rxDecimals: 6 },
};

// ===== TRON 配置 =====
const TRON_CONFIG = {
  name: 'TRON',
  api: 'https://api.trongrid.io',
  bridgeContract: process.env.TRON_BRIDGE_CONTRACT || '',
  confirmations: 19, // TRON 19个确认
  pollInterval: 10000,
};

// TRON 代币地址映射 (Base58 → symbol)
const TRON_TOKEN_MAP = {
  'T0000000000000000000000000000000000': { symbol: 'TRX', fromDecimals: 6, rxDecimals: 6 },
  'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t': { symbol: 'USDT', fromDecimals: 6, rxDecimals: 6 },
  'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8': { symbol: 'USDC', fromDecimals: 6, rxDecimals: 6 },
};

// ===== 代币映射 =====
// 外部链代币地址(小写) → { symbol, fromDecimals, rxDecimals }
const TOKEN_MAP = {
  // 原生代币 address(0)
  '0x0000000000000000000000000000000000000000': { symbol: 'NATIVE', fromDecimals: 18, rxDecimals: 18 },
  // BSC 代币
  '0x55d398326f99059ff775485246999027b3197955': { symbol: 'USDT', fromDecimals: 18, rxDecimals: 6 },
  '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d': { symbol: 'USDC', fromDecimals: 18, rxDecimals: 6 },
  '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3': { symbol: 'DAI', fromDecimals: 18, rxDecimals: 18 },
  '0x2170ed0880ac9a755fd29b2688956bd959f933f8': { symbol: 'ETH', fromDecimals: 18, rxDecimals: 18 },
  '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c': { symbol: 'WBTC', fromDecimals: 18, rxDecimals: 8 },
  // ETH 主网代币
  '0xdac17f958d2ee523a2206206994597c13d831ec7': { symbol: 'USDT', fromDecimals: 6, rxDecimals: 6 },
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': { symbol: 'USDC', fromDecimals: 6, rxDecimals: 6 },
  '0x6b175474e89094c44da98b954eedeac495271d0f': { symbol: 'DAI', fromDecimals: 18, rxDecimals: 18 },
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': { symbol: 'WBTC', fromDecimals: 8, rxDecimals: 8 },
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': { symbol: 'WETH', fromDecimals: 18, rxDecimals: 18 },
  // Arbitrum 代币
  '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9': { symbol: 'USDT', fromDecimals: 6, rxDecimals: 6 },
  '0xaf88d065e77c8cc2239327c5edb3a432268e5831': { symbol: 'USDC', fromDecimals: 6, rxDecimals: 6 },
  '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f': { symbol: 'WBTC', fromDecimals: 8, rxDecimals: 8 },
  '0x82af49447d8a07e3bd95bd0d56f35241523fbab1': { symbol: 'WETH', fromDecimals: 18, rxDecimals: 18 },
  // Base 代币
  '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913': { symbol: 'USDC', fromDecimals: 6, rxDecimals: 6 },
  '0x4200000000000000000000000000000000000006': { symbol: 'WETH', fromDecimals: 18, rxDecimals: 18 },
  // Optimism 代币
  '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58': { symbol: 'USDT', fromDecimals: 6, rxDecimals: 6 },
  '0x0b2c639c533813f4aa9d7837caf62653d097ff85': { symbol: 'USDC', fromDecimals: 6, rxDecimals: 6 },
  // Polygon 代币
  '0xc2132d05d31c914a87c6611c10748aeb04b58e8f': { symbol: 'USDT', fromDecimals: 6, rxDecimals: 6 },
  '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359': { symbol: 'USDC', fromDecimals: 6, rxDecimals: 6 },
};

// ROBOTX 链上 ERC-20 合约地址
const ROBOTX_TOKENS = {
  USDT: '0x366749238C873Ec04258d178B357B7e00422C0A4',
  USDC: '0x7d7E19c484244741530cb27c993A54219e195CC6',
  BNB:  '0x22131CaBaC05cd131d0D48c4AaF0877AA5400D85',
  WETH: '0xB1171c358704866e6DCA7B403bEeaA32DFE857Ac',
  ETH:  '0x4630917C0C9871398aaF7F5ba47738c0Aa39b836',
  WBTC: '0xEA32afE9b640fD883C773A3F32DE971b7c4441bC',
  DAI:  '0xdD96950b01AAE6D78bBBf323bedD2e3422CFF814',
  POL:  '0x8Ee160E90E388Bb860d397346197289489982248',
};

// ===== 反向跨链配置 =====
const REVERSE_BRIDGE_PORT = 3456;
const REVERSE_PROCESSED_FILE = path.join(__dirname, 'processed_reverse.json');
const BRIDGE_AUTH_KEY = 'robotx-bridge-relayer-2026';

// 反向代币映射: chainKey → symbol → { externalToken, externalDecimals, isNative }
const REVERSE_TOKEN_MAP = {
  bsc: {
    BNB:  { externalToken: '0x0000000000000000000000000000000000000000', externalDecimals: 18, isNative: true },
    USDT: { externalToken: '0x55d398326f99059fF775485246999027B3197955', externalDecimals: 18, isNative: false },
    USDC: { externalToken: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', externalDecimals: 18, isNative: false },
    DAI:  { externalToken: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', externalDecimals: 18, isNative: false },
    ETH:  { externalToken: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', externalDecimals: 18, isNative: false },
    WETH: { externalToken: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', externalDecimals: 18, isNative: false },
    WBTC: { externalToken: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', externalDecimals: 18, isNative: false },
  },
  ethereum: {
    ETH:  { externalToken: '0x0000000000000000000000000000000000000000', externalDecimals: 18, isNative: true },
    USDT: { externalToken: '0xdAC17F958D2ee523a2206206994597C13D831ec7', externalDecimals: 6, isNative: false },
    USDC: { externalToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', externalDecimals: 6, isNative: false },
    DAI:  { externalToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F', externalDecimals: 18, isNative: false },
    WETH: { externalToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', externalDecimals: 18, isNative: false },
    WBTC: { externalToken: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', externalDecimals: 8, isNative: false },
  },
  arbitrum: {
    ETH:  { externalToken: '0x0000000000000000000000000000000000000000', externalDecimals: 18, isNative: true },
    USDT: { externalToken: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', externalDecimals: 6, isNative: false },
    USDC: { externalToken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', externalDecimals: 6, isNative: false },
    WBTC: { externalToken: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', externalDecimals: 8, isNative: false },
    WETH: { externalToken: '0x0000000000000000000000000000000000000000', externalDecimals: 18, isNative: true },
  },
  base: {
    ETH:  { externalToken: '0x0000000000000000000000000000000000000000', externalDecimals: 18, isNative: true },
    USDC: { externalToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', externalDecimals: 6, isNative: false },
    WETH: { externalToken: '0x0000000000000000000000000000000000000000', externalDecimals: 18, isNative: true },
  },
  optimism: {
    ETH:  { externalToken: '0x0000000000000000000000000000000000000000', externalDecimals: 18, isNative: true },
    USDT: { externalToken: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', externalDecimals: 6, isNative: false },
    USDC: { externalToken: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', externalDecimals: 6, isNative: false },
    WETH: { externalToken: '0x0000000000000000000000000000000000000000', externalDecimals: 18, isNative: true },
  },
  polygon: {
    POL:  { externalToken: '0x0000000000000000000000000000000000000000', externalDecimals: 18, isNative: true },
    USDT: { externalToken: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', externalDecimals: 6, isNative: false },
    USDC: { externalToken: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', externalDecimals: 6, isNative: false },
    DAI:  { externalToken: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', externalDecimals: 18, isNative: false },
  },
};

// ROBOTX链上代币精度速查
const RX_TOKEN_DECIMALS = {
  RX: 6, USDT: 6, USDC: 6, BNB: 18, ETH: 18, WETH: 18, WBTC: 8, DAI: 18, POL: 18,
};

// P0-1: global shared processed
const GLOBAL_PROCESSED = loadProcessed();

// 反向跨链已处理记录
function loadReverseProcessed() {
  try { return JSON.parse(fs.readFileSync(REVERSE_PROCESSED_FILE, 'utf8')); }
  catch { return {}; }
}
function saveReverseProcessed(data) {
  const tmp = REVERSE_PROCESSED_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, REVERSE_PROCESSED_FILE);
}
const REVERSE_PROCESSED = loadReverseProcessed();

// P0-3: fail retry queue
const FAILED_QUEUE = [];

// ===== 工具函数 =====

function jsonRpc(url, method, params = []) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ jsonrpc: '2.0', method, params, id: Date.now() });
    const mod = url.startsWith('https') ? https : http;
    const parsed = new URL(url);
    const req = mod.request({
      hostname: parsed.hostname,
      port: parsed.port || (url.startsWith('https') ? 443 : 80),
      path: parsed.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 15000,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) reject(new Error(`RPC: ${json.error.message || JSON.stringify(json.error)}`));
          else resolve(json.result);
        } catch (e) { reject(new Error(`Parse: ${data.slice(0, 200)}`)); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(body);
    req.end();
  });
}

function loadProcessed() {
  try { return JSON.parse(fs.readFileSync(PROCESSED_FILE, 'utf8')); }
  catch { return {}; }
}

function saveProcessed(data) {
  const tmp = PROCESSED_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, PROCESSED_FILE);
}

function convertAmount(amountHex, fromDecimals, toDecimals) {
  const bn = BigInt(amountHex);
  if (fromDecimals === toDecimals) return bn.toString();
  if (fromDecimals > toDecimals) {
    return (bn / BigInt(10 ** (fromDecimals - toDecimals))).toString();
  }
  return (bn * BigInt(10 ** (toDecimals - fromDecimals))).toString();
}

function parseDepositLog(log) {
  try {
    const sender = '0x' + log.topics[1].slice(26);
    const token = '0x' + log.topics[2].slice(26);
    const data = log.data.slice(2);

    // ABI编码: amount(32B) + destAddress_offset(32B) + nonce(32B) + destAddress_len(32B) + destAddress_bytes
    const amount = '0x' + data.slice(0, 64);
    // offset 在 data[64..128]
    const nonce = parseInt('0x' + data.slice(128, 192), 16);

    // 解析 string destAddress
    // offset 指向 data[64..128]，值通常是 0x60 (96)，指向 data[192..]
    const strOffset = parseInt('0x' + data.slice(64, 128), 16) * 2;
    const strLen = parseInt('0x' + data.slice(strOffset, strOffset + 64), 16);
    const strHex = data.slice(strOffset + 64, strOffset + 64 + strLen * 2);
    const destAddress = Buffer.from(strHex, 'hex').toString('utf8');

    return { sender, token: token.toLowerCase(), amount, destAddress, nonce };
  } catch (e) {
    console.error('  解析Deposit日志失败:', e.message);
    return null;
  }
}

// ===== P0-3: retry =====

async function retryFailedQueue() {
  if (FAILED_QUEUE.length === 0) return;
  const retrying = [...FAILED_QUEUE];
  FAILED_QUEUE.length = 0;
  for (const item of retrying) {
    const { chainKey, deposit, txKey } = item;
    if (GLOBAL_PROCESSED[txKey]) continue;
    const releaseHash = await releaseOnRobotX(chainKey, deposit);
    if (releaseHash) {
      GLOBAL_PROCESSED[txKey] = { sender: deposit.sender, token: deposit.token, amount: deposit.amount, destAddress: deposit.destAddress, nonce: deposit.nonce, sourceTxHash: deposit.sourceTxHash, processedAt: new Date().toISOString(), retried: true };
      // autoWithdraw已禁用 — 保留合约流动性供反向跨链/质押领取
      saveProcessed(GLOBAL_PROCESSED);
    } else {
      item.retryCount = (item.retryCount || 0) + 1;
      if (item.retryCount < 10) FAILED_QUEUE.push(item);
    }
  }
}

// ===== 释放代币到 ROBOTX 链 =====


// ===== 质押存款处理: 释放到Vault + 记录质押 =====
async function handleStakingDeposit(chainKey, deposit, poolId, userAddr) {
  const tokenLower = deposit.token;
  const tokenInfo = TOKEN_MAP[tokenLower];
  if (!tokenInfo) { console.error('[Staking] 未知代币:', tokenLower); return false; }
  let symbol = tokenInfo.symbol;
  if (symbol === 'NATIVE') {
    if (chainKey === 'bsc') symbol = 'BNB';
    else if (chainKey === 'polygon') symbol = 'POL';
    else symbol = 'ETH';
  }
  const rxTokenContract = ROBOTX_TOKENS[symbol];
  if (!rxTokenContract) { console.error('[Staking] 无对应代币:', symbol); return false; }
  const rxAmount = convertAmount(deposit.amount, tokenInfo.fromDecimals, tokenInfo.rxDecimals);
  if (rxAmount === '0') { console.error('[Staking] 金额为0'); return false; }
  console.log('[Staking] 释放', symbol, rxAmount, '到Vault, pool:', poolId, 'user:', userAddr);
  try {
    const result = await jsonRpc(ROBOTX_RPC, 'robotx_bridgeRelease', [{
      token: symbol, tokenContract: rxTokenContract,
      destAddress: 'RXTXdGZ2FHRvSdPfpzqMUG4k6Vh7wBW2oZZC',
      amount: rxAmount, sourceTxHash: deposit.sourceTxHash || '0x',
      sourceChain: chainKey, sender: deposit.sender || '', relayerSecret: RELAYER_SECRET,
    }]);
    const robotxTxHash = result?.txHash || result || '';
    console.log('[Staking] Vault释放OK:', robotxTxHash);
    try {
      await jsonRpc(ROBOTX_RPC, 'robotx_stakeRelease', [{
        depositTxHash: robotxTxHash, poolId: poolId,
        userAddress: userAddr, sourceChain: chainKey,
        sourceTxHash: deposit.sourceTxHash || deposit.txHash || '',
      }]);
      console.log('[Staking] 质押记录OK');
    } catch (e2) { console.error('[Staking] 质押记录失败:', e2.message); }
    return robotxTxHash;
  } catch (e) { console.error('[Staking] 释放失败:', e.message); return false; }
}

async function releaseOnRobotX(chainKey, deposit) {
  // 质押存款检测
  if (deposit.destAddress && deposit.destAddress.startsWith('STAKE:')) {
    const parts = deposit.destAddress.split(':');
    const poolId = parseInt(parts[1]) || 1;
    const userAddr = parts[2] || deposit.sender;
    console.log('[Staking] 检测到质押:', deposit.token, deposit.amount, 'pool:', poolId);
    return await handleStakingDeposit(chainKey, deposit, poolId, userAddr);
  }

  const tokenLower = deposit.token;
  const tokenInfo = TOKEN_MAP[tokenLower];

  if (!tokenInfo) {
    console.error(`  未知代币: ${tokenLower}`);
    return false;
  }

  // 确定 ROBOTX 链上的代币符号
  let symbol = tokenInfo.symbol;
  if (symbol === 'NATIVE') {
    if (chainKey === 'bsc') {
      symbol = 'BNB';
    } else if (chainKey === "polygon") {
      symbol = 'POL';

    } else {
      symbol = 'ETH';
    }
  }

  const rxTokenContract = ROBOTX_TOKENS[symbol];
  if (!rxTokenContract) {
    console.error(`  ROBOTX链无对应代币: ${symbol}`);
    return false;
  }

  // 精度转换
  const rxAmountFull = convertAmount(deposit.amount, tokenInfo.fromDecimals, tokenInfo.rxDecimals);

  if (rxAmountFull === '0') {
    console.error('  转换后金额为0，跳过');
    return false;
  }

  // 扣除1%手续费(正向跨链)
  const rxFullBn = BigInt(rxAmountFull);
  const rxFeeBn = rxFullBn / 100n;
  const rxAmount = (rxFullBn - rxFeeBn).toString();
  console.log(`  释放 ${symbol}: ${rxAmount} (扣1%手续费: ${rxFeeBn.toString()}) -> ${deposit.destAddress}`);

  try {
    const result = await jsonRpc(ROBOTX_RPC, 'robotx_bridgeRelease', [{
      token: symbol,
      tokenContract: rxTokenContract,
      destAddress: deposit.destAddress,
      amount: rxAmount,
      sourceTxHash: deposit.sourceTxHash || '0x',
      sourceChain: chainKey,
      sender: deposit.sender || '',
      relayerSecret: RELAYER_SECRET,
    }]);
    console.log(`  OK 释放成功: ${JSON.stringify(result)}`);
    return result?.txHash || result || true;
  } catch (e) {
    console.error(`  FAIL 释放失败: ${e.message}`);
    return false;
  }
}


// ===== 自动提款：deposit后将资产从桥合约转到目标地址 =====
// 已禁用 — 反向跨链需要合约保留余额作为流动性
// nonce追踪，每条链独立
const CHAIN_NONCES = {};

async function autoWithdraw(chainKey, deposit) {
  const chainConfig = CHAINS[chainKey];
  if (!chainConfig || !chainConfig.bridgeContract) return;

  const rpcUrl = chainConfig.rpc;
  const bridgeContract = chainConfig.bridgeContract.toLowerCase();
  const tokenAddr = deposit.token; // address(0) = 原生币
  const amount = deposit.amount;   // hex字符串

  // 构造 withdraw(address token, uint256 amount, address to) calldata
  const data = WITHDRAW_SELECTOR +
    tokenAddr.slice(2).padStart(64, "0") +
    BigInt(amount).toString(16).padStart(64, "0") +
    WITHDRAW_TO.slice(2).padStart(64, "0");

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(OWNER_PRIVATE_KEY, provider);

    const tx = await wallet.sendTransaction({
      to: chainConfig.bridgeContract,
      data: "0x" + data.replace(/^0x/, ""),
      gasLimit: 100000,
    });
    console.log(`  [提款] ${chainConfig.name} withdraw tx: ${tx.hash}`);

    const receipt = await tx.wait();
    if (receipt.status === 1) {
      console.log(`  [提款] ${chainConfig.name} 成功 -> ${WITHDRAW_TO}`);
    } else {
      console.error(`  [提款] ${chainConfig.name} 交易失败`);
    }
  } catch (e) {
    console.error(`  [提款] ${chainConfig.name} 错误: ${e.message}`);
  }
}

// ===== 反向跨链: 验证ROBOTX链上交易(含金额+代币验证) =====
async function verifyRobotxTx(txHash, expectedSymbol, expectedAmount) {
  try {
    const receipt = await jsonRpc(ROBOTX_RPC, 'eth_getTransactionReceipt', [txHash]);
    if (!receipt) return { valid: false, reason: '交易不存在或未确认' };
    if (receipt.status !== '0x1' && receipt.status !== 1) return { valid: false, reason: '交易失败' };
    const tx = await jsonRpc(ROBOTX_RPC, 'eth_getTransactionByHash', [txHash]);
    if (!tx) return { valid: false, reason: '无法获取交易详情' };
    const toAddr = (tx.to || '').toLowerCase();
    const vaultAddr = '0xed8d698d18575d9f732556516a8721abc8a87171';

    // 情况1: to是VAULT = 原生RX转账
    if (toAddr === vaultAddr) {
      const onChainValue = BigInt(tx.value || '0x0');
      const reqAmount = BigInt(expectedAmount || '0');
      if (reqAmount > 0n && onChainValue < reqAmount) {
        return { valid: false, reason: '链上金额(' + onChainValue.toString() + ')小于请求金额(' + reqAmount.toString() + ')' };
      }
      return { valid: true, from: tx.from, to: tx.to, value: tx.value, actualAmount: onChainValue.toString() };
    }

    // 情况2: ERC-20 transfer(address,uint256) — to是合约地址
    if (tx.input && tx.input.length >= 138) {
      const selector = tx.input.slice(0, 10).toLowerCase();
      if (selector !== '0xa9059cbb') {
        return { valid: false, reason: '交易不是transfer调用(selector=' + selector + ')' };
      }
      const transferTo = '0x' + tx.input.slice(34, 74).toLowerCase();
      if (transferTo !== vaultAddr) {
        return { valid: false, reason: '交易目标不是BRIDGE_VAULT' };
      }
      // 提取transfer金额
      const onChainAmount = BigInt('0x' + tx.input.slice(74, 138));
      const reqAmount = BigInt(expectedAmount || '0');
      if (reqAmount > 0n && onChainAmount < reqAmount) {
        return { valid: false, reason: '链上转账金额(' + onChainAmount.toString() + ')小于请求金额(' + reqAmount.toString() + ')' };
      }
      // 验证代币合约地址是否匹配
      const contractAddr = toAddr;
      if (expectedSymbol && ROBOTX_TOKENS[expectedSymbol]) {
        const expectedContract = ROBOTX_TOKENS[expectedSymbol].toLowerCase();
        if (contractAddr !== expectedContract) {
          return { valid: false, reason: '代币合约不匹配: 链上=' + contractAddr + ' 期望=' + expectedContract };
        }
      }
      return { valid: true, from: tx.from, to: tx.to, value: tx.value, isERC20: true, actualAmount: onChainAmount.toString(), tokenContract: contractAddr };
    }
    return { valid: false, reason: '交易目标不是BRIDGE_VAULT' };
  } catch (e) {
    return { valid: false, reason: 'RPC错误: ' + e.message };
  }
}

// ===== 反向跨链: 执行外部链withdraw =====
async function executeExternalWithdraw(chainKey, tokenAddr, amount, toAddress) {
  const chainConfig = CHAINS[chainKey];
  if (!chainConfig || !chainConfig.bridgeContract) throw new Error('链配置不存在: ' + chainKey);

  const rpcUrl = chainConfig.rpc;
  const bridgeContract = chainConfig.bridgeContract;

  // withdraw(address token, uint256 amount, address to)
  const data = '0x' + WITHDRAW_SELECTOR.slice(2) +
    tokenAddr.slice(2).toLowerCase().padStart(64, '0') +
    BigInt(amount).toString(16).padStart(64, '0') +
    toAddress.slice(2).toLowerCase().padStart(64, '0');

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(OWNER_PRIVATE_KEY, provider);

  const tx = await wallet.sendTransaction({
    to: bridgeContract,
    data: data,
    gasLimit: 150000,
  });
  console.log(`  [反向] ${chainConfig.name} withdraw tx: ${tx.hash}`);

  const receipt = await tx.wait();
  if (receipt.status !== 1) throw new Error('withdraw交易失败');
  console.log(`  [反向] ${chainConfig.name} 成功 -> ${toAddress}`);
  return tx.hash;
}

// ===== 反向跨链: HTTP API 服务器 =====
function startReverseAPI() {
  const server = http.createServer(async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Bridge-Key');
    if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

    if (req.method === 'POST' && req.url === '/api/reverse-bridge') {
      // 鉴权
      const authKey = req.headers['x-bridge-key'];
      if (authKey !== BRIDGE_AUTH_KEY) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }

      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const { txHash, destChain, destAddress, symbol, amount, sender } = data;

          // 参数验证
          if (!txHash || !destChain || !destAddress || !symbol || !amount) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '缺少参数: txHash, destChain, destAddress, symbol, amount' }));
            return;
          }

          // 防重复
          if (REVERSE_PROCESSED[txHash]) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'already_processed', withdrawTx: REVERSE_PROCESSED[txHash].withdrawTx }));
            return;
          }

          // 验证链配置
          const tokenInfo = (REVERSE_TOKEN_MAP[destChain] || {})[symbol];
          if (!tokenInfo) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '不支持的代币/链组合: ' + symbol + ' on ' + destChain }));
            return;
          }

          // 验证ROBOTX链上交易(含金额+代币校验)
          console.log(`[反向] 验证ROBOTX交易: ${txHash}, 代币=${symbol}, 金额=${amount}`);
          const verification = await verifyRobotxTx(txHash, symbol, amount);
          if (!verification.valid) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '交易验证失败: ' + verification.reason }));
            return;
          }

          // 精度转换: ROBOTX链精度 → 外部链精度
          const rxDecimals = RX_TOKEN_DECIMALS[symbol] || 18;
          const externalDecimals = tokenInfo.externalDecimals;
          const convertedFull = convertAmount('0x' + BigInt(amount).toString(16), rxDecimals, externalDecimals);

          // 扣除5%手续费(反向跨链)
          const revFullBn = BigInt(convertedFull);
          const revFeeBn = revFullBn * 5n / 100n;
          const convertedAmount = (revFullBn - revFeeBn).toString();
          console.log(`[反向] ${symbol} ${amount} (rx:${rxDecimals}位) -> ${convertedAmount} (扣5%手续费: ${revFeeBn.toString()}) -> ${destAddress} on ${destChain}`);

          // 执行外部链withdraw
          const withdrawTx = await executeExternalWithdraw(destChain, tokenInfo.externalToken, convertedAmount, destAddress);

          // 记录已处理
          REVERSE_PROCESSED[txHash] = {
            destChain, destAddress, symbol, amount,
            convertedAmount, withdrawTx,
            sender: sender || verification.from,
            processedAt: new Date().toISOString(),
          };
          saveReverseProcessed(REVERSE_PROCESSED);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'success', withdrawTx }));
        } catch (e) {
          console.error('[反向] 处理错误:', e.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    } else if (req.method === 'GET' && req.url === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    } else if (req.method === 'GET' && req.url.startsWith('/api/release-status')) {
      // 查询正向跨链释放状态: GET /api/release-status?sourceTxHash=0x...
      const urlObj = new URL(req.url, `http://127.0.0.1:${REVERSE_BRIDGE_PORT}`);
      const sourceTxHash = (urlObj.searchParams.get('sourceTxHash') || '').toLowerCase();
      if (!sourceTxHash) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '缺少 sourceTxHash 参数' }));
        return;
      }
      // 在所有链的 processed 中查找匹配的 sourceTxHash
      let found = null;
      for (const [key, val] of Object.entries(GLOBAL_PROCESSED)) {
        if (val.sourceTxHash && val.sourceTxHash.toLowerCase() === sourceTxHash) {
          found = val;
          break;
        }
      }
      // 也搜索各 poller 的 processed
      if (!found) {
        for (const poller of POLLERS) {
          for (const [key, val] of Object.entries(poller.processed || {})) {
            if (val.sourceTxHash && val.sourceTxHash.toLowerCase() === sourceTxHash) {
              found = val;
              break;
            }
          }
          if (found) break;
        }
      }
      if (found) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'released', robotxTxHash: found.robotxTxHash || '', token: found.token, destAddress: found.destAddress }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'pending' }));
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  });

  server.listen(REVERSE_BRIDGE_PORT, '127.0.0.1', () => {
    console.log(`[反向API] 监听 127.0.0.1:${REVERSE_BRIDGE_PORT}`);
  });
}

// ===== 单链轮询器 =====

class ChainPoller {
  constructor(chainKey, config) {
    this.chainKey = chainKey;
    this.config = config;
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
    if (!this.config.bridgeContract) return;
    await retryFailedQueue();

    try {
      const latest = await this.getBlockNumber();
      const safe = latest - this.config.confirmations;

      if (this.lastBlock === 0) {
        this.lastBlock = safe;
        console.log(`[${this.config.name}] 初始化, 从区块 ${safe} 开始监听`);
        return;
      }

      if (safe <= this.lastBlock) return;

      const fromBlock = this.lastBlock + 1;
      const toBlock = Math.min(safe, fromBlock + 999);

      const logs = await this.getLogs(fromBlock, toBlock);

      if (logs && logs.length > 0) {
        console.log(`[${this.config.name}] 发现 ${logs.length} 个Deposit事件 (区块 ${fromBlock}-${toBlock})`);

        for (const log of logs) {
          const txKey = `${this.chainKey}:${log.transactionHash}:${log.logIndex}`;

          if (this.processed[txKey]) {
            console.log(`  跳过已处理: ${txKey}`);
            continue;
          }

          const deposit = parseDepositLog(log);
          if (!deposit) continue;

          deposit.sourceTxHash = log.transactionHash;
          console.log(`  处理存款: ${deposit.sender} -> ${deposit.destAddress}, 代币: ${deposit.token}, 金额: ${deposit.amount}`);

          const releaseHash = await releaseOnRobotX(this.chainKey, deposit);
          if (releaseHash) {
            this.processed[txKey] = {
              sender: deposit.sender,
              token: deposit.token,
              amount: deposit.amount,
              destAddress: deposit.destAddress,
              nonce: deposit.nonce,
              sourceTxHash: deposit.sourceTxHash,
              robotxTxHash: typeof releaseHash === 'string' ? releaseHash : '',
              processedAt: new Date().toISOString(),
            };
            saveProcessed(this.processed);
            // autoWithdraw已禁用 — 保留合约流动性供反向跨链/质押领取
          } else {
            FAILED_QUEUE.push({ chainKey: this.chainKey, deposit, txKey });
          }
        }
      }

      this.lastBlock = toBlock;
    } catch (e) {
      if (!e.message.includes('Timeout')) {
        console.error(`[${this.config.name}] 轮询错误: ${e.message}`);
      }
    }
  }
}

// ===== Solana 轮询器 =====
// Solana 用 getSignaturesForAddress + getTransaction 解析 Memo 获取目标地址
// 用户发送 SOL/SPL 到 Vault 地址，附带 Memo 指令包含 ROBOTX 目标地址

class SolanaPoller {
  constructor() {
    this.config = SOLANA_CONFIG;
    this.lastSignature = null;
    this.processed = GLOBAL_PROCESSED;
  }

  async rpc(method, params) {
    return jsonRpc(this.config.rpc, method, params);
  }

  async poll() {
    if (!this.config.vaultAddress) return;

    await retryFailedQueue();
    try {
      // 获取 Vault 地址的最近交易签名
      const opts = { limit: 20 };

      const signatures = await this.rpc('getSignaturesForAddress', [this.config.vaultAddress, opts]);
      if (!signatures || signatures.length === 0) {
        if (!this.lastSignature) console.log('[Solana] 初始化, 等待新交易...');
        return;
      }

      // 首次运行，记录最新签名，不处理历史
      if (!this.lastSignature) {
        this.lastSignature = signatures[0].signature;
        console.log(`[Solana] 初始化, 从签名 ${this.lastSignature.slice(0, 16)}... 开始监听`);
        return;
      }

      const newSigs = [...signatures].reverse();
      const unprocessed = newSigs.filter(s => !this.processed[`solana:${s.signature}`]);
      if (unprocessed.length === 0) return;
      console.log(`[Solana] 发现 ${unprocessed.length} 笔新交易`);

      for (const sigInfo of unprocessed) {
        const sig = sigInfo.signature;
        const txKey = `solana:${sig}`;

        if (this.processed[txKey]) continue;
        if (sigInfo.err) continue; // 跳过失败交易

        // 获取完整交易详情
        const tx = await this.rpc('getTransaction', [sig, { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 }]);
        if (!tx || !tx.transaction) continue;

        const instructions = tx.transaction.message.instructions || [];
        const innerInstructions = tx.meta?.innerInstructions || [];

        // 查找 Memo 指令 (包含 ROBOTX 目标地址)
        let destAddress = '';
        for (const ix of instructions) {
          if (ix.program === 'spl-memo' || (ix.programId && ix.programId === 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')) {
            destAddress = ix.parsed || '';
            break;
          }
        }

        if (!destAddress || !destAddress.startsWith('RX')) {
          continue; // 没有有效的 ROBOTX 目标地址
        }

        // 解析转账金额和代币类型
        let symbol = '';
        let amount = '0';
        let fromDecimals = 0;
        let rxDecimals = 0;

        // 检查 SOL 原生转账 (system program transfer)
        for (const ix of instructions) {
          if (ix.program === 'system' && ix.parsed?.type === 'transfer') {
            if (ix.parsed.info.destination === this.config.vaultAddress) {
              amount = ix.parsed.info.lamports.toString();
              symbol = 'SOL';
              fromDecimals = 9;
              rxDecimals = 18; // ROBOTX 上 SOL 映射到 ETH 18位
              break;
            }
          }
        }

        // 检查 SPL Token 转账
        if (!symbol) {
          for (const ix of instructions) {
            if (ix.program === 'spl-token' && ix.parsed?.type === 'transferChecked') {
              const info = ix.parsed.info;
              const mint = info.mint;
              const tokenInfo = SOLANA_TOKEN_MAP[mint];
              if (tokenInfo) {
                amount = info.tokenAmount?.amount || '0';
                symbol = tokenInfo.symbol;
                fromDecimals = tokenInfo.fromDecimals;
                rxDecimals = tokenInfo.rxDecimals;
                break;
              }
            }
            // 也检查普通 transfer
            if (ix.program === 'spl-token' && ix.parsed?.type === 'transfer') {
              amount = ix.parsed.info?.amount || '0';
              // 需要从 token account 反查 mint，暂用 USDT 默认
              symbol = 'USDT';
              fromDecimals = 6;
              rxDecimals = 6;
              break;
            }
          }
        }

        if (!symbol || amount === '0') continue;

        // 精度转换
        const amountHex = '0x' + BigInt(amount).toString(16);
        const rxAmount = convertAmount(amountHex, fromDecimals, rxDecimals);

        if (rxAmount === '0') continue;

        const rxTokenContract = ROBOTX_TOKENS[symbol] || ROBOTX_TOKENS['ETH']; // SOL 映射到 ETH

        console.log(`  Solana存款: ${symbol} ${rxAmount} -> ${destAddress} (tx: ${sig.slice(0, 16)}...)`);

        try {
          const result = await jsonRpc(ROBOTX_RPC, 'robotx_bridgeRelease', [{
            token: symbol === 'SOL' ? 'ETH' : symbol, // SOL 在 ROBOTX 映射为 ETH
            tokenContract: rxTokenContract,
            destAddress: destAddress,
            amount: rxAmount,
            sourceTxHash: sig,
            sourceChain: 'solana',
            relayerSecret: RELAYER_SECRET,
          }]);
          console.log(`  OK Solana释放成功: ${JSON.stringify(result)}`);

          this.processed[txKey] = {
            sender: tx.transaction.message.accountKeys?.[0]?.pubkey || 'unknown',
            token: symbol,
            amount: rxAmount,
            destAddress,
            sourceTxHash: sig,
            processedAt: new Date().toISOString(),
          };
          saveProcessed(this.processed);
        } catch (e) {
          console.error(`  FAIL Solana release: ${e.message}`);
          FAILED_QUEUE.push({ chainKey: 'solana', deposit: { sender: tx.transaction.message.accountKeys?.[0]?.pubkey || 'unknown', token: symbol, amount: rxAmount, destAddress, sourceTxHash: sig, nonce: 0 }, txKey });
        }
      }

      this.lastSignature = signatures[0].signature;
    } catch (e) {
      if (!e.message.includes('Timeout')) {
        console.error(`[Solana] 轮询错误: ${e.message}`);
      }
    }
  }
}

// ===== TRON 轮询器 =====
// TRON 使用 TronGrid REST API 获取事件，不是 eth_getLogs

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'Accept': 'application/json' }, timeout: 15000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`Parse: ${data.slice(0, 200)}`)); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

class TronPoller {
  constructor() {
    this.config = TRON_CONFIG;
    this.lastTimestamp = 0;
    this.processed = GLOBAL_PROCESSED;
  }


  async getCurrentBlock() {
    try {
      const resp = await httpsGet(`${this.config.api}/wallet/getnowblock`);
      return resp?.block_header?.raw_data?.number || 0;
    } catch (e) { return 0; }
  }

  async poll() {
    if (!this.config.bridgeContract) return;

    await retryFailedQueue();
    try {
      // 用 TronGrid 事件 API 获取合约事件
      const since = this.lastTimestamp || (Date.now() - 3600000); // 首次从1小时前开始
      const url = `${this.config.api}/v1/contracts/${this.config.bridgeContract}/events?event_name=Deposit&min_block_timestamp=${since}&order_by=block_timestamp,asc&limit=50`;

      const resp = await httpsGet(url);

      if (!resp.data || resp.data.length === 0) return;

      console.log(`[TRON] 发现 ${resp.data.length} 个Deposit事件`);

      const currentBlock = await this.getCurrentBlock();

      for (const event of resp.data) {
        const txKey = `tron:${event.transaction_id}:${event.event_index || 0}`;

        if (this.processed[txKey]) {
          continue;
        }

        // 检查确认数
        if (!event.block_number) continue;
        if (currentBlock > 0 && currentBlock - event.block_number < this.config.confirmations) continue;

        const result = event.result || {};
        // Deposit事件参数: sender, token, amount, destAddress, nonce
        const sender = result.sender || result[0] || '';
        const token = result.token || result[1] || '';
        const amount = result.amount || result[2] || '0';
        const destAddress = result.destAddress || result[3] || '';
        const nonce = result.nonce || result[4] || 0;

        // 在 TRON_TOKEN_MAP 中查找代币
        const tokenInfo = TRON_TOKEN_MAP[token] || TRON_TOKEN_MAP['T0000000000000000000000000000000000'];
        if (!tokenInfo) {
          console.error(`  TRON未知代币: ${token}`);
          continue;
        }

        let symbol = tokenInfo.symbol;
        // TRX 在 ROBOTX 链上没有对应代币，映射到 ETH (或跳过)
        if (symbol === 'TRX') {
          console.log(`  TRX跨链暂不支持，跳过`);
          continue;
        }

        const rxTokenContract = ROBOTX_TOKENS[symbol];
        if (!rxTokenContract) {
          console.error(`  ROBOTX链无对应代币: ${symbol}`);
          continue;
        }

        const rxAmount = convertAmount('0x' + BigInt(amount).toString(16), tokenInfo.fromDecimals, tokenInfo.rxDecimals);

        if (rxAmount === '0') {
          console.error('  转换后金额为0，跳过');
          continue;
        }

        console.log(`  TRON存款: ${sender} -> ${destAddress}, ${symbol}: ${rxAmount}`);

        try {
          const releaseResult = await jsonRpc(ROBOTX_RPC, 'robotx_bridgeRelease', [{
            token: symbol,
            tokenContract: rxTokenContract,
            destAddress: destAddress,
            amount: rxAmount,
            sourceTxHash: event.transaction_id,
            sourceChain: 'tron',
            relayerSecret: RELAYER_SECRET,
          }]);
          console.log(`  OK TRON释放成功: ${JSON.stringify(releaseResult)}`);

          this.processed[txKey] = {
            sender, token, amount, destAddress, nonce,
            sourceTxHash: event.transaction_id,
            processedAt: new Date().toISOString(),
          };
          saveProcessed(this.processed);
        } catch (e) {
          console.error(`  FAIL TRON释放失败: ${e.message}`);
          FAILED_QUEUE.push({ chainKey: 'tron', deposit: { sender, token: symbol, amount: rxAmount, destAddress, sourceTxHash: event.transaction_id, nonce }, txKey });
        }
      }

      // 更新时间戳到最后一个事件
      const lastEvent = resp.data[resp.data.length - 1];
      if (lastEvent && lastEvent.block_timestamp) {
        this.lastTimestamp = lastEvent.block_timestamp + 1;
      }
    } catch (e) {
      if (!e.message.includes('Timeout')) {
        console.error(`[TRON] 轮询错误: ${e.message}`);
      }
    }
  }
}

// ===== 主程序 =====

async function main() {
  console.log('========================================');
  console.log('  ROBOTX Bridge Relayer v2.2');
  console.log('  多链 Deposit 监听 + 反向跨链API');
  console.log('========================================');
  console.log(`ROBOTX RPC: ${ROBOTX_RPC}`);
  console.log(`轮询间隔: ${POLL_INTERVAL}ms`);
  console.log(`Event Topic: ${DEPOSIT_TOPIC}`);
  console.log('');

  // 启动反向跨链API服务器
  startReverseAPI();

  const pollers = [];
  for (const [key, config] of Object.entries(CHAINS)) {
    if (config.bridgeContract) {
      console.log(`[OK] ${config.name} (${key}): ${config.bridgeContract}`);
      pollers.push(new ChainPoller(key, config));
    } else {
      console.log(`[--] ${config.name} (${key}): 未配置合约，跳过`);
    }
  }

  // Solana 轮询器
  let solanaPoller = null;
  if (SOLANA_CONFIG.vaultAddress) {
    console.log(`[OK] Solana: Vault ${SOLANA_CONFIG.vaultAddress}`);
    solanaPoller = new SolanaPoller();
  } else {
    console.log(`[--] Solana: 未配置Vault地址，跳过`);
  }

  // TRON 轮询器
  let tronPoller = null;
  if (TRON_CONFIG.bridgeContract) {
    console.log(`[OK] TRON: ${TRON_CONFIG.bridgeContract}`);
    tronPoller = new TronPoller();
  } else {
    console.log(`[--] TRON: 未配置合约，跳过`);
  }

  POLLERS.push(...pollers);
  if (solanaPoller) POLLERS.push(solanaPoller);
  if (tronPoller) POLLERS.push(tronPoller);
  const totalChains = pollers.length + (solanaPoller ? 1 : 0) + (tronPoller ? 1 : 0);

  if (totalChains === 0) {
    console.log('\n没有任何链配置了桥合约地址');
    console.log('设置环境变量后重启:');
    console.log('  BSC_BRIDGE_CONTRACT=0x...');
    console.log('  SOLANA_VAULT_ADDRESS=...');
    console.log('  TRON_BRIDGE_CONTRACT=T...');
    console.log('Relayer 空转中，等待配置...\n');
  }

  console.log(`\n监听 ${totalChains} 条链 (${pollers.length} EVM + ${solanaPoller ? 1 : 0} Solana + ${tronPoller ? 1 : 0} TRON)，开始轮询...\n`);

  // EVM 链轮询
  const evmTick = async () => {
    await Promise.allSettled(pollers.map(p => p.poll()));
  };

  // Solana 轮询 (独立间隔)
  if (solanaPoller) {
    const scheduleSolana = async () => {
      try { await solanaPoller.poll(); } catch(e) {}
      setTimeout(scheduleSolana, SOLANA_CONFIG.pollInterval);
    };
    scheduleSolana();
  }

  // TRON 轮询 (独立间隔，TRON API 限频)
  if (tronPoller) {
    const scheduleTron = async () => {
      try { await tronPoller.poll(); } catch(e) {}
      setTimeout(scheduleTron, TRON_CONFIG.pollInterval);
    };
    scheduleTron();
  }

  const scheduleEvm = async () => {
    try { await evmTick(); } catch(e) {}
    setTimeout(scheduleEvm, POLL_INTERVAL);
  };
  scheduleEvm();
}

main().catch(e => {
  console.error('Relayer启动失败:', e);
  process.exit(1);
});
