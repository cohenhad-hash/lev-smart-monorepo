# Frontend Instructions

These instructions apply to everything under `frontend/`. Also follow the repository-root `AGENTS.md`.

## 1. Current stack and conventions

- React
- Vite
- JavaScript (not TypeScript unless the team explicitly agrees to migrate)
- React Router
- CSS
- API calls to the FastAPI backend

Keep the existing app entry point, routing approach, layout, RTL behavior, and styling conventions. Inspect the current implementation before changing it.

## 2. Folder structure

Use the existing feature-based structure:

```text
frontend/
└── src/
    ├── app/
    │   └── App.jsx                 # App-level routing and composition
    ├── features/
    │   ├── home/
    │   │   └── pages/
    │   └── ai-assistant/
    │       ├── components/         # Components used only by this feature
    │       ├── pages/              # Route-level screens
    │       └── services/           # API calls for this feature
    ├── shared/
    │   └── components/
    │       └── layout/             # Components shared by multiple features
    ├── styles/
    │   └── index.css               # Global styles
    └── main.jsx                    # React entry point
```

When adding a feature, create its own folder under `src/features/`, for example:

```text
features/
└── feature-name/
    ├── components/
    ├── pages/
    ├── services/
    └── hooks/       # Only if the feature needs custom hooks
```

Create only the subfolders that are actually needed. Do not create empty folders or move files just for consistency.

## 3. Responsibilities

- `app/`: app-wide setup, route registration, and composition only.
- `features/<name>/pages/`: screens connected to routes.
- `features/<name>/components/`: UI components used only by that feature.
- `features/<name>/services/`: HTTP/API communication for that feature.
- `features/<name>/hooks/`: feature-specific reusable React hooks, when needed.
- `shared/components/`: UI used by multiple features and not owned by one feature.
- `styles/`: global styles, design tokens, and global CSS only.

Do not put all feature code in `App.jsx`. Do not put feature-specific components in `shared`.

## 4. React and component rules

1. Use functional components and React hooks.
2. Keep components focused. Split a component when it has multiple distinct responsibilities.
3. Keep API requests in service files, not directly inside JSX components.
4. Keep state local unless multiple components genuinely need it.
5. Use props for clear parent-to-child data flow.
6. Do not add a state-management library without team approval.
7. Do not add a UI/component library without team approval.
8. Use stable React keys when rendering lists.
9. Avoid unnecessary effects. Do not use `useEffect` for values that can be calculated during render.
10. Do not use `dangerouslySetInnerHTML` unless explicitly required and reviewed.

## 5. API communication

- Use the existing API base URL pattern: `import.meta.env.VITE_API_URL || "http://localhost:8000"`.
- Keep endpoint paths and request/response fields aligned with the backend.
- Put each feature's requests in its `services/` directory.
- Check `response.ok` before treating a fetch response as successful.
- Handle network errors and backend error responses.
- Do not put Gemini or Supabase secret keys in frontend code. Frontend environment variables prefixed with `VITE_` are public in the browser bundle.
- Do not call Gemini directly from the browser. AI requests must go through the backend.

## 6. UI, language, and accessibility

- The product UI is Hebrew and right-to-left (RTL) unless a specific screen has an agreed reason otherwise.
- Preserve the existing RTL layout and global styles.
- Use semantic HTML elements and accessible labels for inputs and buttons.
- Include loading, empty, validation, and error states where relevant.
- Make layouts usable on both desktop and mobile.
- Avoid adding global CSS rules that unintentionally affect unrelated features. Prefer feature-scoped class names.

## 7. Routing

- Register new pages through the existing routing setup in `src/app/App.jsx`.
- Do not create a second router.
- Avoid changing existing route paths unless the task explicitly requires it.
- Keep route-level pages in the feature's `pages/` directory.

## 8. Dependencies and scripts

- Check `package.json` before adding a package.
- Do not replace the existing package manifest or remove dependencies to solve a local issue.
- If a dependency is added, explain why and ensure the Docker-based install still works.

## 9. Before finishing

- Run the available frontend checks/build (inspect `package.json` scripts first).
- Test the changed screen and its API interaction when possible.
- Check browser console for errors if the app can be run.
- Review `git diff` for unrelated formatting or file changes.
- State clearly what was and was not tested.
