# Getting Started - Studydeck MVP

## Quick Start Commands

### 1. Initialize Project
```bash
# Create Next.js project
npx create-next-app@latest studydeck-v2 \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd studydeck-v2
```

### 2. Install Dependencies
```bash
# Core dependencies
npm install prisma @prisma/client
npm install next-auth@beta
npm install zod
npm install lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install class-variance-authority clsx tailwind-merge

# Dev dependencies
npm install -D @types/node
```

### 3. Setup shadcn/ui
```bash
npx shadcn@latest init

# Install required components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tabs
npx shadcn@latest add textarea
npx shadcn@latest add badge
npx shadcn@latest add separator
npx shadcn@latest add avatar
```

### 4. Setup Prisma
```bash
# Initialize Prisma
npx prisma init

# Edit prisma/schema.prisma with our schema
# Then create initial migration
npx prisma migrate dev --name init

# Open Prisma Studio to view database
npx prisma studio
```

### 5. Setup Environment Variables
```bash
# Create .env.local
cat > .env.local << EOF
DATABASE_URL="postgresql://user:password@localhost:5432/studydeck"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
EOF
```

### 6. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

---

## Prisma Schema

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  username     String    @unique
  passwordHash String    @map("password_hash")
  role         String    @default("user")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  decks         Deck[]
  userDecks     UserDeck[]
  results       Result[]
  ratings       Rating[]
  hints         Hint[]
  comments      Comment[]
  ownedGroups   Group[]        @relation("GroupOwner")
  groupMembers  GroupMember[]

  @@map("users")
}

model Deck {
  id          String   @id @default(uuid())
  name        String
  description String?
  privacy     String   @default("private")
  userId      String   @map("user_id")
  quizCount   Int      @default(0) @map("quiz_count")
  isPremium   Boolean  @default(false) @map("is_premium")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  cards      Card[]
  userDecks  UserDeck[]
  tags       DeckTag[]
  comments   Comment[]
  groupDecks GroupDeck[]

  @@index([userId])
  @@index([privacy])
  @@map("decks")
}

model Card {
  id        String   @id @default(uuid())
  deckId    String   @map("deck_id")
  question  String
  answer    String
  cardOrder Int      @map("card_order")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  deck    Deck     @relation(fields: [deckId], references: [id], onDelete: Cascade)
  results Result[]
  ratings Rating[]
  hints   Hint[]

  @@index([deckId])
  @@index([deckId, cardOrder])
  @@map("cards")
}

model UserDeck {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  deckId    String   @map("deck_id")
  type      String   @default("added")
  quizCount Int      @default(0) @map("quiz_count")
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  deck Deck @relation(fields: [deckId], references: [id], onDelete: Cascade)

  @@unique([userId, deckId])
  @@index([userId])
  @@map("user_decks")
}

model Result {
  id             String   @id @default(uuid())
  userId         String   @map("user_id")
  cardId         String   @map("card_id")
  lastGuess      Boolean  @map("last_guess")
  totalCorrect   Int      @default(0) @map("total_correct")
  totalIncorrect Int      @default(0) @map("total_incorrect")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  card Card @relation(fields: [cardId], references: [id], onDelete: Cascade)

  @@unique([userId, cardId])
  @@index([userId, cardId])
  @@map("results")
}

model Rating {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  cardId    String   @map("card_id")
  rating    Int
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  card Card @relation(fields: [cardId], references: [id], onDelete: Cascade)

  @@unique([userId, cardId])
  @@index([cardId])
  @@map("ratings")
}

model Hint {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  cardId    String   @map("card_id")
  hint      String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  card Card @relation(fields: [cardId], references: [id], onDelete: Cascade)

  @@unique([userId, cardId])
  @@index([userId, cardId])
  @@map("hints")
}

model Tag {
  id        String    @id @default(uuid())
  name      String    @unique
  createdAt DateTime  @default(now()) @map("created_at")

  decks DeckTag[]

  @@index([name])
  @@map("tags")
}

model DeckTag {
  id        String   @id @default(uuid())
  deckId    String   @map("deck_id")
  tagId     String   @map("tag_id")
  createdAt DateTime @default(now()) @map("created_at")

  deck Deck @relation(fields: [deckId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@unique([deckId, tagId])
  @@index([deckId])
  @@index([tagId])
  @@map("deck_tags")
}

model Comment {
  id        String   @id @default(uuid())
  deckId    String   @map("deck_id")
  userId    String   @map("user_id")
  comment   String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  deck Deck @relation(fields: [deckId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([deckId])
  @@index([userId])
  @@map("comments")
}

model Group {
  id          String   @id @default(uuid())
  name        String
  description String?
  ownerId     String   @map("owner_id")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  owner   User          @relation("GroupOwner", fields: [ownerId], references: [id], onDelete: Cascade)
  members GroupMember[]
  decks   GroupDeck[]

  @@index([ownerId])
  @@map("groups")
}

model GroupMember {
  id        String   @id @default(uuid())
  groupId   String   @map("group_id")
  userId    String   @map("user_id")
  role      String   @default("member")
  createdAt DateTime @default(now()) @map("created_at")

  group Group @relation(fields: [groupId], references: [id], onDelete: Cascade)
  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([groupId, userId])
  @@index([groupId])
  @@index([userId])
  @@map("group_members")
}

model GroupDeck {
  id        String   @id @default(uuid())
  groupId   String   @map("group_id")
  deckId    String   @map("deck_id")
  addedBy   String?  @map("added_by")
  createdAt DateTime @default(now()) @map("created_at")

  group Group @relation(fields: [groupId], references: [id], onDelete: Cascade)
  deck  Deck  @relation(fields: [deckId], references: [id], onDelete: Cascade)

  @@unique([groupId, deckId])
  @@index([groupId])
  @@map("group_decks")
}
```

---

## Database Setup Options

### Option 1: Local PostgreSQL (Docker)
```bash
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: studydeck
      POSTGRES_PASSWORD: studydeck
      POSTGRES_DB: studydeck
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:

# Start database
docker-compose up -d
```

### Option 2: Neon (Free, Hosted PostgreSQL)
1. Go to https://neon.tech
2. Create free account
3. Create new project
4. Copy connection string to `.env.local`

### Option 3: Supabase (Free, with Auth & Storage)
1. Go to https://supabase.com
2. Create free account
3. Create new project
4. Get connection string from Settings > Database
5. Copy to `.env.local`

---

## Next Steps

1. **Review the plan documents**:
   - `MVP_PLAN.md` - Full development roadmap
   - `MODERN_SCHEMA.md` - Database design
   - `GETTING_STARTED.md` - This file

2. **Choose your database** (Neon recommended for quick start)

3. **Run the setup commands** above

4. **Start building**:
   - Begin with Phase 1 (Foundation)
   - Implement authentication first
   - Then deck CRUD operations
   - Then study interface
   - Finally social features

5. **Refer to original codebase** for UX inspiration:
   - Check `/root/app/views/` for original page layouts
   - Check `/root/app/webroot/js/` for original jQuery interactions

---

## Helpful Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js v5 Docs](https://authjs.dev)
- [shadcn/ui Components](https://ui.shadcn.com)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

## Questions?

- **Authentication**: NextAuth makes this easy. Start with email/password, can add OAuth later
- **File upload** (for card images later): Use Vercel Blob or Cloudflare R2
- **Real-time features**: Can add later with Pusher or Supabase Realtime
- **Search**: Start with simple SQL `LIKE`, upgrade to full-text search later
