import { useEffect, useState } from "react";
import { apiGet } from "./api/client";

interface HealthResponse {
  status: string;
}

export default function App() {
  const [apiStatus, setApiStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    apiGet<HealthResponse>("/api/health")
      .then((res) => setApiStatus(res.status === "ok" ? "ok" : "error"))
      .catch(() => setApiStatus("error"));
  }, []);

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Flight Booking MVP</h1>
      <p>
        API:{" "}
        {apiStatus === "loading" ? "checking..." : apiStatus === "ok" ? "ok" : "unreachable"}
      </p>
    </main>
  );
}
