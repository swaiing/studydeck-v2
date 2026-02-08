# Studydeck v2

A modern, general-purpose flashcard study platform built with Next.js 15, React 19, TypeScript, and PostgreSQL.

## Overview

Studydeck v2 is a complete rebuild of the original Studydeck (decommissioned 2013) with modern web technologies. This version maintains feature parity with the original while providing a better user experience and modern architecture.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js v5 (coming soon)
- **Deployment**: Vercel

## Features (MVP)

- ✅ User authentication (signup/login)
- ✅ Create and manage flashcard decks
- ✅ Study interface with flip animations
- ✅ Progress tracking (correct/incorrect counts)
- ✅ Difficulty ratings for cards
- ✅ Personal hints for cards
- ✅ Deck discovery (browse, search, tags)
- ✅ Deck comments
- ✅ Groups (create, share decks, invite members)
- ✅ Public/private deck privacy settings

## Getting Started

### Prerequisites

- Node.js 20.9.0 or higher
- PostgreSQL database (local or hosted)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd studydeck-v2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your database credentials and secrets.

4. Set up the database:
```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# Open Prisma Studio to view/edit data
npx prisma studio
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup Options

### Option 1: Local PostgreSQL with Docker
```bash
# Create docker-compose.yml (see docs/GETTING_STARTED.md)
docker-compose up -d
```

### Option 2: Neon (Recommended)
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `.env.local`

### Option 3: Supabase
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection string from Settings > Database
4. Copy to `.env.local`

## Project Structure

```
studydeck-v2/
├── src/
│   ├── app/                # Next.js App Router pages
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── cards/         # Card-specific components
│   │   ├── decks/         # Deck-specific components
│   │   ├── study/         # Study interface components
│   │   └── layout/        # Layout components
│   ├── lib/               # Utilities and configurations
│   ├── actions/           # Server Actions
│   └── types/             # TypeScript type definitions
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── docs/                  # Planning and documentation
└── public/                # Static assets
```

## Development Roadmap

See [docs/MVP_PLAN.md](./docs/MVP_PLAN.md) for the full development plan.

### Current Phase: MVP Complete! 🎉
- [x] Project setup
- [x] Database schema
- [x] Authentication implementation (NextAuth v5)
- [x] Basic layout and navigation
- [x] Deck CRUD operations
- [x] Card management
- [x] My Decks page
- [x] Study interface with flip animations
- [x] Progress tracking and answer recording
- [x] Difficulty ratings (1-5 stars)
- [x] Personal hints for cards
- [x] Keyboard shortcuts
- [x] Study session stats and results
- [x] Discover page with public decks
- [x] Search and filter functionality
- [x] Add deck to library
- [x] Deck comments system
- [x] Tag filtering and browsing
- [x] Groups (create, manage, share decks)
- [x] Member management (add, remove)

### Next Phase
- Polish & Deploy (Week 6)
2. Groups (Week 5)
3. Polish & Deploy (Week 6)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio
- `npx prisma migrate dev` - Create and run migrations
- `npx prisma generate` - Generate Prisma Client

## Documentation

- [MVP Plan](./docs/MVP_PLAN.md) - Full development roadmap
- [Database Schema](./docs/MODERN_SCHEMA.md) - Database design
- [Getting Started Guide](./docs/GETTING_STARTED.md) - Detailed setup instructions

## Original Version

This is a rebuild of the original Studydeck (2013). See the [legacy repository](https://github.com/swaiing/studydeck) for the original CakePHP implementation.

## License

MIT License - See LICENSE file for details

## Contributing

This is currently a personal project. Contributions welcome once MVP is complete.
