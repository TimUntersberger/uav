export interface TokenTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  tokenAmount: number;
  mint: string;
  fromTokenAccount?: string;
  toTokenAccount?: string;
}

export interface NativeTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  amount: number; // lamports
}

export interface HeliusTx {
  signature: string;
  timestamp: number;
  source: string;
  fee: number;
  feePayer: string;
  transactionError: unknown;
  tokenTransfers?: TokenTransfer[];
  nativeTransfers?: NativeTransfer[];
}
