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
    return <p>No flights found for this route and date.</p>;
  }

  return (
    <ul>
      {flights.map((flight) => (
        <li key={flight.id}>
          <strong>
            {flight.originCode} &rarr; {flight.destinationCode}
          </strong>{" "}
          — {flight.airline} {flight.flightNumber}
          <div>
            Departs {formatTime(flight.departureAt)} · Arrives {formatTime(flight.arrivalAt)}
          </div>
          <div>{formatPrice(flight.basePriceCents, flight.currency)}</div>
        </li>
      ))}
    </ul>
  );
}
