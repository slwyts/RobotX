export type SupportedChainKey = "hardhat-local" | "robotx";

export type SupportedChain = {
  key: SupportedChainKey;
  chainId: number;
  name: string;
  shortName: string;
  rpcUrl: string;
  explorerUrl: string | null;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

export const SUPPORTED_CHAINS: Record<SupportedChainKey, SupportedChain> = {
  "hardhat-local": {
    key: "hardhat-local",
    chainId: 31337,
    name: "Hardhat Local",
    shortName: "Local",
    rpcUrl: "http://127.0.0.1:8545",
    explorerUrl: null,
    nativeCurrency: {
      name: "RobotX",
      symbol: "RX",
      decimals: 18,
    },
  },
  robotx: {
    key: "robotx",
    chainId: 2679,
    name: "RobotX Mainnet",
    shortName: "RobotX",
    rpcUrl: "https://rpc.robotxhub.ai",
    explorerUrl: "https://scan.robotxhub.ai",
    nativeCurrency: {
      name: "RobotX",
      symbol: "RX",
      decimals: 18,
    },
  },
};

export function getChainById(chainId: number) {
  return Object.values(SUPPORTED_CHAINS).find((chain) => chain.chainId === chainId) ?? null;
}