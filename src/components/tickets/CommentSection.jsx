import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { Clock, Lock, MessageCircle, Send, Trash2, User } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader } from "../ui/Card";
import TipTapEditor from "../ui/TipTapEditor";
// import { Textarea } from "../ui/Textarea";

export const CommentSection = ({ ticketId, currentUser }) => {
  const [comment, setComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editorRef = useRef(null);

  // Get comments for this ticket
  const comments = useQuery(api.comments.getCommentsByTicket, {
    ticketId,
    userRole: currentUser.role,
  });

  const addComment = useMutation(api.comments.addComment);
  const deleteComment = useMutation(api.comments.deleteComment);

  const canAddInternalComments = ["agent", "admin"].includes(currentUser.role);

  const handleAddComment = (value) => {
    setComment(value);
  };

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
      toast.success("Comment added");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Error adding comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment({ commentId, userId: currentUser._id });
    toast.success("Comment deleted");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <MessageCircle className="size-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Comments</h3>
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
              <MessageCircle className="mx-auto mb-3 size-12 text-gray-400" />
              <p className="text-gray-500">No comments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className={`group rounded-lg border p-4 ${
                    comment.isInternal
                      ? "border-red-200 bg-red-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center space-x-1">
                        <User className="size-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
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

                      {currentUser.role === "admin" && (
                        <Button
                          size="sm"
                          variant="danger"
                          className="opacity-0 group-hover:opacity-100"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="size-3" />
                      <span>{format(new Date(comment.createdAt), "PPp")}</span>
                    </div>
                  </div>
                  <div
                    className="prose max-w-none p-6"
                    dangerouslySetInnerHTML={{
                      __html:
                        comment.content ||
                        '<p class="text-gray-500">No comment</p>',
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Form */}
          <div className="border-t border-gray-200 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
              /> */}

              <div>
                <p className="mb-2 text-lg font-bold text-gray-800">
                  Add a comment
                </p>
                <TipTapEditor
                  ref={editorRef}
                  content={comment}
                  onChange={handleAddComment}
                  placeholder="Add a comment..."
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {canAddInternalComments && (
                    <label className="flex cursor-pointer items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                        className="text-primary-600 focus:ring-primary-500 size-4 rounded border-gray-300 focus:ring-2"
                      />
                      <div className="flex items-center space-x-1">
                        <Lock className="size-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          Internal comment
                        </span>
                      </div>
                    </label>
                  )}
                  {isInternal && (
                    <p className="text-xs text-red-600">
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
