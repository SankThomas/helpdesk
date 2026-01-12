import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getCurrentUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();
    return user;
  },
});

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.optional(
      v.union(v.literal("user"), v.literal("agent"), v.literal("admin"))
    ),
  },
  handler: async (ctx, { clerkId, email, name, role = "user" }) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    const userId = await ctx.db.insert("users", {
      clerkId,
      email,
      name,
      role,
      createdAt: Date.now(),
    });

    return userId;
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("agent"), v.literal("admin")),
  },
  handler: async (ctx, { userId, role }) => {
    await ctx.db.patch(userId, { role });
  },
});

export const getAllAgents = query({
  handler: async (ctx) => {
    const agents = await ctx.db
      .query("users")
      .filter((q) =>
        q.or(q.eq(q.field("role"), "agent"), q.eq(q.field("role"), "admin"))
      )
      .collect();
    return agents;
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").order("desc").collect();
    return users;
  },
});
