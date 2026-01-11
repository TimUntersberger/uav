import { Connection, PublicKey } from "@solana/web3.js";

import config from "@uav/config";
import * as metadata from "@uav/metadata";
import { AsyncResolverCache } from "@uav/utils/asyncResolverCache";

import { tradesToPositions } from "@uav/positions/tradesToPositions";
import { HeliusAPI } from "@uav/helius/helius.api";

import type { Position } from "./positions.types";

type MintMetadata = { symbol?: string; name?: string } | null;

export interface GetPositionsOptions {
  includeFeesInPnl?: boolean;
  qtyEpsilon?: number;
}

export async function getPositionsForWalletOnDay(
  wallet: PublicKey,
  date: Date,
  opts: GetPositionsOptions = {}
): Promise<Position[]> {
  const connection = new Connection(config.rpcUrl, "confirmed");
  const helius = new HeliusAPI(config.heliusApiKey);

  const trades = await helius.getTradesForDay(wallet, date);

  const mintMetadataCache = new AsyncResolverCache<MintMetadata>(async (mint: string) =>
    metadata.resolveMintMetadata(connection, new PublicKey(mint))
  );

  const positionsMap = tradesToPositions(trades, opts);

  const positions = await Promise.all(
    Array.from(positionsMap.values()).map(async (p) => {
      const md = await mintMetadataCache.get(p.mint);
      const label = md?.symbol && md?.name ? `${md.symbol} (${md.name})` : p.mint;
      return { ...p, name: label };
    })
  );

  return positions;
}
