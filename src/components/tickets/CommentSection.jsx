import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { Badge } from "../ui/Badge";
import { MessageCircle, Send, Lock, User, Clock } from "lucide-react";
import { format } from "date-fns";

export const CommentSection = ({ ticketId, currentUser }) => {
  const [comment, setComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get comments for this ticket
  const comments = useQuery(api.comments.getCommentsByTicket, {
    ticketId,
    userRole: currentUser.role,
  });

  const addComment = useMutation(api.comments.addComment);

  const canAddInternalComments = ["agent", "admin"].includes(currentUser.role);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await addComment({
        ticketId,
        userId: currentUser._id,
        content: comment.trim(),
        isInternal: isInternal,
      });

      setComment("");
      setIsInternal(false);
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <MessageCircle className="text-surface-600 size-5" />
          <h3 className="text-surface-900 font-semibold">Comments</h3>
          {comments && (
            <Badge variant="secondary" size="sm">
              {comments.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Comments List */}
          {!comments ? (
            <div className="flex justify-center py-4">
              <div className="border-primary-600 size-6 animate-spin rounded-full border-b-2"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="py-8 text-center">
              <MessageCircle className="text-surface-400 mx-auto mb-3 size-12" />
              <p className="text-surface-500">No comments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className={`rounded-lg border p-4 ${
                    comment.isInternal
                      ? "bg-warning-50 border-warning-200"
                      : "bg-surface-50 border-surface-200"
                  }`}
                >
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center space-x-1">
                        <User className="text-surface-500 size-4" />
                        <span className="text-surface-900 font-medium">
                          {comment.user?.name}
                        </span>
                      </div>
                      {comment.user?.role && (
                        <Badge
                          variant={
                            comment.user.role === "admin"
                              ? "primary"
                              : "secondary"
                          }
                          size="sm"
                        >
                          {comment.user.role}
                        </Badge>
                      )}
                      {comment.isInternal && (
                        <Badge
                          variant="warning"
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <Lock className="size-3" />
                          <span>Internal</span>
                        </Badge>
                      )}
                    </div>
                    <div className="text-surface-500 flex items-center space-x-1 text-sm">
                      <Clock className="size-3" />
                      <span>{format(new Date(comment.createdAt), "PPp")}</span>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-surface-700 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Form */}
          <div className="border-surface-200 border-t pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {canAddInternalComments && (
                    <label className="flex cursor-pointer items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                        className="text-primary-600 border-surface-300 focus:ring-primary-500 size-4 rounded focus:ring-2"
                      />
                      <div className="flex items-center space-x-1">
                        <Lock className="text-surface-500 size-4" />
                        <span className="text-surface-700 text-sm">
                          Internal comment
                        </span>
                      </div>
                    </label>
                  )}
                  {isInternal && (
                    <p className="text-warning-600 text-xs">
                      Only visible to agents and admins
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={!comment.trim() || isSubmitting}
                  loading={isSubmitting}
                  className="flex items-center space-x-2"
                >
                  <Send className="size-4" />
                  <span>Reply</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
