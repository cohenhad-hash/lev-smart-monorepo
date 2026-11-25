# Frontend feature guide

Add new UI functionality inside its own folder under `src/features/`.

Example for a feature named `tasks`:

```text
src/features/tasks/
├── components/
│   └── TaskCard.jsx
├── pages/
│   └── TasksPage.jsx
└── services/
    └── tasksService.js
```

Suggested implementation flow:

1. Build the feature page in `pages/`.
2. Put feature-only UI pieces in `components/`.
3. Put backend requests in `services/`.
4. Register the page in `src/app/App.jsx` using the existing router.
5. Reuse shared layout/components where appropriate.
6. Keep styling scoped to the feature and preserve RTL.
7. Confirm the frontend request matches the backend endpoint and schema.

Do not copy the AI Assistant implementation blindly. Follow its structure, but adapt the files to the new feature.
