import { pool } from "../pool";
import airportsSeed from "./airports.seed.json";

const AIRLINES = ["SkyLine Air", "TransGlobal", "Atlas Airways", "Northern Wings", "Pacific Express"];
const DAYS_AHEAD = 14;
const ROUTE_CHANCE = 0.5;
const BATCH_SIZE = 200;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function flightNumber(airlineIndex: number, seq: number): string {
  const first = String.fromCharCode(65 + airlineIndex);
  const second = String.fromCharCode(65 + ((airlineIndex * 7 + seq) % 26));
  return `${first}${second}${100 + (seq % 900)}`;
}

interface FlightRow {
  flightNumber: string;
  airline: string;
  originCode: string;
  destinationCode: string;
  departureAt: string;
  arrivalAt: string;
  basePriceCents: number;
  seatsAvailable: number;
}

function generateFlightRows(): FlightRow[] {
  const codes = airportsSeed.map((a) => a.code);
  const rows: FlightRow[] = [];
  let seq = 0;

  for (let dayOffset = 1; dayOffset <= DAYS_AHEAD; dayOffset++) {
    for (const origin of codes) {
      for (const destination of codes) {
        if (origin === destination) continue;
        if (Math.random() > ROUTE_CHANCE) continue;

        const flightsForRouteDay = randomInt(1, 2);
        for (let i = 0; i < flightsForRouteDay; i++) {
          seq += 1;
          const airlineIndex = randomInt(0, AIRLINES.length - 1);

          const departure = new Date();
          departure.setUTCDate(departure.getUTCDate() + dayOffset);
          const minuteChoices = [0, 15, 30, 45];
          departure.setUTCHours(randomInt(0, 22), minuteChoices[randomInt(0, 3)], 0, 0);

          const durationMinutes = randomInt(90, 780);
          const arrival = new Date(departure.getTime() + durationMinutes * 60_000);

          rows.push({
            flightNumber: flightNumber(airlineIndex, seq),
            airline: AIRLINES[airlineIndex],
            originCode: origin,
            destinationCode: destination,
            departureAt: departure.toISOString(),
            arrivalAt: arrival.toISOString(),
            basePriceCents: randomInt(9000, 85000),
            seatsAvailable: randomInt(20, 180),
          });
        }
      }
    }
  }

  return rows;
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

export async function seedAirports(): Promise<void> {
  for (const airport of airportsSeed) {
    await pool.query(
      `INSERT INTO airports (code, name, city, country) VALUES ($1, $2, $3, $4)
       ON CONFLICT (code) DO NOTHING`,
      [airport.code, airport.name, airport.city, airport.country],
    );
  }
}

export async function seedFlights(): Promise<void> {
  const { rows: existing } = await pool.query("SELECT count(*)::int AS count FROM flights");
  if (existing[0].count > 0) return;

  const rows = generateFlightRows();

  for (const batch of chunk(rows, BATCH_SIZE)) {
    const values: string[] = [];
    const params: unknown[] = [];
    batch.forEach((row, i) => {
      const base = i * 8;
      values.push(
        `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, 'USD', $${base + 8})`,
      );
      params.push(
        row.flightNumber,
        row.airline,
        row.originCode,
        row.destinationCode,
        row.departureAt,
        row.arrivalAt,
        row.basePriceCents,
        row.seatsAvailable,
      );
    });

    await pool.query(
      `INSERT INTO flights
         (flight_number, airline, origin_code, destination_code, departure_at, arrival_at, base_price_cents, currency, seats_available)
       VALUES ${values.join(", ")}
       ON CONFLICT (flight_number, departure_at) DO NOTHING`,
      params,
    );
  }
}
