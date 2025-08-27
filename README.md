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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Supabase setup

1) Create a Supabase project and enable Email auth (done).

2) Create two tables in SQL Editor (you already did):
   - profiles: id (uuid, FK to auth.users.id), username, full_name, email, created_at, updated_at
   - recipes: id (uuid), created_at, user_id (uuid -> profiles.id), title, description, ingredients (text), cooking_time (int4), difficulty (text), category (text), instructions (text)

3) Add environment variables.

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4) Supabase client usage in code.

- Browser client: `lib/supabase/client.ts`
- Server client: `lib/supabase/server.ts`
- Auth helpers: `lib/supabase/auth.ts`

Example (server) fetching latest recipes:

```ts
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getLatestRecipes() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("id, title, created_at")
    .order("created_at", { ascending: false })
    .limit(12);
  if (error) throw error;
  return data;
}
```

5) Run the app:

```bash
npm run dev
```

Open http://localhost:3000
