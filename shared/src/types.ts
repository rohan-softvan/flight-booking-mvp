export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  originCode: string;
  destinationCode: string;
  departureAt: string;
  arrivalAt: string;
  basePriceCents: number;
  currency: string;
  seatsAvailable: number;
}

export type BookingStatus = "PENDING_PAYMENT" | "CONFIRMED" | "EXPIRED" | "FAILED";

export interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
}

export interface Booking {
  id: string;
  pnr: string;
  flightId: string;
  status: BookingStatus;
  amountCents: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}
