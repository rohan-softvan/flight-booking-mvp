import { Flight } from "@flight-booking/shared";

interface Props {
  flights: Flight[];
}

function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FlightResultsList({ flights }: Props) {
  if (flights.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
        <p className="text-slate-600">No flights found for this route and date.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {flights.map((flight) => (
        <li
          key={flight.id}
          className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200"
        >
          <div>
            <div className="font-semibold text-slate-900">
              {flight.originCode} &rarr; {flight.destinationCode}{" "}
              <span className="font-normal text-slate-500">
                &middot; {flight.airline} {flight.flightNumber}
              </span>
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Departs {formatTime(flight.departureAt)} &middot; Arrives {formatTime(flight.arrivalAt)}
            </div>
          </div>
          <div className="text-lg font-semibold text-slate-900">
            {formatPrice(flight.basePriceCents, flight.currency)}
          </div>
        </li>
      ))}
    </ul>
  );
}
