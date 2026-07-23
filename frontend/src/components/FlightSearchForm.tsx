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

const inputClass =
  "mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
const labelClass = "block text-sm font-medium text-slate-700";
const errorClass = "mt-1 text-sm text-red-600";

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
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="origin" className={labelClass}>
          Origin
        </label>
        <input
          id="origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="JFK"
          maxLength={3}
          className={inputClass}
        />
        {fieldErrors.origin && (
          <p role="alert" className={errorClass}>
            {fieldErrors.origin}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="destination" className={labelClass}>
          Destination
        </label>
        <input
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="LAX"
          maxLength={3}
          className={inputClass}
        />
        {fieldErrors.destination && (
          <p role="alert" className={errorClass}>
            {fieldErrors.destination}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="departureDate" className={labelClass}>
          Departure date
        </label>
        <input
          id="departureDate"
          type="date"
          min={todayIso()}
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          className={inputClass}
        />
        {fieldErrors.departureDate && (
          <p role="alert" className={errorClass}>
            {fieldErrors.departureDate}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || submitting}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {submitting ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
