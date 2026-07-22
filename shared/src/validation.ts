import { z } from "zod";

const AIRPORT_CODE_REGEX = /^[A-Za-z]{3}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isNotPastDate(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(`${dateStr}T00:00:00`);
  return date.getTime() >= today.getTime();
}

export const searchQuerySchema = z
  .object({
    origin: z
      .string()
      .trim()
      .min(1, "Origin required")
      .regex(AIRPORT_CODE_REGEX, "Origin must be a 3-letter airport code")
      .transform((v) => v.toUpperCase()),
    destination: z
      .string()
      .trim()
      .min(1, "Destination required")
      .regex(AIRPORT_CODE_REGEX, "Destination must be a 3-letter airport code")
      .transform((v) => v.toUpperCase()),
    departureDate: z
      .string()
      .trim()
      .min(1, "Departure date required")
      .regex(DATE_REGEX, "Departure date must be in YYYY-MM-DD format")
      .refine(isNotPastDate, "Departure date cannot be in the past"),
  })
  .refine((data) => data.origin !== data.destination, {
    message: "Origin and destination cannot be identical",
    path: ["destination"],
  });

export type SearchQuery = z.infer<typeof searchQuerySchema>;
