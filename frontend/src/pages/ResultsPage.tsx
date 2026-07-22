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
      <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
        <p>No search in progress.</p>
        <Link to="/">Back to search</Link>
      </main>
    );
  }

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>
        {state.origin} &rarr; {state.destination} on {state.departureDate}
      </h1>
      <Link to="/">New search</Link>
      <FlightResultsList flights={state.flights} />
    </main>
  );
}
