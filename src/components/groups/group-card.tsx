import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FolderOpen, Crown } from "lucide-react"

interface GroupCardProps {
  group: any
  currentUserId: string
}

export function GroupCard({ group, currentUserId }: GroupCardProps) {
  const isOwner = group.ownerId === currentUserId
  const roleLabel = isOwner ? 'Owner' : group.userRole || 'Member'
  const roleColor = isOwner ? 'bg-yellow-100 text-yellow-800' :
                    group.userRole === 'admin' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'

  return (
    <Link href={`/groups/${group.id}`}>
      <Card className="hover:shadow-lg transition-shadow h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
              {isOwner && <Crown className="h-4 w-4 text-yellow-600 shrink-0" />}
              {group.name}
            </CardTitle>
            <Badge className={roleColor}>
              {roleLabel}
            </Badge>
          </div>
          {group.description && (
            <CardDescription className="line-clamp-2">{group.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span className="font-medium">{group._count?.members || 0}</span>
              <span>members</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FolderOpen className="h-4 w-4" />
              <span className="font-medium">{group._count?.decks || 0}</span>
              <span>decks</span>
            </div>
          </div>
          {group.owner && (
            <div className="text-xs text-gray-500 mt-3">
              Owner: <span className="font-medium text-gray-700">@{group.owner.username}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
