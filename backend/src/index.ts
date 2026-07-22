import { createApp } from "./app";
import { env } from "./config/env";
import { runMigrations } from "./db/migrate";

async function main(): Promise<void> {
  await runMigrations();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`[backend] listening on port ${env.port}`);
  });
}

main().catch((err) => {
  console.error("[backend] fatal startup error", err);
  process.exit(1);
});
