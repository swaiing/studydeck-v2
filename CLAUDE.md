# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Studydeck v2 is a modern flashcard study platform built with Next.js 15 App Router, React 19, TypeScript, Prisma, and PostgreSQL. This is a complete rebuild of the original Studydeck (2013) with modern web technologies.

**Production URL:** https://studydeck-v2.vercel.app
**Demo User:** demo@studydeck.app / demo123

## Essential Commands

### Development
```bash
npm run dev              # Start dev server at localhost:3000
npm run build           # Build for production (always test before deploy)
npm run lint            # Run ESLint
```

### Database
```bash
npx prisma studio                    # Open visual database editor
npx prisma migrate dev --name <name> # Create and apply migration
npx prisma generate                  # Regenerate Prisma Client (auto on postinstall)
npx prisma db seed                   # Seed database with sample decks
npx prisma db push                   # Push schema changes without migration (dev only)
```

### Deployment
```bash
vercel --prod           # Deploy to production
git push origin main    # Push to GitHub
```

## Architecture Overview

### Next.js App Router Structure

The app uses **route groups** to organize pages with different layouts:

- **`src/app/(auth)/`** - Authentication pages (login, signup) with minimal layout
- **`src/app/(dashboard)/`** - Authenticated pages with shared `NavBar` component
- **`src/app/`** - Public pages (landing, discover, about, pricing, privacy, terms)

**Key Routing Pattern:**
- Logged-in users redirected from `/` to `/dashboard`
- Logged-out users clicking decks on `/discover` redirect to `/login?redirect=/decks/{id}`
- Login/signup pages handle `?redirect=` parameter to return users after auth

### Server Actions Pattern

All data mutations use Next.js Server Actions (`'use server'`) located in `src/actions/`:

```typescript
// Pattern: Always validate with Zod, check auth, return success/error
export async function actionName(data: Input) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const validated = schema.parse(data)
    // ... perform database operations

    revalidatePath('/relevant-path') // Invalidate Next.js cache
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: 'Error message' }
  }
}
```

**Important:** Public actions (like `searchPublicDecks`) must NOT require authentication - check `session` but don't return error if null.

### Authentication (NextAuth v5)

- **Implementation:** `src/lib/auth.ts` using Credentials provider
- **Strategy:** JWT-based sessions (no database sessions)
- **Password:** bcrypt hashed
- **Session Access:** Use `await auth()` in Server Components or `useSession()` in Client Components
- **Protected Routes:** Check session in page component, redirect if needed

### Database Schema Key Relationships

**User → Deck Ownership:**
- `User.decks[]` - Decks created by user
- `UserDeck` - Junction table for "added to library" decks (type: 'added' vs 'owner')

**Card Progress Tracking:**
- `Result` - Stores per-user, per-card correct/incorrect counts and last guess
- `Rating` - Stores per-user difficulty rating (1-5) for cards
- `Hint` - Stores per-user personal mnemonics for cards

**Deck Discovery:**
- `Deck.privacy` - 'public' decks appear in discover page
- `DeckTag` - Many-to-many relationship between Decks and Tags
- `Comment` - User comments on public decks

**Groups:**
- `Group` - Study groups with owner
- `GroupMember` - Users in groups (role: 'owner' or 'member')
- `GroupDeck` - Decks shared to groups

### State Management

This app uses **no global state management** (no Redux, Zustand, etc.). Data flow:

1. **Server Components** - Fetch data directly with Prisma, pass as props
2. **Client Components** - Use Server Actions for mutations, `router.refresh()` for updates
3. **Optimistic Updates** - Use `useState` locally, revert on error

### Database Connection (Supabase)

**Critical:** Always use `?pgbouncer=true&connection_limit=1` in `DATABASE_URL` to avoid prepared statement errors with Supabase connection pooling.

```bash
# .env.local
DATABASE_URL="postgresql://...@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://...@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
```

