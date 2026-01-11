import { HeliusTx, TokenTransfer } from '@uav/helius/helius.types';
import { WSOL_MINT } from '@uav/utils/solana';
import { toArray } from '@uav/utils/arrays';
import { PublicKey } from '@solana/web3.js';

const isWsol = (t: TokenTransfer) => t.mint === WSOL_MINT;
const isNotWsol = (t: TokenTransfer) => t.mint !== WSOL_MINT;

export function looksLikeSwap(tx: HeliusTx, wallet: PublicKey): boolean {
  if (!tx || tx.transactionError) return false;

  const tokenTransfers = toArray(tx.tokenTransfers);
  const nativeTransfers = toArray(tx.nativeTransfers);
  if (tokenTransfers.length === 0) return false;

  const inbound = tokenTransfers.filter(t => t.toUserAccount === wallet.toBase58());
  const outbound = tokenTransfers.filter(t => t.fromUserAccount === wallet.toBase58());
  if (inbound.length === 0 && outbound.length === 0) return false;

  const hasOtherMint = tokenTransfers.some(isNotWsol);
  if (!hasOtherMint) return false;

  const hasWsol = tokenTransfers.some(isWsol);
  const hasNativeSol = nativeTransfers.some(
    n => n.fromUserAccount === wallet.toBase58() || n.toUserAccount === wallet.toBase58()
  );

  return hasWsol || hasNativeSol;
}
