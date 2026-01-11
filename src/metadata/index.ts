import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import fetchToken2022Metadata from "./token2022";
import fetchMetaplexMetadata from "./tokenkeg";
import { Connection, PublicKey } from '@solana/web3.js';

export async function resolveMintMetadata(connection: Connection, mintPk: PublicKey) {
  const mintAcc = await connection.getAccountInfo(mintPk, "confirmed");
  if (!mintAcc?.owner) return null;

  const ownerProgram = mintAcc.owner.toBase58();

  if (mintAcc.owner.equals(TOKEN_2022_PROGRAM_ID)) {
    const md = await fetchToken2022Metadata(connection, mintPk);
    return md ? { ...md, standard: "token2022", ownerProgram } : null;
  }

  if (mintAcc.owner.equals(TOKEN_PROGRAM_ID)) {
    const md = await fetchMetaplexMetadata(connection, mintPk);
    return md ? { ...md, standard: "tokenkeg", ownerProgram } : null;
  }

  return null;
}