import path from "path";
import { config as loadEnv } from "dotenv";
import app from "./app";
import { logger } from "./lib/logger";

const repoRootEnv = path.resolve(import.meta.dirname, "..", "..", "..", ".env");
const localEnv = path.resolve(import.meta.dirname, "..", ".env");
loadEnv({ path: localEnv });
loadEnv({ path: repoRootEnv });

const rawPort = process.env["PORT"] ?? "4000";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
