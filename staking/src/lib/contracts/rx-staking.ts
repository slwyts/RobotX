import artifact from "../../../artifacts/contracts/RXStaking.sol/RXStaking.json";
import { appConfig } from "@/lib/web3/config";

export const rxStakingAbi = artifact.abi;
export const rxStakingAddress = appConfig.contractAddress;