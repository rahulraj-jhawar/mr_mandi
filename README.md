# Mr Mandi

Turborepo monorepo with a TypeScript frontend and backend. No database.

## Stack

- **Turborepo** + **pnpm** workspaces
- `apps/web` — [Next.js 15](https://nextjs.org) (App Router, React 19) on port **3000** — a full-screen, map-first landing app: builders discover verified labour brokers, see predicted labour flows across India, filter by trade/skill, and request sourcing. Uses [Leaflet](https://leafletjs.com) + CARTO basemap.
- `apps/api` — [NestJS 11](https://nestjs.com) on port **3001**

## Getting started

```bash
pnpm install
pnpm dev
```

`pnpm dev` runs both apps in parallel via Turborepo:

- Web → http://localhost:3000
- API → http://localhost:3001 (health check at `/health`)

The web homepage fetches the API's `/health` endpoint to confirm the two are wired together.

## Scripts (run from the repo root)

| Command       | Description                          |
| ------------- | ------------------------------------ |
| `pnpm dev`    | Run all apps in dev/watch mode       |
| `pnpm build`  | Build all apps                       |
| `pnpm start`  | Start all apps from their builds     |
| `pnpm lint`   | Lint all apps                        |
| `pnpm format` | Format the repo with Prettier        |

You can target a single app with a filter, e.g. `pnpm --filter @mr-mandi/api dev`.

## Layout

```
.
├── apps
│   ├── api   # NestJS
│   └── web   # Next.js
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Environment

- `apps/api` — `PORT` (default 3001), `WEB_ORIGIN` (CORS origin, default http://localhost:3000)
- `apps/web` — `NEXT_PUBLIC_API_URL` (default http://localhost:3001)
