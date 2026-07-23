import { Flight } from "@flight-booking/shared";
import { createContext, ReactNode, useContext, useState } from "react";

export interface BookingResult {
  bookingId: string;
  pnr: string;
  amountCents: number;
  currency: string;
}

interface BookingDraftValue {
  flight: Flight | null;
  setFlight: (flight: Flight) => void;
  booking: BookingResult | null;
  setBooking: (booking: BookingResult) => void;
}

const BookingDraftContext = createContext<BookingDraftValue | null>(null);

export function BookingDraftProvider({ children }: { children: ReactNode }) {
  const [flight, setFlight] = useState<Flight | null>(null);
  const [booking, setBooking] = useState<BookingResult | null>(null);

  return (
    <BookingDraftContext.Provider value={{ flight, setFlight, booking, setBooking }}>
      {children}
    </BookingDraftContext.Provider>
  );
}

export function useBookingDraft(): BookingDraftValue {
  const ctx = useContext(BookingDraftContext);
  if (!ctx) throw new Error("useBookingDraft must be used within a BookingDraftProvider");
  return ctx;
}
