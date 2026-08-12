# Ecommerce (work in progress)

Next.js app with PostgreSQL and Prisma, oriented toward a full ecommerce flow (catalog, cart, orders, payments, and auth-ready data models).

## Stack

| Area | Choice |
|------|--------|
| Framework | [Next.js](https://nextjs.org) 16 (App Router), TypeScript |
| UI | React 19, [Tailwind CSS](https://tailwindcss.com) v4 (`@tailwindcss/postcss`) |
| Fonts | [Geist](https://vercel.com/font) / Geist Mono via `next/font` in the root layout |
| Database | PostgreSQL |
| ORM | [Prisma](https://www.prisma.io) 7 |
| DB driver | [`pg`](https://node-postgres.com) with [`@prisma/adapter-pg`](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections#postgresql-using-the-node-postgres-driver) |

Also listed in `package.json` for upcoming features: **NextAuth.js v5 (beta)**, **bcrypt**, and **Zod**. They are not wired into `src/` yet beyond being installed.

## Project layout (high level)

- `src/app/` — App Router pages and API routes
- `src/lib/prisma.ts` — shared `PrismaClient` using the pg adapter and `DATABASE_URL`
- `src/generated/prisma/` — Prisma Client output (generated; do not edit by hand)
- `prisma/schema.prisma` — database schema
- `prisma/seed.ts` — sample product seed script
- `prisma.config.ts` — Prisma config: schema path, migrations directory, seed command, datasource URL from env

## Database schema (current)

Prisma models and enums in `prisma/schema.prisma` include:

- **User** — optional name, unique email, optional password, `UserRole` (default `USER`), optional image; relations to cart, orders, OAuth-style **Account** and **Session** records
- **Product** — name, unique slug, description, price (integer), optional image URL, stock, `isActive`, timestamps
- **Cart** / **CartItem** — one cart per user; line items with quantity; unique `(cartId, productId)`
- **Order** / **OrderItem** — orders with `OrderStatus` and `PaymentStatus`; line items store quantity and `unitPrice` at time of order
- **Payment** — linked to an order; provider fields and amount
- **VerificationToken** — email verification style `(identifier, token)` uniqueness

Enums: `UserRole`, `OrderStatus`, `PaymentStatus`.

The Prisma **generator** writes the client to `../src/generated/prisma` relative to the schema file.

## What’s implemented so far

1. **Home page** (`src/app/page.tsx`) — still the default Create Next App landing content (edit prompt, links to templates/docs).
2. **Root layout** (`src/app/layout.tsx`) — Geist fonts, global styles, basic full-height flex layout.
3. **Products API** — `GET /api/products` returns JSON for **active** products (`isActive: true`), newest first (`createdAt` descending). Errors return 500 with a generic message.
4. **Prisma client helper** — singleton-style client in development, requires `DATABASE_URL`, uses the PostgreSQL adapter.
5. **Seed script** — `prisma/seed.ts` inserts three sample products (wireless headphones, smart watch, gaming mouse) with `skipDuplicates: true`, using the same adapter setup as the app.
6. **Next config** — `allowedDevOrigins` includes `172.18.31.124` for local/dev access from that origin.

## Environment

Set a PostgreSQL connection string:

```bash
export DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Prisma config loads env (see `prisma.config.ts`); ensure `DATABASE_URL` is available when running Prisma CLI and the Next.js app.

## Scripts

From this directory (`ecommerce/`):

```bash
npm install
npm run dev      # Next dev server (webpack)
npm run build    # Production build (webpack)
npm run start    # Start production server
npm run lint     # ESLint
```

Prisma (after `DATABASE_URL` is set):

```bash
npx prisma generate
# Apply schema to the database (choose what fits your workflow):
# npx prisma migrate dev   # when you use migrations
# npx prisma db push       # prototype without migration files
npx prisma db seed         # run prisma/seed.ts (also configured in package.json)
```

Migrations path in config: `prisma/migrations`. Create migrations when you are ready to version schema changes.

## API quick check

With the dev server running and the database migrated/seeded:

```bash
curl -s http://localhost:3000/api/products | jq
```

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
- [Prisma documentation](https://www.prisma.io/docs)

---

*This README describes the state of the repo as of the last update; it does not modify application code.*
