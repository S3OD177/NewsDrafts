# NewsDrafts

Personal web app to monitor RSS feeds and draft tweets manually with ChatGPT/Gemini **without any AI API usage**.

## Stack
- Next.js App Router + TypeScript
- TailwindCSS + lightweight shadcn-style UI primitives
- Prisma + PostgreSQL
- RSS ingestion via `rss-parser`

## Environment
Copy `.env.example` to `.env` and set values:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB
CRON_SECRET=replace_me_with_random_16+chars
APP_BASE_URL=http://localhost:3000
```

## Run locally
```bash
npm install
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

## Prisma setup
- `prisma/schema.prisma` contains models for `Source`, `Item`, `Draft`, and singleton `Settings`.
- Run migrations with `npx prisma migrate dev`.
- Seed defaults with `npm run prisma:seed`.

## Add sources
- Open `/sources`
- Add source `name`, `rss_url`, `topic`, and keep enabled

## Run ingestion locally
Call cron endpoint with secret:

```bash
curl -X POST "$APP_BASE_URL/api/cron/ingest" -H "x-cron-secret: $CRON_SECRET"
```

Or use helper script:

```bash
npm run ingest:local
```

## Deploy on Vercel
1. Create external Postgres and set `DATABASE_URL`
2. Set `CRON_SECRET` and `APP_BASE_URL` env vars
3. Deploy app
4. Vercel cron example is in `vercel.json`

## Cloudflare Access note
This app intentionally has no in-app auth and assumes edge protection via Cloudflare Access. Cron ingestion still requires `x-cron-secret`.

## Routes
- `/inbox`
- `/item/[id]`
- `/drafts`
- `/sources`
- `/settings`
- `/` redirects to `/inbox`

## Build troubleshooting
If `next build` fails with `Cannot find module 'autoprefixer'`, ensure dependencies are installed from `package.json` and that your environment is not skipping required packages during install. This repository includes `autoprefixer` explicitly for PostCSS builds.
