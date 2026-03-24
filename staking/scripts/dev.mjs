import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { Contract, ContractFactory, JsonRpcProvider, NonceManager, Wallet, formatEther, parseEther } from "ethers";

const HARDHAT_RPC_URL = "http://127.0.0.1:8545";
const DEV_PORTS_TO_CLEAN = [8545, 3000];
const LOCAL_OWNER = "0xA4b76D7Cae384C9a5fD5f573Cef74BFdB980E966";
const EXTRA_FUNDED_ADDRESSES = [
  "0x98C2e0ECDFA961F8B36144C743FEa3951dAd0309",
  "0x676A05c975F447eA13Bf09219A1C3acf81031feC",
];
const OWNER_TARGET_BALANCE = parseEther("100000");
const EXTRA_TARGET_BALANCE = parseEther("100000");
const POOL_TARGET_BALANCE = parseEther("100000");
const FUNDER_BALANCE = parseEther("1000000");
const DEFAULT_LOCAL_FUNDER_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const ENV_LOCAL_PATH = path.join(PROJECT_ROOT, ".env.local");
const ARTIFACT_PATH = path.join(PROJECT_ROOT, "artifacts/contracts/RXStaking.sol/RXStaking.json");

let hardhatNodeProcess = null;
let nextDevProcess = null;
let startedHardhatNode = false;

function spawnCommand(command, args, options = {}) {
  return spawn(command, args, {
    cwd: PROJECT_ROOT,
    stdio: "inherit",
    shell: false,
    ...options,
  });
}

function createFunder(provider) {
  return new NonceManager(new Wallet(DEFAULT_LOCAL_FUNDER_KEY, provider));
}

