# Backend Instructions

These instructions apply to everything under `backend/`. Also follow the repository-root `AGENTS.md`.

## 1. Current stack and conventions

- Python
- FastAPI
- Pydantic for request/response validation
- Supabase as an external database service
- Google Gemini accessed from the backend

Keep the existing FastAPI application and modular-monolith architecture. Do not introduce a separate microservice or a new framework without team approval.

## 2. Folder structure

Use the existing structure:

```text
backend/
└── app/
    ├── main.py
    └── modules/
        └── ai_assistant/
            ├── __init__.py
            ├── router.py
            ├── schemas.py
            └── service.py
```

Add each backend feature as a module under `app/modules/`:

```text
app/
├── main.py
└── modules/
    ├── ai_assistant/
    │   ├── __init__.py
    │   ├── router.py
    │   ├── schemas.py
    │   ├── service.py
    │   └── repository.py   # Only if data access is needed
    └── feature_name/
        ├── __init__.py
        ├── router.py
        ├── schemas.py
        ├── service.py
        └── repository.py   # Only if data access is needed
```

Create only the files a module needs. Do not add empty placeholder layers.

## 3. Responsibilities

- `main.py`: create the FastAPI app, configure app-wide middleware, and register module routers. Keep feature logic out of this file.
- `router.py`: define endpoints, HTTP status codes, and translate expected service errors into HTTP responses. Keep it thin.
- `schemas.py`: define Pydantic request/response models and validation.
- `service.py`: implement feature/business logic and coordinate integrations.
- `repository.py`: database access and persistence logic, only when needed.

Do not put all endpoints in `main.py`. Do not put business logic or database queries directly in route handlers.

## 4. API design

1. Use a feature-specific route prefix, such as `/api/<feature>`.
2. Use Pydantic models for request and response bodies.
3. Return predictable response shapes and appropriate HTTP status codes.
4. Validate user input at the API boundary.
5. Handle expected errors explicitly. Do not expose stack traces, secrets, or internal exception details to clients.
6. Do not silently rename or remove existing endpoints or response fields.
7. If an endpoint changes, update its frontend service and documentation in the same change.
8. Keep route handlers `async` when they call async services; do not block the event loop with synchronous I/O inside async handlers.

## 5. Database and external services

- Keep Supabase access on the backend unless the team explicitly agrees on a different design.
- Do not place Supabase service-role keys or Gemini API keys in frontend code.
- Read credentials from environment variables; never hardcode them.
- Reuse existing configuration and client setup if present. Do not create a new client independently in every function if a shared pattern already exists.
- Keep external-provider calls in service/integration code, not in route handlers.
- Handle timeouts, provider errors, and missing configuration clearly.
- Do not invent database tables or columns. Inspect the current schema or ask the team if it is not available.

## 6. Security and validation

- Treat all client input as untrusted.
- Validate lengths, types, required fields, and allowed values.
- Do not log API keys, access tokens, passwords, or sensitive user data.
- Avoid returning raw provider exceptions to the client.
- Use least-privilege credentials.
- Do not add permissive CORS origins beyond the project's actual development/production needs.
- Never commit `.env` or real credentials.

## 7. Dependencies and configuration

- Check `requirements.txt` before adding packages.
- Add only dependencies required by the feature.
- If a new environment variable is needed, document it and add an empty/placeholder entry to `.env.example`.
- Do not change Dockerfile or `docker-compose.yml` unless the feature genuinely requires it. Explain why the change is needed.
- Keep local development compatible with the existing Docker Compose workflow.

## 8. Testing

- Inspect existing tests and conventions before adding new ones.
- Add tests for new business logic and API behavior when a test setup exists or can be added without broad restructuring.
- Test validation failures and expected error paths, not only the happy path.
- Run available tests and basic app/import checks.
- Do not claim tests passed unless they were run.

## 9. Before finishing

- Verify the new router is registered in `app/main.py`.
- Verify request/response schemas match what the frontend sends and expects.
- Verify configuration and `.env.example` are updated if needed.
- Review `git diff` for unrelated changes or secrets.
- Summarize endpoints, changed files, tests run, and anything still needed.
