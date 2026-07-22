import { Airport, Flight, SearchQuery } from "@flight-booking/shared";
import { pool } from "../db/pool";

interface FlightDbRow {
  id: string;
  flight_number: string;
  airline: string;
  origin_code: string;
  destination_code: string;
  departure_at: string;
  arrival_at: string;
  base_price_cents: number;
  currency: string;
  seats_available: number;
}

function mapFlight(row: FlightDbRow): Flight {
  return {
    id: row.id,
    flightNumber: row.flight_number,
    airline: row.airline,
    originCode: row.origin_code,
    destinationCode: row.destination_code,
    departureAt: row.departure_at,
    arrivalAt: row.arrival_at,
    basePriceCents: row.base_price_cents,
    currency: row.currency,
    seatsAvailable: row.seats_available,
  };
}

export async function listAirports(): Promise<Airport[]> {
  const { rows } = await pool.query<Airport>(
    "SELECT code, name, city, country FROM airports ORDER BY code ASC",
  );
  return rows;
}

export async function searchFlights(query: SearchQuery): Promise<Flight[]> {
  const { rows } = await pool.query<FlightDbRow>(
    `SELECT id, flight_number, airline, origin_code, destination_code, departure_at, arrival_at, base_price_cents, currency, seats_available
     FROM flights
     WHERE origin_code = $1
       AND destination_code = $2
       AND departure_at >= $3::date
       AND departure_at < ($3::date + interval '1 day')
     ORDER BY departure_at ASC`,
    [query.origin, query.destination, query.departureDate],
  );
  return rows.map(mapFlight);
}

export async function getFlightById(id: string): Promise<Flight | null> {
  const { rows } = await pool.query<FlightDbRow>(
    `SELECT id, flight_number, airline, origin_code, destination_code, departure_at, arrival_at, base_price_cents, currency, seats_available
     FROM flights WHERE id = $1`,
    [id],
  );
  return rows.length > 0 ? mapFlight(rows[0]) : null;
}
