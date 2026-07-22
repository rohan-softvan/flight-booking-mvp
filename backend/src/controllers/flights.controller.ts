import { searchQuerySchema } from "@flight-booking/shared";
import { Request, Response } from "express";
import { AppError } from "../middleware/errorHandler";
import { getFlightById, searchFlights } from "../services/flightService";
import { zodFieldErrors } from "../utils/zodError";

export async function search(req: Request, res: Response): Promise<void> {
  const parsed = searchQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError(400, "VALIDATION_ERROR", "Invalid search parameters", zodFieldErrors(parsed.error));
  }

  const flights = await searchFlights(parsed.data);
  res.json({ flights });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const flight = await getFlightById(req.params.id);
  if (!flight) {
    throw new AppError(404, "FLIGHT_NOT_FOUND", "Flight not found");
  }
  res.json({ flight });
}
