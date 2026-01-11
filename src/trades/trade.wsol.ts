import { TokenTransfer } from '@uav/helius/helius.types';
import { pickLargestByAmount, sumTokenAmount } from '@uav/utils/arrays';

export function computeWsolAmounts(
  kind: 'BUY' | 'SELL',
  wsolIn: TokenTransfer[],
  wsolOut: TokenTransfer[]
) {
  const side = kind === 'BUY' ? wsolOut : wsolIn;

  const dominant = pickLargestByAmount(side);
  const swapSol = dominant?.tokenAmount ?? 0;
  const wsolFeeSol = sumTokenAmount(side) - swapSol;

  return { swapSol, wsolFeeSol };
}
