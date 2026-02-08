'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma as db } from '@/lib/db'

// Validation schemas
const createDeckSchema = z.object({
  name: z.string().min(1, 'Deck name is required').max(100, 'Deck name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  privacy: z.enum(['private', 'public', 'unlisted']).default('private'),
  tags: z.array(z.string()).optional(),
})

const updateDeckSchema = z.object({
  name: z.string().min(1, 'Deck name is required').max(100, 'Deck name is too long').optional(),
  description: z.string().max(500, 'Description is too long').optional(),
  privacy: z.enum(['private', 'public', 'unlisted']).optional(),
  tags: z.array(z.string()).optional(),
})

// Types
type CreateDeckInput = z.infer<typeof createDeckSchema>
type UpdateDeckInput = z.infer<typeof updateDeckSchema>

export async function createDeck(data: CreateDeckInput) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const validated = createDeckSchema.parse(data)

    // Create deck with tags
    const deck = await db.deck.create({
      data: {
        name: validated.name,
        description: validated.description,
        privacy: validated.privacy,
        userId: session.user.id,
        tags: validated.tags
          ? {
              create: await Promise.all(
                validated.tags.map(async (tagName) => {
                  // Find or create tag
                  const tag = await db.tag.upsert({
                    where: { name: tagName },
                    update: {},
                    create: { name: tagName },
                  })
                  return { tagId: tag.id }
                })
              ),
            }
          : undefined,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    revalidatePath('/decks')
    revalidatePath('/dashboard')

    return { success: true, data: deck }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" }
    }
    console.error('Error creating deck:', error)
    return { success: false, error: 'Failed to create deck' }
  }
}

export async function updateDeck(id: string, data: UpdateDeckInput) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user owns the deck
    const existingDeck = await db.deck.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!existingDeck) {
      return { success: false, error: 'Deck not found' }
    }

    if (existingDeck.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const validated = updateDeckSchema.parse(data)

    // Handle tags update if provided
    if (validated.tags !== undefined) {
      // Delete existing tags
      await db.deckTag.deleteMany({
        where: { deckId: id },
      })

      // Create new tags
      if (validated.tags.length > 0) {
        await Promise.all(
          validated.tags.map(async (tagName) => {
            const tag = await db.tag.upsert({
              where: { name: tagName },
              update: {},
              create: { name: tagName },
            })
            await db.deckTag.create({
              data: {
                deckId: id,
                tagId: tag.id,
              },
            })
          })
        )
      }
    }

    // Update deck
    const deck = await db.deck.update({
      where: { id },
      data: {
        name: validated.name,
        description: validated.description,
        privacy: validated.privacy,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    revalidatePath('/decks')
    revalidatePath(`/decks/${id}`)
    revalidatePath('/dashboard')

    return { success: true, data: deck }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" }
    }
    console.error('Error updating deck:', error)
    return { success: false, error: 'Failed to update deck' }
  }
}

export async function deleteDeck(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user owns the deck
    const deck = await db.deck.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!deck) {
      return { success: false, error: 'Deck not found' }
    }

    if (deck.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    await db.deck.delete({
      where: { id },
    })

    revalidatePath('/decks')
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error deleting deck:', error)
    return { success: false, error: 'Failed to delete deck' }
  }
}

export async function getUserDecks() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      console.log('[getUserDecks] No session or user ID')
      return { success: false, error: 'Unauthorized' }
    }

    console.log('[getUserDecks] Fetching decks for user:', session.user.id)

    const decks = await db.deck.findMany({
      where: { userId: session.user.id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            cards: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    console.log('[getUserDecks] Found', decks.length, 'decks')
    return { success: true, data: decks }
  } catch (error) {
    console.error('[getUserDecks] Error fetching user decks:', error)
    return { success: false, error: 'Failed to fetch decks' }
  }
}

export async function getAddedDecks() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const userDecks = await db.userDeck.findMany({
      where: {
        userId: session.user.id,
        type: 'added',
      },
      include: {
        deck: {
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
            user: {
              select: {
                username: true,
              },
            },
            _count: {
              select: {
                cards: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, data: userDecks.map((ud) => ud.deck) }
  } catch (error) {
    console.error('Error fetching added decks:', error)
    return { success: false, error: 'Failed to fetch added decks' }
  }
}

export async function getDeckById(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      console.log('[getDeckById] No session or user ID')
      return { success: false, error: 'You must be logged in to view this deck' }
    }

    console.log('[getDeckById] Looking for deck:', id, 'User:', session.user.id)

    const deck = await db.deck.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        cards: {
          orderBy: { cardOrder: 'asc' },
        },
        user: {
          select: {
            username: true,
            id: true,
          },
        },
        _count: {
          select: {
            cards: true,
            comments: true,
          },
        },
      },
    })

    if (!deck) {
      console.log('[getDeckById] Deck not found in database')
      return { success: false, error: 'Deck not found. It may have been deleted or the link is incorrect.' }
    }

    console.log('[getDeckById] Found deck:', deck.name, 'Owner:', deck.userId, 'Privacy:', deck.privacy)

    // Check if user has access to this deck
    const isOwner = deck.userId === session.user.id
    const isPublic = deck.privacy === 'public'
    const hasAccess = isOwner || isPublic

    console.log('[getDeckById] Access check - isOwner:', isOwner, 'isPublic:', isPublic)

    if (!hasAccess) {
      // Check if user has added this deck
      const userDeck = await db.userDeck.findUnique({
        where: {
          userId_deckId: {
            userId: session.user.id,
            deckId: id,
          },
        },
      })
      console.log('[getDeckById] Checking userDeck:', !!userDeck)
      if (!userDeck) {
        return { success: false, error: 'You do not have permission to view this deck' }
      }
    }

    console.log('[getDeckById] Access granted, returning deck')
    return { success: true, data: deck }
  } catch (error) {
    console.error('[getDeckById] Error fetching deck:', error)
    return { success: false, error: 'Failed to fetch deck. Please try again.' }
  }
}

export async function updateDeckPrivacy(id: string, privacy: 'private' | 'public' | 'unlisted') {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user owns the deck
    const deck = await db.deck.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!deck) {
      return { success: false, error: 'Deck not found' }
    }

    if (deck.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const updatedDeck = await db.deck.update({
      where: { id },
      data: { privacy },
    })

    revalidatePath('/decks')
    revalidatePath(`/decks/${id}`)

    return { success: true, data: updatedDeck }
  } catch (error) {
    console.error('Error updating deck privacy:', error)
    return { success: false, error: 'Failed to update deck privacy' }
  }
}
