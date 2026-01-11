import path from "node:path";
import fs from "node:fs";

export async function getCachedJsonOrExecute<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const cacheFile = path.resolve(process.cwd(), `${key}.json`);

  if (fs.existsSync(cacheFile)) {
    const cached = fs.readFileSync(cacheFile, "utf8");
    console.log(`Using cached data from ${cacheFile}`);
    return JSON.parse(cached) as T;
  }

  console.log(`No cache found, executing function and caching to ${cacheFile}`);
  const result = await fn();
  fs.writeFileSync(cacheFile, JSON.stringify(result, null, 2), "utf8");
  return result;
}

export function makeSafeCacheKey(walletAddress: string, date: Date): string {
  const safeDate = date.toISOString().slice(0, 10); // YYYY-MM-DD
  const safeWallet = String(walletAddress).replace(/[^A-Za-z0-9_-]/g, "_");
  return `${safeWallet}_${safeDate}`;
}
