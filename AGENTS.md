# LEV Smart – Agent Instructions

These instructions apply to the entire repository. Read this file before making changes. Also read the instructions in `frontend/AGENTS.md` or `backend/AGENTS.md` before working in that area.

## 1. Project overview

LEV Smart is a modular-monolith, client-server application.

- **Frontend:** React + Vite (JavaScript)
- **Backend:** Python + FastAPI
- **Database:** Supabase (external service)
- **AI:** Google Gemini through the backend
- **Local development:** Docker Compose

Keep the existing architecture. Do not introduce a new framework, service, database, or architectural pattern without asking the team first.

## 2. Non-negotiable rules

1. **Inspect before editing.** Read the relevant files and understand the existing implementation before changing it.
2. **Follow the existing structure.** Put code in the feature/module that owns it. Do not create alternative project structures.
3. **Keep changes focused.** Implement only the requested feature and necessary integration. Do not refactor unrelated code.
4. **Do not overwrite working code blindly.** Preserve existing behavior unless the task explicitly changes it.
5. **No duplicate implementations.** Search for an existing component, service, schema, utility, or endpoint before creating another one.
6. **No secrets in source control.** Never add API keys, passwords, tokens, or real `.env` values to tracked files. Use `.env.example` with empty or placeholder values.
7. **Do not invent configuration.** Reuse existing environment-variable names and configuration patterns. Document any new variable.
8. **Do not silently change API contracts.** Coordinate frontend/backend changes and keep request/response schemas consistent.
9. **Do not add dependencies casually.** First check whether the project already has a suitable dependency. Explain why a new dependency is needed.
10. **Do not edit generated or unrelated files.** Avoid changing lockfiles, Docker files, Compose, or project-wide configuration unless required.
11. **No fake success.** Handle loading, empty, validation, and error states. Do not return hardcoded success data in place of real behavior.
12. **Do not commit or push unless explicitly asked.** Never push directly to `main`.

## 3. How to add a feature

Before coding:

- Identify whether the work belongs to the frontend, backend, or both.
- Inspect the closest existing feature/module and follow its conventions.
- Identify the data flow: UI → frontend service → backend API → backend service/repository → Supabase or external provider.
- Check whether an endpoint or shared component already exists.
- If a requirement is unclear or conflicts with the current architecture, ask before making a broad assumption.

While coding:

- Keep feature-specific code inside that feature.
- Keep shared code genuinely reusable across multiple features.
- Keep API calls out of React page/component files; use the feature's service layer.
- Keep business logic out of FastAPI route handlers; use the backend service layer.
- Validate incoming API data with Pydantic schemas.
- Use clear names and small functions.
- Avoid circular imports and cross-feature dependencies.

After coding:

- Run the relevant checks and tests available in the repository.
- Check `git diff` and `git status`.
- Report what changed, which checks passed, and anything not tested.
- Do not claim a test passed unless it was actually run.

## 4. Boundaries between features

A feature may use another feature only through a clear, stable interface. Do not import another feature's internal files just because they are accessible.

Move code to `shared` only when it is genuinely used by more than one feature. Do not create a generic `utils` or `common` dumping ground.

## 5. Documentation

When adding or changing a feature, update the relevant documentation if needed:

- New environment variables → `.env.example` and setup documentation.
- New or changed API endpoint → endpoint/request/response documentation.
- New feature setup or workflow → relevant README or feature documentation.
- New dependency → dependency manifest and a short reason in the change summary.

## 6. Definition of done

A change is ready for review when:

- It follows the existing folder structure.
- It does not break existing features.
- Frontend and backend API contracts agree.
- Inputs are validated and errors are handled.
- No secrets or local-only files are included.
- Relevant tests/checks have been run, or missing checks are clearly stated.
- The final summary lists changed files and any follow-up needed.
