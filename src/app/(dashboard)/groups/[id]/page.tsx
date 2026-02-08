import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getGroupById } from "@/actions/group-actions"
import { GroupHeader } from "@/components/groups/group-header"
import { GroupSettings } from "@/components/groups/group-settings"
import { MembersList } from "@/components/groups/members-list"
import { GroupDecks } from "@/components/groups/group-decks"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const { id } = await params
  const result = await getGroupById(id)

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Group not found</h1>
            <p className="text-gray-600 mb-6">
              {result.error || "The group you're looking for doesn't exist or you're not a member."}
            </p>
            <Link
              href="/groups"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Groups
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const group = result.data
  const isOwner = group.ownerId === session.user?.id
  const isAdmin = group.userRole === 'admin' || isOwner

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link
          href="/groups"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Groups
        </Link>

        {/* Group Header */}
        <GroupHeader group={group} isOwner={isOwner} isAdmin={isAdmin} />

        {/* Group Settings (for owners) */}
        {isOwner && (
          <div className="mt-6">
            <GroupSettings group={group} />
          </div>
        )}

        {/* Members List */}
        <div className="mt-8">
          <MembersList
            groupId={group.id}
            members={group.members}
            isAdmin={isAdmin}
            currentUserId={session.user?.id || ''}
            ownerId={group.ownerId}
          />
        </div>

        {/* Shared Decks */}
        <div className="mt-8">
          <GroupDecks
            groupId={group.id}
            decks={group.decks}
            currentUserId={session.user?.id || ''}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  )
}
