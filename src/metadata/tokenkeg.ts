import { Connection, PublicKey } from "@solana/web3.js";
import { cleanStr } from "./util";

// ✅ Use the serializer (CJS-friendly)
import { getMetadataAccountDataSerializer } from "@metaplex-foundation/mpl-token-metadata";

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

function findMetaplexMetadataPda(mintPk: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintPk.toBuffer()],
    TOKEN_METADATA_PROGRAM_ID
  )[0];
}

export default async function fetchMetaplexMetadata(connection: Connection, mintPk: PublicKey) {
  const pda = findMetaplexMetadataPda(mintPk);
  const acc = await connection.getAccountInfo(pda, "confirmed");
  if (!acc?.data) return null;

  // Serializer returns [value, offset]
  const serializer = getMetadataAccountDataSerializer();
  const [md] = serializer.deserialize(acc.data);

  return {
    name: cleanStr(md.name),
    symbol: cleanStr(md.symbol),
    uri: cleanStr(md.uri),
  };
}
