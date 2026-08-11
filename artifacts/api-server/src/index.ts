import app from "./app";
import { logger } from "./lib/logger";

export default app;

const port = Number(process.env["PORT"] ?? 8080);

if (process.env.VERCEL !== "1") {
  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
}
