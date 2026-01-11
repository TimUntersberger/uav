import type { FastifyInstance } from "fastify";
import { PublicKey } from "@solana/web3.js";

import type { ServerDeps } from "./deps";
import { parseIsoDateOnly, parseBool, parseNumber } from "./query";
import { getCachedJsonOrExecute, makeSafeCacheKey } from "@uav/utils/diskCache";
import { getPositionsForWalletOnDay } from "@uav/positions/positions.service";

export function registerRoutes(app: FastifyInstance, deps: ServerDeps) {
  app.get("/health", async () => ({ ok: true }));

  /**
   * GET /api/positions?date=YYYY-MM-DD&wallet=...&includeFeesInPnl=true|false&qtyEpsilon=...
   * Adds disk caching by default (can disable with cache=false).
   */
  app.get<{
    Querystring: {
      date: string;
      wallet?: string;
      includeFeesInPnl?: string;
      qtyEpsilon?: string;
      cache?: string; // default true; set cache=false to bypass disk cache
    };
  }>("/api/positions", async (req, reply) => {
    const walletAddress = req.query.wallet ?? deps.defaultWalletAddress;
    const dateStr = req.query.date;

    const date = parseIsoDateOnly(dateStr);
    if (!date) {
      return reply.code(400).send({ ok: false, error: 'Invalid "date" (YYYY-MM-DD).' });
    }

    const includeFeesInPnl = parseBool(req.query.includeFeesInPnl, true);
    const qtyEpsilon = parseNumber(req.query.qtyEpsilon, 1e-9);
    const useCache = parseBool(req.query.cache, true);

    const walletPk = new PublicKey(walletAddress);

    const cacheKey = makeSafeCacheKey(walletAddress, date);

    const positions = useCache
      ? await getCachedJsonOrExecute(cacheKey, async () =>
          getPositionsForWalletOnDay(walletPk, date, { includeFeesInPnl, qtyEpsilon })
        )
      : await getPositionsForWalletOnDay(walletPk, date, { includeFeesInPnl, qtyEpsilon });

    return {
      ok: true,
      wallet: walletAddress,
      date: dateStr,
      options: { includeFeesInPnl, qtyEpsilon, cache: useCache },
      positions,
    };
  });
}
