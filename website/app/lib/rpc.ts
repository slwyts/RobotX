const RPC_URL = 'https://rpc.robotxhub.ai';

export async function rpcCall(method: string, params: unknown[] = []): Promise<unknown> {
  try {
    const res = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
    });
    const data = await res.json();
    return data.result;
  } catch {
    return null;
  }
}

export async function addToMetaMask(): Promise<void> {
  if (typeof window === 'undefined') return;
  const win = window as Window & { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } };
  if (!win.ethereum) {
    window.open('https://metamask.io/download/', '_blank');
    return;
  }
  try {
    await win.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0xA77',
        chainName: 'ROBOTX Mainnet',
        nativeCurrency: { name: 'RX', symbol: 'RX', decimals: 18 },
        rpcUrls: ['https://rpc.robotxhub.ai'],
        blockExplorerUrls: ['https://explorer.robotxhub.ai'],
      }],
    });
  } catch {
    // user rejected
  }
}
