import { Flight } from "@flight-booking/shared";
import { Link, useLocation } from "react-router-dom";
import FlightResultsList from "../components/FlightResultsList";

interface ResultsLocationState {
  flights: Flight[];
  origin: string;
  destination: string;
  departureDate: string;
}

export default function ResultsPage() {
  const location = useLocation();
  const state = location.state as ResultsLocationState | null;

  if (!state) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-md rounded-lg bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-slate-600">No search in progress.</p>
          <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">
            Back to search
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">
            {state.origin} &rarr; {state.destination}{" "}
            <span className="font-normal text-slate-500">on {state.departureDate}</span>
          </h1>
          <Link to="/" className="text-sm font-medium text-indigo-600 hover:underline">
            New search
          </Link>
        </div>
        <FlightResultsList flights={state.flights} />
      </div>
    </main>
  );
}
