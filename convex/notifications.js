import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getNotifications = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);

    // Get related data for each notification
    const notificationsWithData = await Promise.all(
      notifications.map(async (notification) => {
        let relatedData = {};

        if (notification.ticketId) {
          const ticket = await ctx.db.get(notification.ticketId);
          relatedData.ticket = ticket;
        }

        if (notification.fromUserId) {
          const fromUser = await ctx.db.get(notification.fromUserId);
          relatedData.fromUser = fromUser;
        }

        return {
          ...notification,
          ...relatedData,
        };
      })
    );

    return notificationsWithData;
  },
});

export const getUnreadCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const count = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("read"), false))
      .collect();

    return count.length;
  },
});

export const createNotification = mutation({
  args: {
    userId: v.id("users"),
    type: v.union(
      v.literal("ticket_created"),
      v.literal("ticket_assigned"),
      v.literal("ticket_status_changed"),
      v.literal("comment_added"),
      v.literal("internal_note_added")
    ),
    title: v.string(),
    message: v.string(),
    ticketId: v.optional(v.id("tickets")),
    fromUserId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      ...args,
      read: false,
      createdAt: Date.now(),
    });
    return notificationId;
  },
});

export const markAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, { notificationId }) => {
    await ctx.db.patch(notificationId, { read: true });
  },
});

export const markAllAsRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("read"), false))
      .collect();

    await Promise.all(
      notifications.map((notification) =>
        ctx.db.patch(notification._id, { read: true })
      )
    );
  },
});

export const deleteNotification = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, { notificationId }) => {
    await ctx.db.delete(notificationId);
  },
});
