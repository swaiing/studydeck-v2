'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma as db } from '@/lib/db'

// Validation schemas
const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100, 'Group name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
})

const updateGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100, 'Group name is too long').optional(),
  description: z.string().max(500, 'Description is too long').optional(),
})

const addMemberSchema = z.object({
  groupId: z.string().uuid('Invalid group ID'),
  username: z.string().min(1, 'Username is required'),
})

const updateMemberRoleSchema = z.object({
  memberId: z.string().uuid('Invalid member ID'),
  role: z.enum(['member', 'moderator', 'admin']),
})

const shareDeckSchema = z.object({
  groupId: z.string().uuid('Invalid group ID'),
  deckId: z.string().uuid('Invalid deck ID'),
})

// Types
type CreateGroupInput = z.infer<typeof createGroupSchema>
type UpdateGroupInput = z.infer<typeof updateGroupSchema>
type AddMemberInput = z.infer<typeof addMemberSchema>
type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>
type ShareDeckInput = z.infer<typeof shareDeckSchema>

export async function createGroup(data: CreateGroupInput) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const validated = createGroupSchema.parse(data)

    // Create group
    const group = await db.group.create({
      data: {
        name: validated.name,
        description: validated.description,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: 'admin',
          },
        },
      },
      include: {
        owner: {
          select: {
            username: true,
            id: true,
          },
        },
        _count: {
          select: {
            members: true,
            decks: true,
          },
        },
      },
    })

    revalidatePath('/groups')

    return { success: true, data: group }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" }
    }
    console.error('Error creating group:', error)
    return { success: false, error: 'Failed to create group' }
  }
}

export async function updateGroup(id: string, data: UpdateGroupInput) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const validated = updateGroupSchema.parse(data)

    // Check if user is the owner
    const group = await db.group.findUnique({
      where: { id },
      select: { ownerId: true },
    })

    if (!group) {
      return { success: false, error: 'Group not found' }
    }

    if (group.ownerId !== session.user.id) {
      return { success: false, error: 'Only the group owner can update group details' }
    }

    // Update group
    const updatedGroup = await db.group.update({
      where: { id },
      data: {
        name: validated.name,
        description: validated.description,
      },
    })

    revalidatePath('/groups')
    revalidatePath(`/groups/${id}`)

    return { success: true, data: updatedGroup }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" }
    }
    console.error('Error updating group:', error)
    return { success: false, error: 'Failed to update group' }
  }
}

export async function deleteGroup(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is the owner
    const group = await db.group.findUnique({
      where: { id },
      select: { ownerId: true },
    })

    if (!group) {
      return { success: false, error: 'Group not found' }
    }

    if (group.ownerId !== session.user.id) {
      return { success: false, error: 'Only the group owner can delete the group' }
    }

    // Delete group (cascade will handle members and decks)
    await db.group.delete({
      where: { id },
    })

    revalidatePath('/groups')

    return { success: true }
  } catch (error) {
    console.error('Error deleting group:', error)
    return { success: false, error: 'Failed to delete group' }
  }
}

export async function getUserGroups() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get groups where user is a member
    const memberGroups = await db.groupMember.findMany({
      where: { userId: session.user.id },
      include: {
        group: {
          include: {
            owner: {
              select: {
                username: true,
                id: true,
              },
            },
            _count: {
              select: {
                members: true,
                decks: true,
              },
            },
          },
        },
      },
      orderBy: {
        group: {
          createdAt: 'desc',
        },
      },
    })

    return {
      success: true,
      data: memberGroups.map((mg) => ({
        ...mg.group,
        userRole: mg.role,
      })),
    }
  } catch (error) {
    console.error('Error fetching user groups:', error)
    return { success: false, error: 'Failed to fetch groups' }
  }
}

export async function getGroupById(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if user is a member
    const membership = await db.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: id,
          userId: session.user.id,
        },
      },
    })

    if (!membership) {
      return { success: false, error: 'You are not a member of this group' }
    }

    // Fetch group details
    const group = await db.group.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            username: true,
            id: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                username: true,
                id: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        decks: {
          include: {
            deck: {
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
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!group) {
      return { success: false, error: 'Group not found' }
    }

    return {
      success: true,
      data: {
        ...group,
        userRole: membership.role,
      },
    }
  } catch (error) {
    console.error('Error fetching group:', error)
    return { success: false, error: 'Failed to fetch group' }
  }
}

