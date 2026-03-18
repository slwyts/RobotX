import process from "node:process";

const HARDHAT_RPC_URL = "http://127.0.0.1:8545";

function parseDurationTokens(tokens) {
  if (tokens.length === 0) {
    throw new Error("Usage: pnpm run time:warp -- 6h 2d or 6 h 2 d");
  }

  const normalized = [];
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const compactMatch = token.match(/^(\d+)([dhms])$/i);
    if (compactMatch) {
      normalized.push([Number.parseInt(compactMatch[1], 10), compactMatch[2].toLowerCase()]);
      continue;
    }

    const amount = Number.parseInt(token, 10);
    const unit = tokens[index + 1]?.toLowerCase();
    if (Number.isNaN(amount) || !unit || !/^[dhms]$/.test(unit)) {
      throw new Error(`Invalid duration token: ${token}`);
    }

    normalized.push([amount, unit]);
    index += 1;
  }

  return normalized.reduce((total, [amount, unit]) => {
    switch (unit) {
      case "d":
        return total + amount * 24 * 60 * 60;
      case "h":
        return total + amount * 60 * 60;
      case "m":
        return total + amount * 60;
      case "s":
        return total + amount;
      default:
        return total;
    }
  }, 0);
}

async function rpc(method, params) {
  const response = await fetch(HARDHAT_RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method, params }),
  });
  const payload = await response.json();
  if (payload.error) {
    throw new Error(payload.error.message);
  }
  return payload.result;
}

async function main() {
  const seconds = parseDurationTokens(process.argv.slice(2));
  await rpc("evm_increaseTime", [seconds]);
  await rpc("evm_mine", []);

  const latestBlock = await rpc("eth_getBlockByNumber", ["latest", false]);
  const timestamp = Number.parseInt(latestBlock.timestamp, 16);

  console.log(`Increased local time by ${seconds} seconds. New timestamp: ${timestamp}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});