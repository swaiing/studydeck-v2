'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma as db } from '@/lib/db'

// Validation schemas
const createCardSchema = z.object({
  deckId: z.string().uuid('Invalid deck ID'),
  question: z.string().min(1, 'Question is required').max(5000, 'Question is too long'),
  answer: z.string().min(1, 'Answer is required').max(5000, 'Answer is too long'),
})

const updateCardSchema = z.object({
  question: z.string().min(1, 'Question is required').max(5000, 'Question is too long').optional(),
  answer: z.string().min(1, 'Answer is required').max(5000, 'Answer is too long').optional(),
})

const reorderCardsSchema = z.object({
  deckId: z.string().uuid('Invalid deck ID'),
  cardIds: z.array(z.string().uuid('Invalid card ID')),
})

// Types
type CreateCardInput = z.infer<typeof createCardSchema>
type UpdateCardInput = z.infer<typeof updateCardSchema>
type ReorderCardsInput = z.infer<typeof reorderCardsSchema>

export async function createCard(data: CreateCardInput) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const validated = createCardSchema.parse(data)

    // Check if user owns the deck
    const deck = await db.deck.findUnique({
      where: { id: validated.deckId },
      select: { userId: true, _count: { select: { cards: true } } },
    })

    if (!deck) {
      return { success: false, error: 'Deck not found' }
    }

    if (deck.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get the next card order number
    const nextOrder = deck._count.cards

    const card = await db.card.create({
      data: {
        deckId: validated.deckId,
        question: validated.question,
        answer: validated.answer,
        cardOrder: nextOrder,
      },
    })

    revalidatePath(`/decks/${validated.deckId}`)

    return { success: true, data: card }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" }
    }
    console.error('Error creating card:', error)
    return { success: false, error: 'Failed to create card' }
  }
}

export async function updateCard(id: string, data: UpdateCardInput) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const validated = updateCardSchema.parse(data)

    // Check if card exists and user owns the deck
    const existingCard = await db.card.findUnique({
      where: { id },
      include: {
        deck: {
          select: { userId: true },
        },
      },
    })

    if (!existingCard) {
      return { success: false, error: 'Card not found' }
    }

    if (existingCard.deck.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const card = await db.card.update({
      where: { id },
      data: {
        question: validated.question,
        answer: validated.answer,
      },
    })

    revalidatePath(`/decks/${existingCard.deckId}`)

    return { success: true, data: card }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" }
    }
    console.error('Error updating card:', error)
    return { success: false, error: 'Failed to update card' }
  }
}

export async function deleteCard(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if card exists and user owns the deck
    const card = await db.card.findUnique({
      where: { id },
      include: {
        deck: {
          select: { userId: true },
        },
      },
    })

    if (!card) {
      return { success: false, error: 'Card not found' }
    }

    if (card.deck.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const deckId = card.deckId
    const deletedOrder = card.cardOrder

    // Delete the card
    await db.card.delete({
      where: { id },
    })

    // Update card orders for remaining cards
    await db.card.updateMany({
      where: {
        deckId,
        cardOrder: { gt: deletedOrder },
      },
      data: {
        cardOrder: { decrement: 1 },
      },
    })

    revalidatePath(`/decks/${deckId}`)

    return { success: true }
  } catch (error) {
    console.error('Error deleting card:', error)
    return { success: false, error: 'Failed to delete card' }
  }
}

export async function reorderCards(data: ReorderCardsInput) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const validated = reorderCardsSchema.parse(data)

    // Check if user owns the deck
    const deck = await db.deck.findUnique({
      where: { id: validated.deckId },
      select: { userId: true },
    })

    if (!deck) {
      return { success: false, error: 'Deck not found' }
    }

    if (deck.userId !== session.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Update card orders
    await Promise.all(
      validated.cardIds.map((cardId, index) =>
        db.card.update({
          where: { id: cardId },
          data: { cardOrder: index },
        })
      )
    )

    revalidatePath(`/decks/${validated.deckId}`)

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" }
    }
    console.error('Error reordering cards:', error)
    return { success: false, error: 'Failed to reorder cards' }
  }
}

export async function getCardById(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const card = await db.card.findUnique({
      where: { id },
      include: {
        deck: {
          select: {
            userId: true,
            privacy: true,
          },
        },
      },
    })

    if (!card) {
      return { success: false, error: 'Card not found' }
    }

    // Check if user has access
    const isOwner = card.deck.userId === session.user.id
    const isPublic = card.deck.privacy === 'public'

    if (!isOwner && !isPublic) {
      return { success: false, error: 'Unauthorized' }
    }

    return { success: true, data: card }
  } catch (error) {
    console.error('Error fetching card:', error)
    return { success: false, error: 'Failed to fetch card' }
  }
}

export async function getDeckCards(deckId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user has access to the deck
    const deck = await db.deck.findUnique({
      where: { id: deckId },
      select: { userId: true, privacy: true },
    })

    if (!deck) {
      return { success: false, error: 'Deck not found' }
    }

    const isOwner = deck.userId === session.user.id
    const isPublic = deck.privacy === 'public'

    if (!isOwner && !isPublic) {
      // Check if user has added this deck
      const userDeck = await db.userDeck.findUnique({
        where: {
          userId_deckId: {
            userId: session.user.id,
            deckId,
          },
        },
      })
      if (!userDeck) {
        return { success: false, error: 'Unauthorized' }
      }
    }

    const cards = await db.card.findMany({
      where: { deckId },
      orderBy: { cardOrder: 'asc' },
    })

    return { success: true, data: cards }
  } catch (error) {
    console.error('Error fetching cards:', error)
    return { success: false, error: 'Failed to fetch cards' }
  }
}
