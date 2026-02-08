'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma as db } from '@/lib/db'

// Validation schemas
const recordAnswerSchema = z.object({
  cardId: z.string().uuid('Invalid card ID'),
  correct: z.boolean(),
})

const rateCardSchema = z.object({
  cardId: z.string().uuid('Invalid card ID'),
  rating: z.number().min(1).max(5),
})

const hintSchema = z.object({
  cardId: z.string().uuid('Invalid card ID'),
  hint: z.string().min(1).max(1000),
})

// Types
type RecordAnswerInput = z.infer<typeof recordAnswerSchema>
type RateCardInput = z.infer<typeof rateCardSchema>
type HintInput = z.infer<typeof hintSchema>

export async function recordAnswer(data: RecordAnswerInput) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const validated = recordAnswerSchema.parse(data)

    // Check if user has access to this card
    const card = await db.card.findUnique({
      where: { id: validated.cardId },
      include: {
        deck: {
          select: { userId: true, privacy: true },
        },
      },
    })

    if (!card) {
      return { success: false, error: 'Card not found' }
    }

    const isOwner = card.deck.userId === session.user.id
    const isPublic = card.deck.privacy === 'public'

    if (!isOwner && !isPublic) {
      // Check if user has added this deck
      const userDeck = await db.userDeck.findUnique({
        where: {
          userId_deckId: {
            userId: session.user.id,
            deckId: card.deckId,
          },
        },
      })
      if (!userDeck) {
        return { success: false, error: 'Unauthorized' }
      }
    }

    // Create or update result
    const result = await db.result.upsert({
      where: {
        userId_cardId: {
          userId: session.user.id,
          cardId: validated.cardId,
        },
      },
      update: {
        lastGuess: validated.correct,
        totalCorrect: validated.correct
          ? { increment: 1 }
          : undefined,
        totalIncorrect: !validated.correct
          ? { increment: 1 }
          : undefined,
      },
      create: {
        userId: session.user.id,
        cardId: validated.cardId,
        lastGuess: validated.correct,
        totalCorrect: validated.correct ? 1 : 0,
        totalIncorrect: !validated.correct ? 1 : 0,
      },
    })

    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" }
    }
    console.error('Error recording answer:', error)
    return { success: false, error: 'Failed to record answer' }
  }
}

export async function rateCard(data: RateCardInput) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const validated = rateCardSchema.parse(data)

    // Check if user has access to this card
    const card = await db.card.findUnique({
      where: { id: validated.cardId },
      include: {
        deck: {
          select: { userId: true, privacy: true },
        },
      },
    })

    if (!card) {
      return { success: false, error: 'Card not found' }
    }

    const isOwner = card.deck.userId === session.user.id
    const isPublic = card.deck.privacy === 'public'

    if (!isOwner && !isPublic) {
      const userDeck = await db.userDeck.findUnique({
        where: {
          userId_deckId: {
            userId: session.user.id,
            deckId: card.deckId,
          },
        },
      })
      if (!userDeck) {
        return { success: false, error: 'Unauthorized' }
      }
    }

    // Create or update rating
    const rating = await db.rating.upsert({
      where: {
        userId_cardId: {
          userId: session.user.id,
          cardId: validated.cardId,
        },
      },
      update: {
        rating: validated.rating,
      },
      create: {
        userId: session.user.id,
        cardId: validated.cardId,
        rating: validated.rating,
      },
    })

    return { success: true, data: rating }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" }
    }
    console.error('Error rating card:', error)
    return { success: false, error: 'Failed to rate card' }
  }
}

export async function addOrUpdateHint(data: HintInput) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const validated = hintSchema.parse(data)

    // Check if user has access to this card
    const card = await db.card.findUnique({
      where: { id: validated.cardId },
      include: {
        deck: {
          select: { userId: true, privacy: true },
        },
      },
    })

    if (!card) {
      return { success: false, error: 'Card not found' }
    }

    const isOwner = card.deck.userId === session.user.id
    const isPublic = card.deck.privacy === 'public'

    if (!isOwner && !isPublic) {
      const userDeck = await db.userDeck.findUnique({
        where: {
          userId_deckId: {
            userId: session.user.id,
            deckId: card.deckId,
          },
        },
      })
      if (!userDeck) {
        return { success: false, error: 'Unauthorized' }
      }
    }

    // Create or update hint
    const hint = await db.hint.upsert({
      where: {
        userId_cardId: {
          userId: session.user.id,
          cardId: validated.cardId,
        },
      },
      update: {
        hint: validated.hint,
      },
      create: {
        userId: session.user.id,
        cardId: validated.cardId,
        hint: validated.hint,
      },
    })

    return { success: true, data: hint }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" }
    }
    console.error('Error saving hint:', error)
    return { success: false, error: 'Failed to save hint' }
  }
}

export async function getStudySession(deckId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get deck with cards
    const deck = await db.deck.findUnique({
      where: { id: deckId },
      include: {
        cards: {
          orderBy: { cardOrder: 'asc' },
          include: {
            results: {
              where: { userId: session.user.id },
            },
            ratings: {
              where: { userId: session.user.id },
            },
            hints: {
              where: { userId: session.user.id },
            },
          },
        },
        user: {
          select: { username: true },
        },
      },
    })

    if (!deck) {
      return { success: false, error: 'Deck not found' }
    }

    // Check if user has access to this deck
    const isOwner = deck.userId === session.user.id
    const isPublic = deck.privacy === 'public'

    if (!isOwner && !isPublic) {
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

    if (deck.cards.length === 0) {
      return { success: false, error: 'This deck has no cards to study' }
    }

    return { success: true, data: deck }
  } catch (error) {
    console.error('Error getting study session:', error)
    return { success: false, error: 'Failed to load study session' }
  }
}

export async function getUserCardData(cardId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const [result, rating, hint] = await Promise.all([
      db.result.findUnique({
        where: {
          userId_cardId: {
            userId: session.user.id,
            cardId,
          },
        },
      }),
      db.rating.findUnique({
        where: {
          userId_cardId: {
            userId: session.user.id,
            cardId,
          },
        },
      }),
      db.hint.findUnique({
        where: {
          userId_cardId: {
            userId: session.user.id,
            cardId,
          },
        },
      }),
    ])

    return {
      success: true,
      data: {
        result,
        rating,
        hint,
      },
    }
  } catch (error) {
    console.error('Error getting user card data:', error)
    return { success: false, error: 'Failed to load card data' }
  }
}
