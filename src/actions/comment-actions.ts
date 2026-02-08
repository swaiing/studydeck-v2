'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma as db } from '@/lib/db'

// Validation schemas
const createCommentSchema = z.object({
  deckId: z.string().uuid('Invalid deck ID'),
  comment: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
})

const updateCommentSchema = z.object({
  comment: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
})

// Types
type CreateCommentInput = z.infer<typeof createCommentSchema>
type UpdateCommentInput = z.infer<typeof updateCommentSchema>

export async function createComment(data: CreateCommentInput) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const validated = createCommentSchema.parse(data)

    // Check if deck exists and user has access
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
      // Check if user has added this deck
      const userDeck = await db.userDeck.findUnique({
        where: {
          userId_deckId: {
            userId: session.user.id,
            deckId: validated.deckId,
          },
        },
      })
      if (!userDeck) {
        return { success: false, error: 'You cannot comment on this deck' }
      }
    }

    // Create comment
    const comment = await db.comment.create({
      data: {
        deckId: validated.deckId,
        userId: session.user.id,
        comment: validated.comment,
      },
      include: {
        user: {
          select: {
            username: true,
            id: true,
          },
        },
      },
    })

    revalidatePath(`/decks/${validated.deckId}`)

    return { success: true, data: comment }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" }
    }
    console.error('Error creating comment:', error)
    return { success: false, error: 'Failed to create comment' }
  }
}

export async function updateComment(id: string, data: UpdateCommentInput) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const validated = updateCommentSchema.parse(data)

    // Check if comment exists and user owns it
    const existingComment = await db.comment.findUnique({
      where: { id },
      select: { userId: true, deckId: true },
    })

    if (!existingComment) {
      return { success: false, error: 'Comment not found' }
    }

    if (existingComment.userId !== session.user.id) {
      return { success: false, error: 'You can only edit your own comments' }
    }

    // Update comment
    const comment = await db.comment.update({
      where: { id },
      data: {
        comment: validated.comment,
      },
      include: {
        user: {
          select: {
            username: true,
            id: true,
          },
        },
      },
    })

    revalidatePath(`/decks/${existingComment.deckId}`)

    return { success: true, data: comment }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" }
    }
    console.error('Error updating comment:', error)
    return { success: false, error: 'Failed to update comment' }
  }
}

export async function deleteComment(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if comment exists and user owns it or owns the deck
    const comment = await db.comment.findUnique({
      where: { id },
      include: {
        deck: {
          select: { userId: true },
        },
      },
    })

    if (!comment) {
      return { success: false, error: 'Comment not found' }
    }

    const isCommentOwner = comment.userId === session.user.id
    const isDeckOwner = comment.deck.userId === session.user.id

    if (!isCommentOwner && !isDeckOwner) {
      return { success: false, error: 'You can only delete your own comments or comments on your decks' }
    }

    const deckId = comment.deckId

    // Delete comment
    await db.comment.delete({
      where: { id },
    })

    revalidatePath(`/decks/${deckId}`)

    return { success: true }
  } catch (error) {
    console.error('Error deleting comment:', error)
    return { success: false, error: 'Failed to delete comment' }
  }
}

export async function getDeckComments(deckId: string) {
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
      const userDeck = await db.userDeck.findUnique({
        where: {
          userId_deckId: {
            userId: session.user.id,
            deckId,
          },
        },
      })
      if (!userDeck) {
        return { success: false, error: 'You do not have access to this deck' }
      }
    }

    // Fetch comments
    const comments = await db.comment.findMany({
      where: { deckId },
      include: {
        user: {
          select: {
            username: true,
            id: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, data: comments }
  } catch (error) {
    console.error('Error fetching comments:', error)
    return { success: false, error: 'Failed to fetch comments' }
  }
}
