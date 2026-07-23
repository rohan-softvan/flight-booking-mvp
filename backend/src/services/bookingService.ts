import { BookingCreateInput } from "@flight-booking/shared";
import { pool } from "../db/pool";
import { AppError } from "../middleware/errorHandler";
import { generatePnr } from "../utils/pnr";
import { getFlightById } from "./flightService";

const MAX_PNR_ATTEMPTS = 5;

export interface CreateBookingResult {
  bookingId: string;
  pnr: string;
  amountCents: number;
  currency: string;
}

export async function createBooking(input: BookingCreateInput): Promise<CreateBookingResult> {
  const flight = await getFlightById(input.flightId);
  if (!flight) {
    throw new AppError(404, "FLIGHT_NOT_FOUND", "Flight not found");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let bookingId: string | null = null;
    let pnr = "";
    for (let attempt = 0; attempt < MAX_PNR_ATTEMPTS && !bookingId; attempt++) {
      pnr = generatePnr();
      const { rows } = await client.query(
        `INSERT INTO bookings (pnr, flight_id, status, amount_cents, currency)
         VALUES ($1, $2, 'PENDING_PAYMENT', $3, $4)
         ON CONFLICT (pnr) DO NOTHING
         RETURNING id`,
        [pnr, flight.id, flight.basePriceCents, flight.currency],
      );
      if (rows.length > 0) {
        bookingId = rows[0].id;
      }
    }

    if (!bookingId) {
      throw new AppError(
        500,
        "PNR_GENERATION_FAILED",
        "Could not generate a unique booking reference, please try again",
      );
    }

    await client.query(
      `INSERT INTO passengers (booking_id, first_name, last_name, email, nationality)
       VALUES ($1, $2, $3, $4, $5)`,
      [bookingId, input.firstName, input.lastName, input.email, input.nationality],
    );

    await client.query("COMMIT");

    return { bookingId, pnr, amountCents: flight.basePriceCents, currency: flight.currency };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
