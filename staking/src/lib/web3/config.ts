import { SUPPORTED_CHAINS, type SupportedChainKey } from "@/lib/web3/chains";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const appMode = process.env.NEXT_PUBLIC_APP_MODE === "prod" ? "prod" : "local";
const targetChainKey: SupportedChainKey = appMode === "prod" ? "robotx" : "hardhat-local";
const contractAddress = process.env.NEXT_PUBLIC_RX_STAKING_ADDRESS ?? ZERO_ADDRESS;

export const appConfig = {
  appMode,
  contractAddress,
  isContractConfigured: contractAddress !== ZERO_ADDRESS,
  targetChain: SUPPORTED_CHAINS[targetChainKey],
};

export { ZERO_ADDRESS };