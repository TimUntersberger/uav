import Fastify from "fastify";
import cors from "@fastify/cors";

import { createServerDeps } from "./deps";
import { registerRoutes } from "./routes";

export async function startServer(port: number) {
  const app = Fastify({ logger: true });

  // dev-friendly; in prod, restrict origins
  await app.register(cors, { origin: true });

  const deps = createServerDeps();
  registerRoutes(app, deps);

  await app.listen({ port, host: "0.0.0.0" });
  app.log.info(`Server listening on http://localhost:${port}`);

  return app;
}
