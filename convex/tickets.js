import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getTickets = query({
  args: {
    userId: v.optional(v.id("users")),
    userRole: v.string(),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),
  },
  handler: async (ctx, { userId, userRole, status, priority, assignedTo }) => {
    let query = ctx.db.query("tickets");

    // Apply role-based filtering
    if (userRole === "user") {
      query = query.withIndex("by_user", (q) => q.eq("userId", userId));
    }

    let tickets = await query.collect();

    // Apply additional filters
    if (status) {
      tickets = tickets.filter((ticket) => ticket.status === status);
    }
    if (priority) {
      tickets = tickets.filter((ticket) => ticket.priority === priority);
    }
    if (assignedTo) {
      tickets = tickets.filter((ticket) => ticket.assignedTo === assignedTo);
    }

    // Get user info for each ticket
    const ticketsWithUsers = await Promise.all(
      tickets.map(async (ticket) => {
        const user = await ctx.db.get(ticket.userId);
        const assignedUser = ticket.assignedTo
          ? await ctx.db.get(ticket.assignedTo)
          : null;
        return {
          ...ticket,
          user,
          assignedUser,
        };
      })
    );

    return ticketsWithUsers.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const getTicketById = query({
  args: { ticketId: v.id("tickets") },
  handler: async (ctx, { ticketId }) => {
    const ticket = await ctx.db.get(ticketId);
    if (!ticket) return null;

    const user = await ctx.db.get(ticket.userId);
    const assignedUser = ticket.assignedTo
      ? await ctx.db.get(ticket.assignedTo)
      : null;

    return {
      ...ticket,
      user,
      assignedUser,
    };
  },
});

export const createTicket = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    userId: v.id("users"),
  },
  handler: async (ctx, { title, description, priority, userId }) => {
    const ticketId = await ctx.db.insert("tickets", {
      title,
      description,
      priority,
      status: "open",
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create notifications for agents and admins
    const agents = await ctx.db
      .query("users")
      .filter((q) =>
        q.or(q.eq(q.field("role"), "agent"), q.eq(q.field("role"), "admin"))
      )
      .collect();

    const user = await ctx.db.get(userId);

    await Promise.all(
      agents.map((agent) =>
        ctx.db.insert("notifications", {
          userId: agent._id,
          type: "ticket_created",
          title: "New Ticket Created",
          message: `${user?.name} created a new ${priority} priority ticket: ${title}`,
          ticketId,
          fromUserId: userId,
          read: false,
          createdAt: Date.now(),
        })
      )
    );

    return ticketId;
  },
});

export const updateTicket = mutation({
  args: {
    ticketId: v.id("tickets"),
    status: v.optional(
      v.union(
        v.literal("open"),
        v.literal("pending"),
        v.literal("resolved"),
        v.literal("closed")
      )
    ),
    assignedTo: v.optional(v.id("users")),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("urgent")
      )
    ),
    description: v.optional(v.string()),
    title: v.optional(v.string()),
    updatedBy: v.id("users"),
  },
  handler: async (
    ctx,
    { ticketId, status, assignedTo, priority, updatedBy, title, description }
  ) => {
    const ticket = await ctx.db.get(ticketId);
    if (!ticket) throw new Error("Ticket not found");

    const updates = { updatedAt: Date.now() };
    // const updatedByUser = await ctx.db.get(updatedBy);

    if (status !== undefined) updates.status = status;
    if (assignedTo !== undefined) updates.assignedTo = assignedTo;
    if (priority !== undefined) updates.priority = priority;
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;

    await ctx.db.patch(ticketId, updates);

    // Create notifications
    // const ticketOwner = await ctx.db.get(ticket.userId);

    // Notify ticket owner of status changes
    if (status && status !== ticket.status) {
      await ctx.db.insert("notifications", {
        userId: ticket.userId,
        type: "ticket_status_changed",
        title: "Ticket Status Updated",
        message: `Your ticket "${ticket.title}" status changed to ${status}`,
        ticketId,
        fromUserId: updatedBy,
        read: false,
        createdAt: Date.now(),
      });
    }

    // Notify assigned agent
    if (assignedTo && assignedTo !== ticket.assignedTo) {
      await ctx.db.insert("notifications", {
        userId: assignedTo,
        type: "ticket_assigned",
        title: "Ticket Assigned",
        message: `You have been assigned to ticket: ${ticket.title}`,
        ticketId,
        fromUserId: updatedBy,
        read: false,
        createdAt: Date.now(),
      });
    }
  },
});

export const searchTickets = query({
  args: {
    searchTerm: v.string(),
    userRole: v.string(),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, { searchTerm, userRole, userId }) => {
    if (!searchTerm.trim()) return [];

    const searchResults = await ctx.db
      .query("tickets")
      .withSearchIndex("search_title_desc", (q) =>
        q.search("title", searchTerm)
      )
      .collect();

    // Apply role-based filtering
    let filteredResults = searchResults;
    if (userRole === "user" && userId) {
      filteredResults = searchResults.filter(
        (ticket) => ticket.userId === userId
      );
    }

    // Get user info for each ticket
    const ticketsWithUsers = await Promise.all(
      filteredResults.map(async (ticket) => {
        const user = await ctx.db.get(ticket.userId);
        const assignedUser = ticket.assignedTo
          ? await ctx.db.get(ticket.assignedTo)
          : null;
        return {
          ...ticket,
          user,
          assignedUser,
        };
      })
    );

    return ticketsWithUsers;
  },
});

export const deleteTicket = mutation({
  args: {
    ticketId: v.id("tickets"),
  },
  handler: async (ctx, { ticketId }) => {
    const ticket = await ctx.db.get(ticketId);
    if (!ticket) throw new Error("Ticket not found");

    // Delete attachments
    const attachments = await ctx.db
      .query("attachments")
      .withIndex("by_ticket", (q) => q.eq("ticketId", ticketId))
      .collect();

    for (const att of attachments) {
      await ctx.db.delete(att._id);
    }

    // Delete notifications for this ticket
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_ticket", (q) => q.eq("ticketId", ticketId))
      .collect();

    for (const notif of notifications) {
      await ctx.db.delete(notif._id);
    }

    // Delete the ticket
    await ctx.db.delete(ticketId);

    return { success: true };
    // NOTE: This does not delete the files stored in Convex
  },
});
