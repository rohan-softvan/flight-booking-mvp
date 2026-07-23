import { bookingCreateSchema } from "@flight-booking/shared";
import { Request, Response } from "express";
import { AppError } from "../middleware/errorHandler";
import { createBooking } from "../services/bookingService";
import { zodFieldErrors } from "../utils/zodError";

export async function create(req: Request, res: Response): Promise<void> {
  const parsed = bookingCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, "VALIDATION_ERROR", "Invalid booking details", zodFieldErrors(parsed.error));
  }

  const result = await createBooking(parsed.data);
  res.status(201).json(result);
}
