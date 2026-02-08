'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma as db } from '@/lib/db'

// Validation schemas
const searchDecksSchema = z.object({
  query: z.string().optional(),
  tags: z.array(z.string()).optional(),
  sortBy: z.enum(['newest', 'popular', 'mostCards']).optional().default('newest'),
  limit: z.number().min(1).max(100).optional().default(20),
  offset: z.number().min(0).optional().default(0),
})

const addToLibrarySchema = z.object({
  deckId: z.string().uuid('Invalid deck ID'),
})

// Types
type SearchDecksInput = z.infer<typeof searchDecksSchema>
type AddToLibraryInput = z.infer<typeof addToLibrarySchema>

export async function searchPublicDecks(data?: Partial<SearchDecksInput>) {
  try {
    const session = await auth()
    const validated = searchDecksSchema.parse(data)

    // Build where clause
    const where: any = {
      privacy: 'public',
    }

    // Add search query
    if (validated.query) {
      where.OR = [
        { name: { contains: validated.query, mode: 'insensitive' } },
        { description: { contains: validated.query, mode: 'insensitive' } },
      ]
    }

    // Add tag filter
    if (validated.tags && validated.tags.length > 0) {
      where.tags = {
        some: {
          tag: {
            name: {
              in: validated.tags,
            },
          },
        },
      }
    }

    // Build orderBy clause
    let orderBy: any = {}
    switch (validated.sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'popular':
        orderBy = { quizCount: 'desc' }
        break
      case 'mostCards':
        orderBy = { cards: { _count: 'desc' } }
        break
    }

    // Fetch decks
    const decks = await db.deck.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
            id: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            cards: true,
            comments: true,
            userDecks: true,
          },
        },
      },
      orderBy,
      take: validated.limit,
      skip: validated.offset,
    })

    // Check which decks the user has added (only if logged in)
    let addedDeckIds = new Set<string>()
    if (session?.user?.id) {
      const userDeckIds = await db.userDeck.findMany({
        where: {
          userId: session.user.id,
          deckId: { in: decks.map((d) => d.id) },
        },
        select: { deckId: true },
      })
      addedDeckIds = new Set(userDeckIds.map((ud) => ud.deckId))
    }

    // Add isAdded flag to each deck
    const decksWithStatus = decks.map((deck) => ({
      ...deck,
      isAdded: session?.user?.id ? addedDeckIds.has(deck.id) : false,
      isOwner: session?.user?.id ? deck.userId === session.user.id : false,
    }))

    // Get total count for pagination
    const total = await db.deck.count({ where })

    return {
      success: true,
      data: {
        decks: decksWithStatus,
        total,
        hasMore: validated.offset + validated.limit < total,
      },
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" }
    }
    console.error('Error searching decks:', error)
    return { success: false, error: 'Failed to search decks' }
  }
}

export async function addDeckToLibrary(data: AddToLibraryInput) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const validated = addToLibrarySchema.parse(data)

    // Check if deck exists and is public or owned by user
    const deck = await db.deck.findUnique({
      where: { id: validated.deckId },
      select: { userId: true, privacy: true },
    })

    if (!deck) {
      return { success: false, error: 'Deck not found' }
    }

    const isOwner = deck.userId === session.user.id
    const isPublic = deck.privacy === 'public'

    if (!isOwner && !isPublic) {
      return { success: false, error: 'This deck is not available' }
    }

    if (isOwner) {
      return { success: false, error: 'You cannot add your own deck to your library' }
    }

    // Check if already added
    const existing = await db.userDeck.findUnique({
      where: {
        userId_deckId: {
          userId: session.user.id,
          deckId: validated.deckId,
        },
      },
    })

    if (existing) {
      return { success: false, error: 'Deck already in your library' }
    }

    // Add to library
    await db.userDeck.create({
      data: {
        userId: session.user.id,
        deckId: validated.deckId,
        type: 'added',
      },
    })

    revalidatePath('/discover')
    revalidatePath('/decks')

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" }
    }
    console.error('Error adding deck to library:', error)
    return { success: false, error: 'Failed to add deck to library' }
  }
}

export async function removeDeckFromLibrary(deckId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if deck is in user's library
    const userDeck = await db.userDeck.findUnique({
      where: {
        userId_deckId: {
          userId: session.user.id,
          deckId,
        },
      },
    })

    if (!userDeck) {
      return { success: false, error: 'Deck not in your library' }
    }

    if (userDeck.type !== 'added') {
      return { success: false, error: 'Cannot remove your own deck' }
    }

    // Remove from library
    await db.userDeck.delete({
      where: {
        userId_deckId: {
          userId: session.user.id,
          deckId,
        },
      },
    })

    revalidatePath('/discover')
    revalidatePath('/decks')

    return { success: true }
  } catch (error) {
    console.error('Error removing deck from library:', error)
    return { success: false, error: 'Failed to remove deck from library' }
  }
}

export async function getAllTags() {
  try {
    const tags = await db.tag.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            decks: true,
          },
        },
      },
      orderBy: {
        decks: {
          _count: 'desc',
        },
      },
      take: 50,
    })

    return { success: true, data: tags }
  } catch (error) {
    console.error('Error fetching tags:', error)
    return { success: false, error: 'Failed to fetch tags' }
  }
}
