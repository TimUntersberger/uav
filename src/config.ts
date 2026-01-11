import dotenv from 'dotenv';

dotenv.config();

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name} in .env`);
  return v;
}

export default {
  rpcUrl: required("SOLANA_RPC"),
  heliusApiKey: required("HELIUS_API_KEY"),
  walletAddress: required("WALLET_ADDRESS"),
  txLimit: Number(process.env.TX_LIMIT || 500),
  enableUnrealized: process.env.ENABLE_UNREALIZED === "true",

  // Jupiter Price API (free). New hostnames are under lite-api.jup.ag. :contentReference[oaicite:1]{index=1}
  jupPriceBase: process.env.JUP_PRICE_BASE || "https://lite-api.jup.ag/price/v2",

  // Constants
  WSOL_MINT: "So11111111111111111111111111111111111111112",
  SOL_MINT: "So11111111111111111111111111111111111111112",
};
