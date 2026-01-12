import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { Badge } from "../ui/Badge";
import { MessageCircle, Send, Lock, User, Clock } from "lucide-react";

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
          <MessageCircle className="w-5 h-5 text-surface-600" />
          <h3 className="font-semibold text-surface-900">Comments</h3>
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
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-surface-400 mx-auto mb-3" />
              <p className="text-surface-500">No comments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className={`p-4 rounded-lg border ${
                    comment.isInternal
                      ? "bg-warning-50 border-warning-200"
                      : "bg-surface-50 border-surface-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <User className="size-4 text-surface-500" />
                        <span className="font-medium text-surface-900">
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
                          <Lock className="w-3 h-3" />
                          <span>Internal</span>
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-surface-500">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
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
          <div className="border-t border-surface-200 pt-6">
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
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                        className="size-4 text-primary-600 border-surface-300 rounded focus:ring-primary-500 focus:ring-2"
                      />
                      <div className="flex items-center space-x-1">
                        <Lock className="size-4 text-surface-500" />
                        <span className="text-sm text-surface-700">
                          Internal comment
                        </span>
                      </div>
                    </label>
                  )}
                  {isInternal && (
                    <p className="text-xs text-warning-600">
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
