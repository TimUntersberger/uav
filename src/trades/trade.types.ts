import { PublicKey } from "@solana/web3.js";

export type TradeKind = 'BUY' | 'SELL' | 'UNKNOWN';

export interface Trade {
  signature: string;
  timestamp: number;
  source: string;
  wallet: PublicKey;

  kind: TradeKind;
  baseMint: string;
  baseAmount: number;

  swapSol: number;
  networkFeeSol: number;
  wsolFeeSol: number;
  nativeTipSol: number;
  totalFeesSol: number;
}
