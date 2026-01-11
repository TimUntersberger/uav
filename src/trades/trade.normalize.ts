import { HeliusTx } from '@uav/helius/helius.types';
import { Trade } from './trade.types';
import { looksLikeSwap } from './trade.detect';
import { computeNativeTipSol } from './trade.native';
import { computeWsolAmounts } from './trade.wsol';
import { toArray, pickLargestByAmount } from '@uav/utils/arrays';
import { WSOL_MINT, lamportsToSol } from '@uav/utils/solana';
import { PublicKey } from '@solana/web3.js';

export function normalizeSwapWithFees(
  tx: HeliusTx,
  wallet: PublicKey
): Trade | null {
  if (!looksLikeSwap(tx, wallet)) return null;

  const transfers = toArray(tx.tokenTransfers);
  const inbound = transfers.filter(t => t.toUserAccount === wallet.toBase58());
  const outbound = transfers.filter(t => t.fromUserAccount === wallet.toBase58());

  const wsolIn = inbound.filter(t => t.mint === WSOL_MINT);
  const wsolOut = outbound.filter(t => t.mint === WSOL_MINT);

  const otherIn = inbound.filter(t => t.mint !== WSOL_MINT);
  const otherOut = outbound.filter(t => t.mint !== WSOL_MINT);

  const buy = pickLargestByAmount(otherIn) && wsolOut.length > 0;
  const sell = pickLargestByAmount(otherOut) && wsolIn.length > 0;
  if (!buy && !sell) return null;

  const kind = buy ? 'BUY' : 'SELL';
  const base = buy ? pickLargestByAmount(otherIn)! : pickLargestByAmount(otherOut)!;

  const { swapSol, wsolFeeSol } = computeWsolAmounts(kind, wsolIn, wsolOut);
  const nativeTipSol = computeNativeTipSol(tx, wallet, transfers);

  const networkFeeSol =
    tx.feePayer === wallet.toBase58() ? lamportsToSol(tx.fee) : 0;

  return {
    signature: tx.signature,
    timestamp: tx.timestamp,
    source: tx.source,
    wallet,
    kind,
    baseMint: base.mint,
    baseAmount: base.tokenAmount,
    swapSol,
    networkFeeSol,
    wsolFeeSol,
    nativeTipSol,
    totalFeesSol: networkFeeSol + wsolFeeSol + nativeTipSol,
  };
}
