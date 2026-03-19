import { BRIDGE_RPC, CHAIN_ID_TO_KEY, CHAIN_RPCS } from './constants';

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

const base58Encode = (bytes) => {
  const digits = [0];
  for (const value of bytes) {
    let carry = value;
    for (let index = 0; index < digits.length; index += 1) {
      carry += digits[index] << 8;
      digits[index] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }

  let encoded = '';
  for (const value of bytes) {
    if (value === 0) {
      encoded += '1';
    } else {
      break;
    }
  }
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    encoded += BASE58_ALPHABET[digits[index]];
  }
  return encoded;
};

export const externalRpcCall = async (chainId, method, params = []) => {
  const rpcUrl = CHAIN_RPCS[chainId];
  if (!rpcUrl) return null;

  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: Date.now() }),
  });
  const json = await response.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
};

export const rpcCall = async (method, params = []) => {
  const response = await fetch(BRIDGE_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: Date.now() }),
  });
  const json = await response.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
};

export const hexToRXAddress = async (hexAddr) => {
  try {
    const normalized = hexAddr.replace(/^0x/i, '');
    if (normalized.length !== 40) return hexAddr;

    const payload = new Uint8Array(21);
    payload[0] = 0x41;
    for (let index = 0; index < 20; index += 1) {
      payload[index + 1] = parseInt(normalized.substr(index * 2, 2), 16);
    }

    const firstHash = new Uint8Array(await crypto.subtle.digest('SHA-256', payload));
    const secondHash = new Uint8Array(await crypto.subtle.digest('SHA-256', firstHash));
    const full = new Uint8Array(25);
    full.set(payload);
    full.set(secondHash.slice(0, 4), 21);
    return `RX${base58Encode(full)}`;
  } catch {
    return hexAddr;
  }
};

export const waitForTx = async (txHash, maxRetries = 10) => {
  for (let attempt = 0; attempt < maxRetries; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    try {
      const transaction = await rpcCall('robotx_getTransactionByHash', [txHash]);
      if (transaction) return transaction;
    } catch {
      // ignore polling failure and continue retrying
    }
  }
  return null;
};

export const callRelayerReverse = async (txHash, destChainId, destAddress, symbol, amount) => {
  const destChain = CHAIN_ID_TO_KEY[destChainId];
  if (!destChain) throw new Error(`不支持的目标链: ${destChainId}`);

  const response = await fetch('https://bridge.robotxhub.io/api/reverse-bridge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Bridge-Key': 'robotx-bridge-relayer-2026',
    },
    body: JSON.stringify({ txHash, destChain, destAddress, symbol, amount: amount.toString() }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Relayer请求失败');
  return data;
};

export const getERC20Balance = async (contractAddr, walletAddr) => {
  try {
    const address = walletAddr.replace(/^0x/i, '').toLowerCase().padStart(64, '0');
    const data = `0x70a08231${address}`;
    const result = await rpcCall('eth_call', [{ to: contractAddr, data }, 'latest']);
    if (result && result !== '0x' && result !== '0x0') {
      return Number(BigInt(result));
    }
    return 0;
  } catch {
    return 0;
  }
};