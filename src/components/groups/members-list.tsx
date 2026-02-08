"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addMemberToGroup, removeMemberFromGroup } from "@/actions/group-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, Trash2, Crown, Shield } from "lucide-react"

interface MembersListProps {
  groupId: string
  members: any[]
  isAdmin: boolean
  currentUserId: string
  ownerId: string
}

export function MembersList({ groupId, members, isAdmin, currentUserId, ownerId }: MembersListProps) {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsAdding(true)
    setError(null)

    const result = await addMemberToGroup({
      groupId,
      username: username.trim(),
    })

    if (result.success) {
      setUsername("")
      router.refresh()
    } else {
      setError(result.error || "Failed to add member")
    }

    setIsAdding(false)
  }

  const handleRemoveMember = async (memberId: string) => {
    const member = members.find((m) => m.userId === memberId)
    const isSelf = memberId === currentUserId

    if (!confirm(`Are you sure you want to ${isSelf ? 'leave' : `remove @${member?.user?.username} from`} this group?`)) {
      return
    }

    const result = await removeMemberFromGroup(groupId, memberId)

    if (result.success) {
      if (isSelf) {
        router.push('/groups')
      } else {
        router.refresh()
      }
    } else {
      alert(result.error || "Failed to remove member")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Members ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add Member Form (for admins) */}
        {isAdmin && (
          <form onSubmit={handleAddMember} className="mb-6">
            <div className="flex gap-2">
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username to invite..."
                disabled={isAdding}
              />
              <Button type="submit" disabled={isAdding} className="gap-2">
                <UserPlus className="h-4 w-4" />
                {isAdding ? "Adding..." : "Add"}
              </Button>
            </div>
            {error && (
              <div className="mt-2 text-sm text-red-600">{error}</div>
            )}
          </form>
        )}

        {/* Members List */}
        <div className="space-y-3">
          {members.map((member) => {
            const isOwner = member.userId === ownerId
            const isSelf = member.userId === currentUserId
            const canRemove = isAdmin && !isOwner && (isSelf || member.userId !== currentUserId)

            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {isOwner ? (
                      <Crown className="h-4 w-4 text-yellow-600" />
                    ) : member.role === 'admin' ? (
                      <Shield className="h-4 w-4 text-purple-600" />
                    ) : (
                      <Users className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="font-medium text-gray-900">
                      @{member.user.username}
                    </span>
                    {isSelf && (
                      <span className="text-xs text-gray-500">(you)</span>
                    )}
                  </div>
                  <Badge variant={isOwner ? "default" : member.role === 'admin' ? "secondary" : "outline"}>
                    {isOwner ? "Owner" : member.role}
                  </Badge>
                </div>

                {canRemove && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.userId)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
