import type { Trade } from "../trades/trade.types";
import type { Position, TradesToPositionsOptions } from "./positions.types";

/**
 * Weighted-average-cost positions, fees-aware.
 *
 * BUY: increases cost basis by (swapSol + fees)
 * SELL: realized pnl uses proceeds (swapSol - fees)
 */
export function tradesToPositions(
  trades: Trade[],
  opts: TradesToPositionsOptions = {}
): Map<string, Position> {
  const qtyEpsilon = opts.qtyEpsilon ?? 1e-9;
  const includeFeesInPnl = opts.includeFeesInPnl ?? true;

  const sorted = trades.slice().sort((a, b) => a.timestamp - b.timestamp);
  const positions = new Map<string, Position>();

  for (const t of sorted) {
    // preserve original guard behavior
    if (!t || !t.baseMint || !t.baseAmount || !t.swapSol) continue;

    const mint = t.baseMint;
    const qty = t.baseAmount;
    const fees = includeFeesInPnl ? (t.totalFeesSol || 0) : 0;

    let p = positions.get(mint);
    if (!p) {
      p = {
        mint,
        qty: 0,
        costSol: 0,
        avgEntrySol: 0,
        realizedPnlSol: 0,
        feesSol: 0,
        firstTs: t.timestamp,
        lastTs: t.timestamp,
        isOpen: false,
        trades: [],
      };
      positions.set(mint, p);
    }

    p.lastTs = t.timestamp;
    p.feesSol += fees;
    p.trades.push(t);

    if (t.kind === "BUY") {
      const fillCost = t.swapSol + fees;

      p.qty += qty;
      p.costSol += fillCost;
      p.avgEntrySol = p.qty > qtyEpsilon ? p.costSol / p.qty : 0;
      p.isOpen = p.qty > qtyEpsilon;
    } else if (t.kind === "SELL") {
      const sellQty = Math.min(qty, p.qty);
      if (sellQty <= qtyEpsilon) continue;

      const avgCost = p.qty > qtyEpsilon ? p.costSol / p.qty : 0;
      const soldCost = sellQty * avgCost;

      const fillProceeds = t.swapSol - fees;
      const proceedsScaled = fillProceeds * (sellQty / qty);

      p.realizedPnlSol += proceedsScaled - soldCost;

      p.qty -= sellQty;
      p.costSol -= soldCost;

      if (p.qty < qtyEpsilon) {
        p.qty = 0;
        p.costSol = 0;
        p.avgEntrySol = 0;
        p.isOpen = false;
      } else {
        p.avgEntrySol = p.costSol / p.qty;
        p.isOpen = true;
      }
    }
  }

  return positions;
}
