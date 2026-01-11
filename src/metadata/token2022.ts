import { TOKEN_2022_PROGRAM_ID, getTokenMetadata } from "@solana/spl-token";
import { cleanStr } from "./util";
import { Connection, PublicKey } from "@solana/web3.js";

export default async function fetchMetadata(connection: Connection, mintPk: PublicKey) {
  const md = await getTokenMetadata(connection, mintPk, "confirmed", TOKEN_2022_PROGRAM_ID);
  if (!md) return null;

  return {
    name: cleanStr(md.name),
    symbol: cleanStr(md.symbol),
    uri: cleanStr(md.uri),
  };
}