CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS airports (
  code CHAR(3) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS flights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flight_number VARCHAR(10) NOT NULL,
  airline VARCHAR(50) NOT NULL,
  origin_code CHAR(3) NOT NULL REFERENCES airports(code),
  destination_code CHAR(3) NOT NULL REFERENCES airports(code),
  departure_at TIMESTAMPTZ NOT NULL,
  arrival_at TIMESTAMPTZ NOT NULL,
  base_price_cents INT NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  seats_available INT NOT NULL DEFAULT 0,
  UNIQUE (flight_number, departure_at)
);

CREATE INDEX IF NOT EXISTS idx_flights_route_date
  ON flights (origin_code, destination_code, departure_at);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pnr VARCHAR(6) UNIQUE NOT NULL,
  flight_id UUID NOT NULL REFERENCES flights(id),
  status TEXT NOT NULL CHECK (status IN ('PENDING_PAYMENT', 'CONFIRMED', 'EXPIRED', 'FAILED')),
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  amount_cents INT NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email_sent_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_bookings_status_created ON bookings (status, created_at);

CREATE TABLE IF NOT EXISTS passengers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(254) NOT NULL,
  nationality CHAR(2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id VARCHAR(255) UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);
