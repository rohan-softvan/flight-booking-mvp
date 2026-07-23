import { useState } from "react";
import { Navigate } from "react-router-dom";
import { apiPost } from "../api/client";
import PassengerForm, { PassengerFormValues } from "../components/PassengerForm";
import { BookingResult, useBookingDraft } from "../state/BookingDraftContext";

function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export default function PassengerFormPage() {
  const { flight, booking, setBooking } = useBookingDraft();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!flight) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(values: PassengerFormValues): Promise<void> {
    setSubmitting(true);
    setError(null);
    try {
      const res = await apiPost<BookingResult>("/api/bookings", {
        flightId: flight!.id,
        ...values,
      });
      setBooking(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (booking) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-md rounded-lg bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <h1 className="text-xl font-semibold text-slate-900">Booking created</h1>
          <p className="mt-2 text-slate-600">
            PNR: <span className="font-mono font-semibold">{booking.pnr}</span>
          </p>
          <p className="mt-1 text-slate-600">
            Amount due: {formatPrice(booking.amountCents, booking.currency)}
          </p>
          <p className="mt-4 text-sm text-slate-500">Payment continues in the next stage.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-md">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Passenger details</h1>
        <p className="mb-6 text-slate-600">
          {flight.originCode} &rarr; {flight.destinationCode} &middot; {flight.airline} {flight.flightNumber}
        </p>
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <PassengerForm onSubmit={handleSubmit} submitting={submitting} />
          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
