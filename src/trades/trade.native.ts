import { HeliusTx, TokenTransfer } from '@uav/helius/helius.types';
import { lamportsToSol } from '@uav/utils/solana';
import { toArray } from '@uav/utils/arrays';
import { PublicKey } from '@solana/web3.js';

function tokenAccounts(transfers: TokenTransfer[]): Set<string> {
  const s = new Set<string>();
  for (const t of transfers) {
    if (t.fromTokenAccount) s.add(t.fromTokenAccount);
    if (t.toTokenAccount) s.add(t.toTokenAccount);
  }
  return s;
}

export function computeNativeTipSol(
  tx: HeliusTx,
  wallet: PublicKey,
  tokenTransfers: TokenTransfer[]
): number {
  const accounts = tokenAccounts(tokenTransfers);

  const lamports = toArray(tx.nativeTransfers)
    .filter(n => n.fromUserAccount === wallet.toBase58())
    .filter(n => !accounts.has(n.toUserAccount))
    .reduce((sum, n) => sum + n.amount, 0);

  return lamportsToSol(lamports);
}
