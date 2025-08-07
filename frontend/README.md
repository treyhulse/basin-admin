### Basin Admin Frontend Guide

This guide helps you bootstrap a Next.js admin UI alongside the Go backend in a monorepo.

## Repository layout

```
basin/          # Go API (this repo)
basin-admin/    # Next.js admin UI (new)
```

## Tech stack
- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query (React Query)
- OpenAPI-generated client in `./swagger.json`

## Create the app
```bash
# from repo root
npm create next-app basin-admin --ts --eslint --app --src-dir --tailwind
cd basin-admin
npm add @tanstack/react-query zod axios @zodios/core
npm add -D openapi-typescript
```

## Generate API types (ignore this for now, just use the swagger.json file in the project root)
```bash
# from repo root
npx openapi-typescript http://localhost:8080/swagger/doc.json -o basin-admin/src/lib/api-types.ts

# This will generate TypeScript types from the Swagger spec
# The types will automatically update when the API changes
# You can also view the API docs at http://localhost:8080/swagger/index.html
```

## Basic API client
```ts
// basin-admin/src/lib/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  withCredentials: true,
})
```

## Auth flow
- Call `POST /auth/login` with email/password.
- Store JWT in httpOnly cookie via a Next.js Route Handler (`/api/session/login`).
- Forward cookie to API on server actions/fetches.

## Pages to start
- `/login`: form → POST to `/api/session/login` → redirect to `/collections`
- `/collections`: list from `GET /items/collections?limit=50&sort=created_at&order=desc`
- `/collections/[name]`: show fields and data grid
- `/users`, `/roles`, `/permissions`: basic CRUD shells

## UI patterns
- Use shadcn/ui for forms, modals, tables.
- Use React Query for caching and mutations.
- Use Zod to validate forms.

## Env
Create `basi n-admin/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## CORS
Backend includes permissive CORS for dev. In production, restrict to your admin domain.

## Development Tips
- Use the Swagger UI at http://localhost:8080/swagger/index.html to:
  - Explore available endpoints
  - Test API calls directly
  - View request/response schemas
  - Check authentication requirements
- The API types will automatically update when you:
  - Add new endpoints
  - Modify existing endpoints
  - Run `make start` or `make docs` on the backend

## Next steps
- Add role/permission editor pages
- Add invite flow (backend endpoints TBD) and tenant switcher
- Add optimistic updates for data tables
- Consider using a tool like `@zodios/core` for type-safe API calls
