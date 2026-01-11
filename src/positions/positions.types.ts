import type { Trade } from "../trades/trade.types";

export type TradeKind = "BUY" | "SELL" | "UNKNOWN";

export interface Position {
  mint: string;
  qty: number;
  costSol: number;
  avgEntrySol: number;
  realizedPnlSol: number;
  feesSol: number;
  firstTs: number;
  lastTs: number;
  isOpen: boolean;

  // kept because your JS version stores them
  trades: Trade[];
}

export interface TradesToPositionsOptions {
  qtyEpsilon?: number;
  includeFeesInPnl?: boolean;
}
