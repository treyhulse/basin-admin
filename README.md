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
- OpenAPI 3.0 specification in `./src/lib/openapi.json`
- Swagger 2.0 specification in `./src/lib/swagger.json` (legacy)

## Create the app
```bash
# from repo root
npm create next-app basin-admin --ts --eslint --app --src-dir --tailwind
cd basin-admin
npm add @tanstack/react-query zod axios @zodios/core
npm add -D openapi-typescript
```

## API Specifications

This project automatically maintains two API specification formats:

- **Swagger 2.0** (`./src/lib/swagger.json`) - Fetched directly from your backend for interactive docs
- **OpenAPI 3.0.0** (`./src/lib/openapi.json`) - Automatically converted from Swagger 2.0 for type generation

**Note:** Both files are automatically kept in sync using the update script. The backend serves Swagger UI from the Swagger 2.0 spec, while the OpenAPI 3.0 spec is used for generating TypeScript types.

## Generate API types
```bash
# from basin-admin directory
npm run generate-types

# This will generate TypeScript types from the local OpenAPI 3.0 spec file
# The types will automatically update when you regenerate them
# You can also view the API docs at http://localhost:8080/swagger/index.html (Swagger UI)
```

## Maintaining API Specifications

When your API changes, simply run one command to update everything:

```bash
npm run update-api
```

This command will:
1. **Fetch the latest Swagger 2.0** from your backend at `http://localhost:8080/swagger/doc.json`
2. **Automatically convert it to OpenAPI 3.0** format
3. **Save both specification files** in the correct locations
4. **Generate TypeScript types** automatically

Everything is updated in one go! 🎉

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
- To regenerate types after API changes, run the generate command again

## Next steps
- Add role/permission editor pages
- Add invite flow (backend endpoints TBD) and tenant switcher
- Add optimistic updates for data tables
- Consider using a tool like `@zodios/core` for type-safe API calls
