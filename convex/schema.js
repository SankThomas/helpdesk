import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("user"), v.literal("agent"), v.literal("admin")),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  tickets: defineTable({
    title: v.string(),
    description: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    status: v.union(
      v.literal("open"),
      v.literal("pending"),
      v.literal("resolved"),
      v.literal("closed")
    ),
    userId: v.id("users"),
    assignedTo: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_assigned", ["assignedTo"])
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .searchIndex("search_title_desc", {
      searchField: "title",
      filterFields: ["status", "priority", "userId"],
    }),

  comments: defineTable({
    ticketId: v.id("tickets"),
    userId: v.id("users"),
    content: v.string(),
    isInternal: v.boolean(),
    createdAt: v.number(),
  }).index("by_ticket", ["ticketId"]),

  notifications: defineTable({
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
    read: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_ticket", ["ticketId"]),

  attachments: defineTable({
    ticketId: v.id("tickets"),
    fileName: v.string(),
    fileUrl: v.string(),
    fileSize: v.number(),
    uploadedBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_ticket", ["ticketId"]),
});
