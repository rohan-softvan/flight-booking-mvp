# Flight Booking MVP

Mock flight search + guest checkout + Stripe test payment + PDF ticket + email confirmation + auto-cancellation. Built as a Docker Compose stack: `frontend` (React/Vite), `backend` (Express/TypeScript), `db` (Postgres), `mailhog` (local email catch-all, added in a later stage).

## Quick start

```bash
cp .env.example .env
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend health check: http://localhost:4000/api/health
- Postgres: localhost:5432 (credentials in `.env`)

## Project layout

- `shared/` — TypeScript types + Zod validation schemas shared by frontend and backend.
- `backend/` — Express API, Postgres access, migrations, background jobs.
- `frontend/` — React (Vite) app.

## Status

This project is being built in stages, each merged as its own PR. See the plan for the full stage breakdown. Current: **Stage 1 — scaffolding + docker-compose skeleton + health check.**
