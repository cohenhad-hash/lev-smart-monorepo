# LEV Smart

Modular Monolith group project.

## Architecture
- Frontend: React + Vite
- Backend: Python + FastAPI
- Database: Supabase (external)

## Backend Modules
- Auth & Users
- Courses & Assignments
- AI Assistant
- Analytics & Notifications

## Run
docker compose up --build

## URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

## Authentication API

- `POST /auth/register` creates a user with `email`, `password` (minimum 8 characters), and `fullName`.
- Registration assigns the `user` role and returns the created user without its password hash.
- Returns `409` if the email is already registered and `503` if Supabase is unavailable or not configured.

## Stop
docker compose down
