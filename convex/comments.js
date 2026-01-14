import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getCommentsByTicket = query({
  args: {
    ticketId: v.id("tickets"),
    userRole: v.string(),
  },
  handler: async (ctx, { ticketId, userRole }) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_ticket", (q) => q.eq("ticketId", ticketId))
      .collect();

    // Filter out internal comments for regular users
    const filteredComments =
      userRole === "user"
        ? comments.filter((comment) => !comment.isInternal)
        : comments;

    // Get user info for each comment
    const commentsWithUsers = await Promise.all(
      filteredComments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          user,
        };
      }),
    );

    return commentsWithUsers.sort((a, b) => a.createdAt - b.createdAt);
  },
});

export const addComment = mutation({
  args: {
    ticketId: v.id("tickets"),
    userId: v.id("users"),
    content: v.string(),
    isInternal: v.boolean(),
  },
  handler: async (ctx, { ticketId, userId, content, isInternal }) => {
    const commentId = await ctx.db.insert("comments", {
      ticketId,
      userId,
      content,
      isInternal,
      createdAt: Date.now(),
    });

    // Update ticket's updatedAt timestamp
    await ctx.db.patch(ticketId, { updatedAt: Date.now() });

    // Create notifications
    const ticket = await ctx.db.get(ticketId);
    const commentUser = await ctx.db.get(userId);

    if (ticket) {
      // If it's a public comment, notify the ticket owner (if they're not the commenter)
      if (!isInternal && ticket.userId !== userId) {
        await ctx.db.insert("notifications", {
          userId: ticket.userId,
          type: "comment_added",
          title: "New Reply on Your Ticket",
          message: `${commentUser?.name} replied to your ticket: ${ticket.title}`,
          ticketId,
          fromUserId: userId,
          read: false,
          createdAt: Date.now(),
        });
      }

      // If it's an internal note, notify other agents/admins
      if (isInternal) {
        const agents = await ctx.db
          .query("users")
          .filter((q) =>
            q.and(
              q.or(
                q.eq(q.field("role"), "agent"),
                q.eq(q.field("role"), "admin"),
              ),
              q.neq(q.field("_id"), userId),
            ),
          )
          .collect();

        await Promise.all(
          agents.map((agent) =>
            ctx.db.insert("notifications", {
              userId: agent._id,
              type: "internal_note_added",
              title: "Internal Note Added",
              message: `${commentUser?.name} added an internal note to: ${ticket.title}`,
              ticketId,
              fromUserId: userId,
              read: false,
              createdAt: Date.now(),
            }),
          ),
        );
      }
    }

    return commentId;
  },
});

export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
    userId: v.id("users"),
  },
  handler: async (ctx, { commentId, userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const comment = await ctx.db.get(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    const ticket = await ctx.db.get(comment.ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const isOwner = comment.userId === userId;
    const isAdmin = user.role === "admin";
    const isAgentAssigned =
      user.role === "agent" && ticket.assignedTo === userId;

    if (!isOwner && !isAdmin && !isAgentAssigned) {
      throw new Error("You are not authorized to delete this comment");
    }

    await ctx.db.delete(commentId);

    // Refresh ticket to show new updatedAt time ****
    await ctx.db.patch(ticket._id, {
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
