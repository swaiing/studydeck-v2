# Studydeck MVP - Development Plan

## Project Structure

```
studydeck-v2/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes (login, signup)
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/       # Protected routes
│   │   │   ├── dashboard/     # User dashboard
│   │   │   ├── decks/         # Deck management
│   │   │   │   ├── [id]/      # View/edit deck
│   │   │   │   ├── new/       # Create deck
│   │   │   │   └── study/[id] # Study interface
│   │   │   ├── discover/      # Browse public decks
│   │   │   ├── groups/        # Groups management
│   │   │   └── profile/       # User profile
│   │   ├── api/               # API routes (if needed)
│   │   ├── layout.tsx
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── cards/             # Card-related components
│   │   ├── decks/             # Deck-related components
│   │   ├── study/             # Study interface components
│   │   └── layout/            # Layout components
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── db.ts              # Prisma client
│   │   ├── validations.ts     # Zod schemas
│   │   └── utils.ts           # Utility functions
│   ├── actions/               # Server Actions
│   │   ├── deck-actions.ts
│   │   ├── card-actions.ts
│   │   ├── study-actions.ts
│   │   └── group-actions.ts
│   └── types/                 # TypeScript types
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Pages & Features

### 1. **Landing Page** (`/`)
- Hero section with value prop
- Feature highlights
- CTA to signup
- Sample deck preview

### 2. **Authentication**
- `/login` - Email/password login
- `/signup` - User registration
- `/forgot-password` - Password reset

### 3. **Dashboard** (`/dashboard`)
- Overview of user's decks
- Study stats (cards studied today, streak)
- Recent activity
- Quick actions (create deck, browse decks)

### 4. **My Decks** (`/decks`)
- List of user's created decks
- List of added decks (from others)
- Filters (created/added, tags)
- Create new deck button

### 5. **Deck Management** (`/decks/[id]`)
- View deck details
- Edit deck (name, description, privacy, tags)
- Card list with reordering
- Add/edit/delete cards
- Deck stats (times studied, avg rating)
- Comments section
- Share button

### 6. **Study Interface** (`/decks/study/[id]`)
- Card flip animation
- Progress indicator (5/50)
- Mark correct/incorrect
- Rate difficulty (1-5 stars)
- Add personal hint
- Keyboard shortcuts (space = flip, left = incorrect, right = correct)
- End screen with stats

### 7. **Discover** (`/discover`)
- Browse public decks
- Search by name/description
- Filter by tags
- Sort by popularity, date, rating
- Preview deck cards
- Add to library button

### 8. **Groups** (`/groups`)
- List user's groups
- Create new group
- Group detail page:
  - Members list
  - Shared decks
  - Invite members (email)
  - Group activity feed

### 9. **Profile** (`/profile`)
- User info (username, email)
- Study statistics
- Change password
- Delete account

---

## Development Phases

### **Phase 1: Foundation** (Week 1)
- [ ] Initialize Next.js project with TypeScript
- [ ] Setup TailwindCSS + shadcn/ui
- [ ] Setup Prisma + PostgreSQL
- [ ] Implement database schema
- [ ] Setup NextAuth.js
- [ ] Create basic layout/navigation

### **Phase 2: Core Deck Features** (Week 2)
- [ ] Create deck (CRUD)
- [ ] Add cards to deck (CRUD)
- [ ] Card reordering (drag-and-drop)
- [ ] Deck privacy settings
- [ ] Tag management
- [ ] My Decks page

### **Phase 3: Study Interface** (Week 3)
- [ ] Flashcard flip animation
- [ ] Progress tracking (correct/incorrect)
- [ ] Difficulty ratings
- [ ] Personal hints
- [ ] Study session stats
- [ ] Keyboard shortcuts

### **Phase 4: Discovery & Social** (Week 4)
- [ ] Browse/search public decks
- [ ] Add deck to library
- [ ] Deck comments
- [ ] User profiles
- [ ] Tag filtering

### **Phase 5: Groups** (Week 5)
- [ ] Create/manage groups
- [ ] Add/remove members
- [ ] Share decks with group
- [ ] Group activity

### **Phase 6: Polish & Deploy** (Week 6)
- [ ] Responsive design
- [ ] Loading states
- [ ] Error handling
- [ ] SEO optimization
- [ ] Deploy to Vercel
- [ ] Setup analytics

---

## Key Components

### StudyCard Component
```tsx
interface StudyCardProps {
  card: Card;
  onFlip: () => void;
  onRate: (rating: number) => void;
  onCorrect: () => void;
  onIncorrect: () => void;
  isFlipped: boolean;
  userHint?: string;
}
```

### DeckCard Component
```tsx
interface DeckCardProps {
  deck: Deck;
  cardCount: number;
  tags: Tag[];
  author: User;
  onAddToLibrary?: () => void;
  onStudy?: () => void;
}
```

### CardEditor Component
```tsx
interface CardEditorProps {
  card?: Card;
  onSave: (question: string, answer: string) => void;
  onCancel: () => void;
}
```

---

## Server Actions

### Deck Actions
```typescript
// actions/deck-actions.ts
'use server'

export async function createDeck(data: CreateDeckInput) { }
export async function updateDeck(id: string, data: UpdateDeckInput) { }
export async function deleteDeck(id: string) { }
export async function addDeckToLibrary(deckId: string) { }
export async function updateDeckPrivacy(id: string, privacy: Privacy) { }
```

### Study Actions
```typescript
// actions/study-actions.ts
'use server'

export async function recordAnswer(cardId: string, correct: boolean) { }
export async function rateCard(cardId: string, rating: number) { }
export async function addHint(cardId: string, hint: string) { }
export async function getStudySession(deckId: string) { }
```

---

## API Routes (if needed)

Most actions can use Server Actions, but these might need API routes:

- `/api/decks/search` - Full-text search
- `/api/stats/dashboard` - Aggregate stats
- `/api/export/deck/[id]` - Export deck as JSON/CSV

---

## Environment Variables

```bash
# .env.example
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

---

## Tech Decisions

### Why Server Actions over API routes?
- Type-safe by default
- No need for separate API layer
- Automatic revalidation
- Better DX

### Why Prisma over Drizzle?
- Better TypeScript support
- Excellent migrations
- Great dev tools (Prisma Studio)
- Larger community

### Why NextAuth v5?
- Native Next.js App Router support
- Built-in session management
- Easy OAuth integration (if needed later)

---

## Success Metrics (MVP)

- User can create account
- User can create deck with 10+ cards
- User can study a deck and see progress
- User can browse and add public decks
- User can create a group and share a deck
- Page load < 2s
- Mobile responsive
- Zero critical bugs

---

## Post-MVP Features (Future)

1. Spaced repetition algorithm
2. Multiple study modes (multiple choice, typing)
3. Import from Anki/Quizlet
4. Mobile app (PWA)
5. AI card generation
6. Payments for premium decks
7. Rich text editor for cards
8. Image/audio support
9. Gamification (streaks, achievements)
10. Analytics dashboard
