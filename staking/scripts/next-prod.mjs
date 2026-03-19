import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const ENV_PATH = path.join(PROJECT_ROOT, ".env.prod");
const NEXT_BIN_PATH = path.join(PROJECT_ROOT, "node_modules", "next", "dist", "bin", "next");
const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.error("Missing Next.js command. Usage: node ./scripts/next-prod.mjs <build|start> [...args]");
  process.exit(1);
}

const envResult = loadEnv({ path: ENV_PATH, override: true });

if (envResult.error) {
  console.error(`Failed to load production environment from ${ENV_PATH}`);
  console.error(envResult.error.message);
  process.exit(1);
}

const child = spawn(process.execPath, [NEXT_BIN_PATH, command, ...args], {
  cwd: PROJECT_ROOT,
  env: process.env,
  stdio: "inherit",
});

child.on("error", (error) => {
  console.error(error.message);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});