import cors from "cors";
import express, { Express } from "express";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { healthRouter } from "./routes/health.routes";

export function createApp(): Express {
  const app = express();

  app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));
  app.use(cors({ origin: env.frontendUrl }));
  app.use(express.json());

  app.use("/api", healthRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
