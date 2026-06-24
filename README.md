This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Crew Manifest (`/crew`)

The Crew Manifest lets shipmates sign up as crew for individual voyage legs. It
is gated by a single shared password (no usernames).

- Set `CREW_PASSWORD` in your environment (see `.env.example`). For local work,
  `.env.local` is used. Rotating the password and restarting the server signs
  everyone out.
- Crew sign-ups are stored server-side. **Local dev:** SQLite at
  `./data/crew.sqlite` (override with `CREW_DB_PATH`; git-ignored).
- **Production / serverless (e.g. Vercel — read-only filesystem):** set
  `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to use Supabase/Postgres
  instead. Run `supabase/schema.sql` once in the Supabase SQL Editor, then add
  both env vars (service-role key is server-only) and redeploy. When these are
  set, SQLite is not used.
- Each leg accepts up to 3 crew. Some legs may be reserved and not open for
  sign-up.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
