import fs from 'node:fs';
import { getDayBoundsUTC } from '@uav/utils/date';
import { normalizeSwapWithFees } from '@uav/trades/trade.normalize';
import { Trade } from '@uav/trades/trade.types';
import { HeliusTx } from './helius.types';
import { PublicKey } from '@solana/web3.js';

export class HeliusAPI {
  constructor(
    private apiKey: string,
    private debugDumpTxs = false
  ) {}

  async getTradesForDay(wallet: PublicKey, date: Date): Promise<Trade[]> {
    const txs = await this.getTransactionsForDay(wallet, date);

    if (this.debugDumpTxs) {
      fs.writeFileSync('txs.json', JSON.stringify(txs, null, 2));
    }

    return txs
      .map(tx => normalizeSwapWithFees(tx, wallet))
      .filter((t): t is Trade => t !== null)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  async getTransactionsForDay(wallet: PublicKey, date: Date): Promise<HeliusTx[]> {
    const { start, end } = getDayBoundsUTC(date);

    const url =
      `https://api-mainnet.helius-rpc.com/v0/addresses/${wallet}/transactions` +
      `?api-key=${this.apiKey}` +
      `&gte-time=${start.getTime() / 1000}` +
      `&lte-time=${end.getTime() / 1000}`;

    const res = await fetch(url);
    return res.json();
  }
}
