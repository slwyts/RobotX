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

const LOCAL_RPC_URL = process.env.NEXT_PUBLIC_LOCAL_RPC_URL ?? "http://127.0.0.1:8545";
const LOCAL_CHAIN_ID = Number(process.env.NEXT_PUBLIC_LOCAL_CHAIN_ID ?? "31337");
const ROBOTX_CHAIN_ID = Number(process.env.NEXT_PUBLIC_ROBOTX_CHAIN_ID ?? "2679");
const ROBOTX_RPC_URL = process.env.NEXT_PUBLIC_ROBOTX_RPC_URL ?? "https://rpc.robotxhub.ai";
const ROBOTX_EXPLORER_URL = process.env.NEXT_PUBLIC_ROBOTX_EXPLORER_URL ?? "https://explorer.robotxhub.ai";

export const SUPPORTED_CHAINS: Record<SupportedChainKey, SupportedChain> = {
  "hardhat-local": {
    key: "hardhat-local",
    chainId: LOCAL_CHAIN_ID,
    name: "Hardhat Local",
    shortName: "Local",
    rpcUrl: LOCAL_RPC_URL,
    explorerUrl: null,
    nativeCurrency: {
      name: "RobotX",
      symbol: "RX",
      decimals: 18,
    },
  },
  robotx: {
    key: "robotx",
    chainId: ROBOTX_CHAIN_ID,
    name: "RobotX Mainnet",
    shortName: "RobotX",
    rpcUrl: ROBOTX_RPC_URL,
    explorerUrl: ROBOTX_EXPLORER_URL,
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