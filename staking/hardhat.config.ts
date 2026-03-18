import { configVariable, defineConfig } from "hardhat/config";

export default defineConfig({
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "cancun",
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
      chainId: 2_679,
      url: configVariable("ROBOTX_RPC_URL"),
      accounts: [configVariable("ROBOTX_PRIVATE_KEY")],
      gas: 100_000_000,
      gasPrice: "auto",
    },
  },
});