export async function addMemberToGroup(data: AddMemberInput) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const validated = addMemberSchema.parse(data)

    // Check if user has permission (owner or admin)
    const membership = await db.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: validated.groupId,
          userId: session.user.id,
        },
      },
      include: {
        group: {
          select: { ownerId: true },
        },
      },
    })

    if (!membership) {
      return { success: false, error: 'You are not a member of this group' }
    }

    const isOwner = membership.group.ownerId === session.user.id
    const isAdmin = membership.role === 'admin'

    if (!isOwner && !isAdmin) {
      return { success: false, error: 'Only group owners and admins can add members' }
    }

    // Find user by username
    const userToAdd = await db.user.findUnique({
      where: { username: validated.username },
    })

    if (!userToAdd) {
      return { success: false, error: 'User not found' }
    }

    // Check if user is already a member
    const existingMember = await db.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: validated.groupId,
          userId: userToAdd.id,
        },
      },
    })

    if (existingMember) {
      return { success: false, error: 'User is already a member of this group' }
    }

    // Add member
    const newMember = await db.groupMember.create({
      data: {
        groupId: validated.groupId,
        userId: userToAdd.id,
        role: 'member',
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

    revalidatePath(`/groups/${validated.groupId}`)

    return { success: true, data: newMember }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" }
    }
    console.error('Error adding member:', error)
    return { success: false, error: 'Failed to add member' }
  }
}

export async function removeMemberFromGroup(groupId: string, memberId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check permissions
    const membership = await db.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: session.user.id,
        },
      },
      include: {
        group: {
          select: { ownerId: true },
        },
      },
    })

    if (!membership) {
      return { success: false, error: 'You are not a member of this group' }
    }

    const isOwner = membership.group.ownerId === session.user.id
    const isSelfRemoval = memberId === session.user.id

    // Members can remove themselves, owners/admins can remove others
    if (!isSelfRemoval && !isOwner && membership.role !== 'admin') {
      return { success: false, error: 'You do not have permission to remove members' }
    }

    // Can't remove the owner
    if (memberId === membership.group.ownerId) {
      return { success: false, error: 'Cannot remove the group owner' }
    }

    // Remove member
    await db.groupMember.delete({
      where: {
        groupId_userId: {
          groupId,
          userId: memberId,
        },
      },
    })

    revalidatePath(`/groups/${groupId}`)
    if (isSelfRemoval) {
      revalidatePath('/groups')
    }

    return { success: true }
  } catch (error) {
    console.error('Error removing member:', error)
    return { success: false, error: 'Failed to remove member' }
  }
}

export async function shareDeckWithGroup(data: ShareDeckInput) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const validated = shareDeckSchema.parse(data)

    // Check if user is a member of the group
    const membership = await db.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: validated.groupId,
          userId: session.user.id,
        },
      },
    })

    if (!membership) {
      return { success: false, error: 'You are not a member of this group' }
    }

    // Check if user owns the deck
    const deck = await db.deck.findUnique({
      where: { id: validated.deckId },
      select: { userId: true },
    })

    if (!deck) {
      return { success: false, error: 'Deck not found' }
    }

    if (deck.userId !== session.user.id) {
      return { success: false, error: 'You can only share your own decks' }
    }

    // Check if deck is already shared
    const existing = await db.groupDeck.findUnique({
      where: {
        groupId_deckId: {
          groupId: validated.groupId,
          deckId: validated.deckId,
        },
      },
    })

    if (existing) {
      return { success: false, error: 'Deck is already shared with this group' }
    }

    // Share deck
    await db.groupDeck.create({
      data: {
        groupId: validated.groupId,
        deckId: validated.deckId,
        addedBy: session.user.id,
      },
    })

    revalidatePath(`/groups/${validated.groupId}`)

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Validation error" }
    }
    console.error('Error sharing deck:', error)
    return { success: false, error: 'Failed to share deck' }
  }
}

export async function unshareDeckFromGroup(groupId: string, deckId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check permissions - must be deck owner or group owner/admin
    const [groupDeck, membership] = await Promise.all([
      db.groupDeck.findUnique({
        where: {
          groupId_deckId: {
            groupId,
            deckId,
          },
        },
        include: {
          deck: {
            select: { userId: true },
          },
        },
      }),
      db.groupMember.findUnique({
        where: {
          groupId_userId: {
            groupId,
            userId: session.user.id,
          },
        },
        include: {
          group: {
            select: { ownerId: true },
          },
        },
      }),
    ])

    if (!groupDeck) {
      return { success: false, error: 'Deck is not shared with this group' }
    }

    if (!membership) {
      return { success: false, error: 'You are not a member of this group' }
    }

    const isDeckOwner = groupDeck.deck.userId === session.user.id
    const isGroupOwner = membership.group.ownerId === session.user.id
    const isAdmin = membership.role === 'admin'

    if (!isDeckOwner && !isGroupOwner && !isAdmin) {
      return { success: false, error: 'You do not have permission to unshare this deck' }
    }

    // Unshare deck
    await db.groupDeck.delete({
      where: {
        groupId_deckId: {
          groupId,
          deckId,
        },
      },
    })

    revalidatePath(`/groups/${groupId}`)

    return { success: true }
  } catch (error) {
    console.error('Error unsharing deck:', error)
    return { success: false, error: 'Failed to unshare deck' }
  }
}
