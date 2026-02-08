import { Badge } from "@/components/ui/badge"
import { Users, FolderOpen, Crown, Shield } from "lucide-react"

interface GroupHeaderProps {
  group: any
  isOwner: boolean
  isAdmin: boolean
}

export function GroupHeader({ group, isOwner, isAdmin }: GroupHeaderProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            {isOwner && <Crown className="h-6 w-6 text-yellow-600" />}
            {!isOwner && isAdmin && <Shield className="h-6 w-6 text-purple-600" />}
            <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
            <Badge variant={isOwner ? "default" : isAdmin ? "secondary" : "outline"}>
              {isOwner ? "Owner" : isAdmin ? "Admin" : "Member"}
            </Badge>
          </div>
          {group.description && (
            <p className="text-gray-600 mb-4">{group.description}</p>
          )}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-medium">{group.members?.length || 0}</span>
              <span>members</span>
            </div>
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              <span className="font-medium">{group.decks?.length || 0}</span>
              <span>shared decks</span>
            </div>
          </div>
          {group.owner && (
            <div className="text-sm text-gray-600 mt-3">
              Created by <span className="font-medium text-gray-900">@{group.owner.username}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