async function runCommand(command, args) {
  const child = spawnCommand(command, args);

  await new Promise((resolve, reject) => {
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exited with code ${code ?? "unknown"}`));
    });

    child.on("error", reject);
  });
}

async function runOptionalCommand(command, args) {
  const child = spawn(command, args, {
    cwd: PROJECT_ROOT,
    stdio: "ignore",
    shell: false,
  });

  await new Promise((resolve) => {
    child.on("exit", () => resolve());
    child.on("error", () => resolve());
  });
}

async function killProcessOnPort(port) {
  await runOptionalCommand("fuser", ["-k", `${port}/tcp`]);
}

async function cleanupDevPorts() {
  console.log(`Cleaning local dev ports: ${DEV_PORTS_TO_CLEAN.join(", ")}`);
  await Promise.all(DEV_PORTS_TO_CLEAN.map((port) => killProcessOnPort(port)));
  await delay(500);
}

async function isRpcReady() {
  try {
    const response = await fetch(HARDHAT_RPC_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_chainId",
        params: [],
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

async function rpc(method, params) {
  const response = await fetch(HARDHAT_RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method,
      params,
    }),
  });

  const payload = await response.json();
  if (payload.error) {
    throw new Error(payload.error.message);
  }

  return payload.result;
}

async function waitForRpc() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (await isRpcReady()) {
      return;
    }

    await delay(1000);
  }

  throw new Error("Hardhat local node did not become ready within 60 seconds.");
}

async function ensureHardhatNode() {
  if (await isRpcReady()) {
    console.log("Using existing Hardhat node at http://127.0.0.1:8545");
    return;
  }

  console.log("Starting Hardhat node...");
  hardhatNodeProcess = spawnCommand("pnpm", ["exec", "hardhat", "node", "--network", "hardhat"]);
  startedHardhatNode = true;
  await waitForRpc();
}

async function readEnvFile(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

async function writeEnvValue(filePath, key, value) {
  const content = await readEnvFile(filePath);
  const line = `${key}=${value}`;
  const matcher = new RegExp(`^${key}=.*$`, "m");
  const nextContent = matcher.test(content)
    ? content.replace(matcher, line)
    : `${content.trimEnd()}${content.trim() ? "\n" : ""}${line}\n`;

  await writeFile(filePath, nextContent, "utf8");
}

function parseEnvValue(content, key) {
  const match = content.match(new RegExp(`^${key}=(.*)$`, "m"));
  return match?.[1]?.trim() ?? null;
}

async function deployLocalContract() {
  console.log("Compiling contracts for local deployment...");
  await runCommand("pnpm", ["contracts:compile"]);

  const envContent = await readEnvFile(ENV_LOCAL_PATH);
  const configuredAddress = parseEnvValue(envContent, "NEXT_PUBLIC_RX_STAKING_ADDRESS");
  const provider = new JsonRpcProvider(HARDHAT_RPC_URL);
  const artifact = JSON.parse(await readFile(ARTIFACT_PATH, "utf8"));

  if (configuredAddress && configuredAddress !== ZERO_ADDRESS) {
    const code = await provider.getCode(configuredAddress);
    if (code !== "0x") {
      const existingContract = new Contract(configuredAddress, artifact.abi, provider);
      const existingOwner = await existingContract.owner();

      if (existingOwner.toLowerCase() === LOCAL_OWNER.toLowerCase()) {
        console.log(`Using existing local RXStaking deployment at ${configuredAddress}`);
        return configuredAddress;
      }

      console.log(`Existing local RXStaking owner is ${existingOwner}, redeploying with owner ${LOCAL_OWNER}...`);
    }
  }

  const funder = createFunder(provider);
  const factory = new ContractFactory(artifact.abi, artifact.bytecode, funder);

  console.log("Deploying RXStaking to local Hardhat network...");
  const contract = await factory.deploy(LOCAL_OWNER);
  await contract.waitForDeployment();
  const deployedAddress = await contract.getAddress();

  await writeEnvValue(ENV_LOCAL_PATH, "NEXT_PUBLIC_APP_MODE", "local");
  await writeEnvValue(ENV_LOCAL_PATH, "NEXT_PUBLIC_RX_STAKING_ADDRESS", deployedAddress);

  console.log(`Deployed RXStaking at ${deployedAddress} and updated .env.local`);
  return deployedAddress;
}

async function ensureTargetBalance(provider, funder, address, targetBalance, label) {
  const currentBalance = await provider.getBalance(address);
  if (currentBalance >= targetBalance) {
    console.log(`${label} balance already sufficient at ${formatEther(currentBalance)} RX-equivalent.`);
    return;
  }

  const missingBalance = targetBalance - currentBalance;
  const tx = await funder.sendTransaction({
    to: address,
    value: missingBalance,
  });
  await tx.wait();

  console.log(`Funded ${label} with ${formatEther(missingBalance)} RX-equivalent.`);
}

async function fundLocalWallets() {
  const provider = new JsonRpcProvider(HARDHAT_RPC_URL);
  const funderAddress = new Wallet(DEFAULT_LOCAL_FUNDER_KEY).address;
  const funder = createFunder(provider);
  await rpc("hardhat_setBalance", [funderAddress, `0x${FUNDER_BALANCE.toString(16)}`]);

  await ensureTargetBalance(provider, funder, LOCAL_OWNER, OWNER_TARGET_BALANCE, LOCAL_OWNER);

  for (const address of EXTRA_FUNDED_ADDRESSES) {
    await ensureTargetBalance(provider, funder, address, EXTRA_TARGET_BALANCE, address);
  }
}

async function ensurePoolLiquidity(contractAddress) {
  const provider = new JsonRpcProvider(HARDHAT_RPC_URL);
  const funderAddress = new Wallet(DEFAULT_LOCAL_FUNDER_KEY).address;
  const funder = createFunder(provider);
  await rpc("hardhat_setBalance", [funderAddress, `0x${FUNDER_BALANCE.toString(16)}`]);

  const currentBalance = await provider.getBalance(contractAddress);
  if (currentBalance >= POOL_TARGET_BALANCE) {
    console.log(`Pool balance already sufficient at ${formatEther(currentBalance)} RX-equivalent.`);
    return;
  }

  const missingBalance = POOL_TARGET_BALANCE - currentBalance;
  const tx = await funder.sendTransaction({
    to: contractAddress,
    value: missingBalance,
  });
  await tx.wait();

  console.log(`Funded RXStaking pool with ${formatEther(missingBalance)} RX-equivalent.`);
}

function shutdown(exitCode = 0) {
  if (nextDevProcess && !nextDevProcess.killed) {
    nextDevProcess.kill("SIGINT");
  }

  if (startedHardhatNode && hardhatNodeProcess && !hardhatNodeProcess.killed) {
    hardhatNodeProcess.kill("SIGINT");
  }

  process.exit(exitCode);
}

async function main() {
  await cleanupDevPorts();
  await ensureHardhatNode();
  await fundLocalWallets();
  const contractAddress = await deployLocalContract();
  await ensurePoolLiquidity(contractAddress);

  console.log("Starting Next.js dev server...");
  nextDevProcess = spawnCommand("pnpm", ["exec", "next", "dev"]);

  nextDevProcess.on("exit", (code) => {
    shutdown(code ?? 0);
  });

  process.on("SIGINT", () => shutdown(0));
  process.on("SIGTERM", () => shutdown(0));
}

main().catch((error) => {
  console.error(error);
  shutdown(1);
});