import { Flight } from "@flight-booking/shared";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api/client";
import FlightSearchForm, { SearchFormValues } from "../components/FlightSearchForm";

interface SearchResponse {
  flights: Flight[];
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(values: SearchFormValues): Promise<void> {
    setSubmitting(true);
    setError(null);

    try {
      const qs = new URLSearchParams({
        origin: values.origin,
        destination: values.destination,
        departureDate: values.departureDate,
      }).toString();
      const res = await apiGet<SearchResponse>(`/api/flights/search?${qs}`);
      navigate("/results", { state: { flights: res.flights, ...values } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-2xl font-semibold text-slate-900">Search flights</h1>
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <FlightSearchForm onSearch={handleSearch} submitting={submitting} />
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
