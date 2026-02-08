"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Trash2, Edit, X, Check } from "lucide-react"
import { createComment, updateComment, deleteComment } from "@/actions/comment-actions"
import { formatDistanceToNow } from "date-fns"

interface DeckCommentsProps {
  deckId: string
  initialComments: any[]
  currentUserId: string
  deckOwnerId: string
}

export function DeckComments({ deckId, initialComments, currentUserId, deckOwnerId }: DeckCommentsProps) {
  const router = useRouter()
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    const result = await createComment({
      deckId,
      comment: newComment.trim(),
    })

    if (result.success && result.data) {
      setComments([result.data, ...comments])
      setNewComment("")
      router.refresh()
    } else {
      alert(result.error || "Failed to post comment")
    }
    setIsSubmitting(false)
  }

  const handleEdit = (comment: any) => {
    setEditingId(comment.id)
    setEditText(comment.comment)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditText("")
  }

  const handleSaveEdit = async (id: string) => {
    if (!editText.trim()) return

    setIsSubmitting(true)
    const result = await updateComment(id, { comment: editText.trim() })

    if (result.success) {
      setComments(comments.map((c) =>
        c.id === id ? { ...c, comment: editText.trim() } : c
      ))
      setEditingId(null)
      setEditText("")
      router.refresh()
    } else {
      alert(result.error || "Failed to update comment")
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return

    const result = await deleteComment(id)

    if (result.success) {
      setComments(comments.filter((c) => c.id !== id))
      router.refresh()
    } else {
      alert(result.error || "Failed to delete comment")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* New Comment Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            maxLength={1000}
            className="mb-2"
          />
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {newComment.length}/1000 characters
            </div>
            <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const isOwner = comment.userId === currentUserId
              const isDeckOwner = comment.userId === deckOwnerId
              const canDelete = isOwner || currentUserId === deckOwnerId

              return (
                <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          @{comment.user.username}
                        </span>
                        {isDeckOwner && (
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                            Author
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>

                      {editingId === comment.id ? (
                        <div>
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                            maxLength={1000}
                            className="mb-2"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(comment.id)}
                              disabled={isSubmitting || !editText.trim()}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              disabled={isSubmitting}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700 whitespace-pre-wrap">{comment.comment}</p>
                      )}
                    </div>

                    {editingId !== comment.id && (
                      <div className="flex gap-1">
                        {isOwner && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(comment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(comment.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
