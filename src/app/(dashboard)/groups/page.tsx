import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUserGroups } from "@/actions/group-actions"
import { GroupCard } from "@/components/groups/group-card"
import { CreateGroupDialog } from "@/components/groups/create-group-dialog"
import { Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function GroupsPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const result = await getUserGroups()
  const groups = result.success ? result.data || [] : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">My Groups</h1>
            </div>
            <p className="text-gray-600">
              Collaborate and share decks with study groups
            </p>
          </div>
          <CreateGroupDialog>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Group
            </Button>
          </CreateGroupDialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {groups.length}
            </div>
            <div className="text-sm text-gray-600">Groups Joined</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {groups.filter((g) => g.userRole === 'admin' || g.ownerId === session.user?.id).length}
            </div>
            <div className="text-sm text-gray-600">Groups You Manage</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {groups.reduce((sum, g) => sum + (g._count?.members || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
        </div>

        {/* Groups List */}
        {result.error ? (
          <div className="text-center py-12 text-red-600">
            {result.error}
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No groups yet
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first group to start collaborating
            </p>
            <CreateGroupDialog>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create your first group
              </Button>
            </CreateGroupDialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} currentUserId={session.user?.id || ''} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