- Use `DATABASE_URL` (port 6543) for queries
- Use `DIRECT_URL` (port 5432) for migrations and Prisma Studio
- See `DATABASE-SETUP.md` for full details

## Component Patterns

### Server Components (Default)
```typescript
// src/app/(dashboard)/decks/page.tsx
export default async function DecksPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const result = await getUserDecks()
  // Pass data to client components as needed
}
```

### Client Components
```typescript
// src/components/deck-form.tsx
'use client'

export function DeckForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await createDeck(formData)
    if (result.success) {
      router.push(`/decks/${result.data.id}`)
      router.refresh() // Revalidate server data
    }
    setLoading(false)
  }
}
```

### UI Components (shadcn/ui)
- Located in `src/components/ui/`
- Installed via `npx shadcn@latest add <component>`
- Uses Tailwind CSS with CVA (class-variance-authority)
- Uses Radix UI primitives

## Study Flow Architecture

**Study Session State:**
1. Fetch all cards for deck with user's results/ratings/hints
2. Shuffle cards (except first time through)
3. Track correct/incorrect in local state
4. On finish, bulk save results with `recordStudySession()`

**Study Mode Features:**
- Space/Enter to flip card
- Arrow keys or buttons to mark correct/incorrect
- Star icons (1-5) to set difficulty rating
- Personal hint input field per card
- Session stats: correct/incorrect/remaining counts

## Common Workflows

### Adding a New Feature

1. **Database First:** If new data needed, update `prisma/schema.prisma` and run `npx prisma migrate dev`
2. **Server Action:** Create action in `src/actions/` following validation pattern
3. **UI Component:** Create in appropriate `src/components/` subfolder
4. **Page Integration:** Import and use in page with error handling

### Deployment Checklist

1. `npm run build` - Must succeed locally
2. Test authentication flows (login, signup, logout)
3. Test database operations work
4. `git push origin main` - Push to GitHub
5. `vercel --prod` - Deploy to Vercel
6. Verify on production URL

### Database Changes

1. Edit `prisma/schema.prisma`
2. `npx prisma migrate dev --name descriptive_name` - Creates migration
3. `npx prisma generate` - Updates TypeScript types (auto on postinstall)
4. Update Server Actions to use new schema
5. Test locally before deploying
6. Migrations run automatically on Vercel deploy

## Key Files

- `src/lib/auth.ts` - NextAuth configuration
- `src/lib/db.ts` - Prisma client singleton
- `src/components/layout/nav-bar.tsx` - Main navigation for authenticated users
- `prisma/seed.ts` - Database seeding with 8 sample decks
- `DATABASE-SETUP.md` - Supabase connection configuration

## Environment Variables

Required in `.env.local` and Vercel:

```bash
DATABASE_URL="postgresql://...?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://..."
AUTH_SECRET="<generate with: openssl rand -base64 32>"
AUTH_URL="http://localhost:3000" # or production URL
```

## Testing Locally

The seed script creates a demo user and 8 public decks:
```bash
npx prisma db seed
# Login: demo@studydeck.app / demo123
```

## Known Issues & Gotchas

1. **useSearchParams() in Client Components** - Must wrap in `<Suspense>` or Next.js will error during build
2. **Prepared Statement Errors** - Always verify `?pgbouncer=true` in DATABASE_URL
3. **Router Cache** - After mutations, call `router.refresh()` to update server data
4. **Public vs Auth Routes** - Discover page is public but uses session optionally; don't require auth in `searchPublicDecks`
5. **Card Order** - Use `cardOrder` field (not `order`) when creating cards in Prisma

## TypeScript Patterns

- Use `@/*` path alias for imports from `src/`
- Server Actions return `{ success: boolean, data?: T, error?: string }`
- Zod schemas for all Server Action inputs
- Prisma-generated types for database models
- Use `any` sparingly - prefer `unknown` or proper types
