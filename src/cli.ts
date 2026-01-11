import { PublicKey } from "@solana/web3.js";

import config from "@uav/config";

import type { Position } from "./positions/positions.types";
import { getPositionsForWalletOnDay } from "./positions/positions.service";
import { getCachedJsonOrExecute, makeSafeCacheKey } from "./utils/diskCache";

/**
 * CLI entry that matches your previous behavior:
 * - fixed date
 * - fixed wallet from config
 * - disk-cache result to `${safeWallet}_${YYYY-MM-DD}.json` in cwd
 */
async function main() {
  const date = new Date("2025-12-12");

  const cacheKey = makeSafeCacheKey(config.walletAddress, date);

  const positions = await getCachedJsonOrExecute<Position[]>(
    cacheKey,
    async () => getPositionsForWalletOnDay(new PublicKey(config.walletAddress), date)
  );

  // Optional: give CLI some visible output like your previous file
  const safeDate = date.toISOString().slice(0, 10);
  console.log(`Loaded ${positions.length} positions for ${config.walletAddress} on ${safeDate}`);
  console.log(`Cache file: ${cacheKey}.json`);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error("Fatal error:", message);
  process.exit(1);
});
