import { Route, Routes } from "react-router-dom";
import PassengerFormPage from "./pages/PassengerFormPage";
import ResultsPage from "./pages/ResultsPage";
import SearchPage from "./pages/SearchPage";
import { BookingDraftProvider } from "./state/BookingDraftContext";

export default function App() {
  return (
    <BookingDraftProvider>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/book" element={<PassengerFormPage />} />
      </Routes>
    </BookingDraftProvider>
  );
}
