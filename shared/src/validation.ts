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

const NAME_REGEX = /^[\p{L}\p{M}'’\- ]+$/u;
const COUNTRY_CODE_REGEX = /^[A-Za-z]{2}$/;

export const passengerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name required")
    .max(50, "First name must be 50 characters or fewer")
    .regex(NAME_REGEX, "First name contains invalid characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name required")
    .max(50, "Last name must be 50 characters or fewer")
    .regex(NAME_REGEX, "Last name contains invalid characters"),
  email: z.string().trim().min(1, "Email required").email("Enter a valid email address"),
  nationality: z
    .string()
    .trim()
    .min(1, "Nationality required")
    .regex(COUNTRY_CODE_REGEX, "Nationality must be a 2-letter country code")
    .transform((v) => v.toUpperCase()),
});

export type PassengerInput = z.infer<typeof passengerSchema>;

export const bookingCreateSchema = passengerSchema.extend({
  flightId: z.string().uuid("Invalid flight"),
});

export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;
