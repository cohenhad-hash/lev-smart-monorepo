# Backend module guide

Add each backend feature as a module under `app/modules/`.

Example:

```text
app/modules/tasks/
├── __init__.py
├── router.py
├── schemas.py
├── service.py
└── repository.py   # Only when database access is needed
```

Suggested implementation flow:

1. Define request/response models in `schemas.py`.
2. Add business logic in `service.py`.
3. Add database access in `repository.py` only if needed.
4. Expose endpoints from `router.py`.
5. Register the router in `app/main.py`.
6. Coordinate the endpoint and schema with the frontend feature service.
7. Add validation and error handling, then run relevant tests.

Keep the module self-contained. Do not import another module's internal service or repository directly without agreeing on a stable interface.
