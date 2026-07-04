# ShramSetu

A labour-sourcing platform connecting Indian builders (who post crew requirements) with a network of verified labour brokers (who fulfill them), with automatic routing and a national labour-flow view to guide sourcing decisions.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/shramsetu run dev` — run the ShramSetu web frontend (usually managed via workflow restarts, not run directly)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Frontend: React + Vite (artifact `shramsetu`)

## Where things live

- OpenAPI contract: `lib/api-spec/openapi.yaml`
- Generated React Query hooks: `lib/api-client-react/src/generated/api.ts`
- Generated Zod schemas: `lib/api-zod/src/generated/api.ts`
- DB schema: `lib/db/src/schema/` (`brokers.ts`, `requirements.ts`, `labor_flow_regions.ts`)
- API routes: `artifacts/api-server/src/routes/` (`requirements.ts`, `brokers.ts`, `labor-flow.ts`, `dashboard.ts`)
- Auto-routing logic: `artifacts/api-server/src/lib/routing.ts`
- Frontend app: `artifacts/shramsetu/` — Builder view (Dashboard, Post Requirement, Active Projects) and Broker view (Dispatcher Console, Broker Directory, Register)

## Architecture decisions

- No authentication — broker identity is simulated by picking a broker from the directory (per user request, this is a demo/MVP without login).
- Auto-routing on requirement creation: matches by same state + skill + available capacity first, then falls back to same state any skill, then any state with capacity. Declining a routed requirement returns capacity to the broker.
- `labor_flow_regions` is a seeded/static table (not live-computed) representing historical/predicted labour outflow per Indian state, used to power the national labour-flow dashboard view.

## Product

- **Builders** post crew requirements (skill type, tier, worker count, wages, site location, dates) and see them auto-routed to a broker, or track status on an Active Projects list.
- **Brokers** view requirements routed to them in a Dispatcher Console and Accept/Decline/Mark Fulfilled; they can also browse the verified Broker Directory and register as new brokers.
- **National Labour Flow dashboard** shows per-state historical/predicted labour outflow, demand/supply indices, and stability score to guide sourcing toward more stable-supply regions.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Seeding data directly via SQL bypasses the app's auto-routing logic — seeded requirements will show `routedBrokerId: null` even if a matching broker with capacity exists. This is expected for seed data; routing only fires on actual `POST /requirements` calls through the API.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
