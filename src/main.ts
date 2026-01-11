import { startServer } from "./server/server";

async function main() {
  const port = Number(process.env.PORT ?? "8787");
  await startServer(Number.isFinite(port) ? port : 8787);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error("Fatal error:", message);
  process.exit(1);
});
