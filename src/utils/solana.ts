import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const WSOL_MINT =
  'So11111111111111111111111111111111111111112' as const;

export const lamportsToSol = (lamports: number): number =>
  lamports / LAMPORTS_PER_SOL;
