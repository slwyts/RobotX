import { configVariable, defineConfig } from "hardhat/config";

const ROBOTX_CHAIN_ID = Number(process.env.ROBOTX_CHAIN_ID ?? "2679");

export default defineConfig({
  solidity: {
    version: "0.8.34",
    settings: {
      evmVersion: "osaka",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache",
  },
  networks: {
    hardhat: {
      type: "edr-simulated",
      chainType: "generic",
      chainId: 31_337,
      blockGasLimit: 100_000_000,
    },
    robotx: {
      type: "http",
      chainType: "generic",
      chainId: ROBOTX_CHAIN_ID,
      url: configVariable("ROBOTX_RPC_URL"),
      accounts: [configVariable("ROBOTX_PRIVATE_KEY")],
      gas: 100_000_000,
      gasPrice: "auto",
    },
  },
});