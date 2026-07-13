import type { IncomingMessage, ServerResponse } from "node:http";
import app from "../artifacts/api-server/src/app";

export default function handler(
  req: IncomingMessage,
  res: ServerResponse,
): void {
  const originalUrl = req.url ?? "/";
  if (!originalUrl.startsWith("/api")) {
    req.url = `/api${originalUrl === "/" ? "/" : originalUrl}`;
  }
  app(req, res);
}
