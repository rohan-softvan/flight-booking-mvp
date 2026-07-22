import { searchQuerySchema } from "@flight-booking/shared";
import { FormEvent, useState } from "react";

export interface SearchFormValues {
  origin: string;
  destination: string;
  departureDate: string;
}

interface Props {
  onSearch: (values: SearchFormValues) => void;
  submitting: boolean;
}

const todayIso = (): string => new Date().toISOString().slice(0, 10);

export default function FlightSearchForm({ onSearch, submitting }: Props) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: FormEvent): void {
    e.preventDefault();

    const result = searchQuerySchema.safeParse({ origin, destination, departureDate });
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0]?.toString() ?? "_root";
        if (!(key in errors)) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    onSearch(result.data);
  }

  const isValid = origin.trim() !== "" && destination.trim() !== "" && departureDate.trim() !== "";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="origin">Origin</label>
        <input
          id="origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="JFK"
          maxLength={3}
        />
        {fieldErrors.origin && <p role="alert">{fieldErrors.origin}</p>}
      </div>

      <div>
        <label htmlFor="destination">Destination</label>
        <input
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="LAX"
          maxLength={3}
        />
        {fieldErrors.destination && <p role="alert">{fieldErrors.destination}</p>}
      </div>

      <div>
        <label htmlFor="departureDate">Departure date</label>
        <input
          id="departureDate"
          type="date"
          min={todayIso()}
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
        />
        {fieldErrors.departureDate && <p role="alert">{fieldErrors.departureDate}</p>}
      </div>

      <button type="submit" disabled={!isValid || submitting}>
        {submitting ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
