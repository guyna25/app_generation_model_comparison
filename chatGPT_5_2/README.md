# Minimal Todo App

This project provides a minimal todo experience covering both a React/Tailwind front-end and a Node/Express back-end with optional MongoDB support.

## Directory layout

- `frontend/` – Vite + React + Tailwind UI with local-storage persistence and unit tests via Vitest.
- `backend/` – Express + TypeScript service that switches between a JSON file store and MongoDB at runtime.

## Getting started

1. Install dependencies for both sides:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. Run the backend in development:
   ```bash
   cd backend
   npm run dev
   ```
   Use `DB_TYPE=mongo` together with `MONGO_URI` to switch to MongoDB.
3. Run the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Testing

- Backend: `cd backend && npm test`
- Frontend: `cd frontend && npm test`

## Deployment

- Build backend: `npm run build` inside `backend`.
- Build frontend: `npm run build` inside `frontend`.

The APIs are exposed under `/api/todos` and are ready for future extension.

