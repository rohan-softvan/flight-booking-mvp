import { createApp } from "./app";
import { env } from "./config/env";
import { runMigrations } from "./db/migrate";
import { seedAirports, seedFlights } from "./db/seed/flights.seed";

async function main(): Promise<void> {
  await runMigrations();
  await seedAirports();
  await seedFlights();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`[backend] listening on port ${env.port}`);
  });
}

main().catch((err) => {
  console.error("[backend] fatal startup error", err);
  process.exit(1);
});
