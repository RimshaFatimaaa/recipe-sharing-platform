# RecipeShare

RecipeShare is a web app for sharing and discovering recipes. Signed-in users can publish recipes, search the community feed, like and comment, and keep a list of recipes they have liked.

## Features

- Email and password sign up and sign in with [Supabase Auth](https://supabase.com/docs/guides/auth)
- Dashboard of recent recipes, with search by title and filters for category and difficulty
- Create, edit, and delete your own recipes (title, description, cooking time, difficulty, category, ingredients, and instructions)
- Like recipes and browse everything you have liked on the Saved page
- Comment on recipes; comment authors and recipe owners can delete comments
- Profile page to set a full name and username

## Tech stack

- [Next.js](https://nextjs.org/) 15 (App Router) and React 19
- TypeScript
- Tailwind CSS 4
- Supabase (`@supabase/supabase-js` and `@supabase/ssr`) for auth and data

## Prerequisites

- Node.js 20 or later
- A [Supabase](https://supabase.com/) project

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Both values are in the Supabase dashboard under **Project Settings → API**.

3. Create the database tables described below, then start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production server |
| `npm run lint` | Run ESLint |

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon (public) key |

`.env*` files are gitignored. Do not commit keys.

## Database

The app expects these tables in the Supabase `public` schema. `profiles.id` must match `auth.users.id`. A profile row is created automatically after sign-in if one does not exist.

**profiles**

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key, same as `auth.users.id` |
| `username` | `text` | Optional public handle |
| `full_name` | `text` | Optional |
| `email` | `text` | Copied from the auth user |
| `created_at` | `timestamptz` | Optional |
| `updated_at` | `timestamptz` | Optional |

**recipes**

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key (the app supplies this on insert) |
| `user_id` | `uuid` | Foreign key to `profiles.id` |
| `title` | `text` | Required |
| `description` | `text` | Optional |
| `ingredients` | `text` | One ingredient per line |
| `instructions` | `text` | One step per line |
| `cooking_time` | `int4` | Minutes |
| `difficulty` | `text` | `Easy`, `Medium`, or `Hard` |
| `category` | `text` | For example `Breakfast`, `Lunch`, `Dinner`, `Dessert` |

**likes**

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | Foreign key to `profiles.id` |
| `recipe_id` | `uuid` | Foreign key to `recipes.id` |
| `created_at` | `timestamptz` | Used to order the Saved page |

**comments**

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | Foreign key to `profiles.id` |
| `recipe_id` | `uuid` | Foreign key to `recipes.id` |
| `content` | `text` | Required |
| `created_at` | `timestamptz` | Optional |

The Saved page joins `likes` to `recipes`, so `likes.recipe_id` needs a foreign key to `recipes.id`.

Enable Row Level Security and add policies that match how the app uses the anon key: authenticated users can read recipes, profiles, likes, and comments; they can insert and update their own profile and recipes; they can insert and delete their own likes and comments; recipe owners can delete comments on their recipes and can update or delete their own recipes.

## Routes

| Path | Who can open it | What it does |
| --- | --- | --- |
| `/` | Anyone | Landing page |
| `/auth/signup` | Anyone | Create an account |
| `/auth/login` | Anyone | Sign in |
| `/auth/callback` | Auth redirect | Exchanges the auth code and ensures a profile exists |
| `/dashboard` | Signed in | Browse, search, and like recipes |
| `/recipes/new` | Signed in | Publish a recipe |
| `/recipes/[id]` | Anyone with the link | View a recipe, like it, and comment (editing requires ownership) |
| `/saved` | Signed in | Recipes the current user has liked |
| `/profile` | Signed in | Edit full name and username |

## Project structure

```
app/                  App Router pages, layouts, and server actions
  auth/               Sign in, sign up, and the auth callback
  dashboard/          Community recipe feed
  profile/            Profile editor
  recipes/            Create and view recipes
  saved/              Liked recipes
components/           Header, auth forms, and recipe UI
lib/supabase/         Browser and server Supabase clients, auth, and queries
middleware.ts         Refreshes the Supabase session on each request
```
