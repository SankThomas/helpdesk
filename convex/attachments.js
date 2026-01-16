import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createAttachment = mutation({
  args: {
    ticketId: v.id("tickets"),
    fileName: v.string(),
    fileSize: v.number(),
    storageId: v.id("_storage"),
    uploadedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("attachments", {
      ticketId: args.ticketId,
      fileName: args.fileName,
      fileUrl: await ctx.storage.getUrl(args.storageId),
      fileSize: args.fileSize,
      uploadedBy: args.uploadedBy,
      createdAt: Date.now(),
    });
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getAttachmentByTicket = query({
  args: { ticketId: v.id("tickets") },
  handler: async (ctx, { ticketId }) => {
    const attachments = await ctx.db
      .query("attachments")
      .withIndex("by_ticket", (q) => q.eq("ticketId", ticketId))
      .collect();

    // Get user info for each attachment
    const attachmentWithUsers = await Promise.all(
      attachments.map(async (attachment) => {
        const user = await ctx.db.get(attachment.uploadedBy);
        return {
          ...attachment,
          user,
        };
      }),
    );

    return attachmentWithUsers.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const deleteAttachment = mutation({
  args: { attachmentId: v.id("attachments"), userId: v.id("users") },
  handler: async (ctx, { attachmentId, userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const attachment = await ctx.db.get(attachmentId);
    if (!attachment) throw new Error("Attachment not found");

    const ticket = await ctx.db.get(attachment.ticketId);
    if (!ticket) throw new Error("Ticket not found");

    const isOwner = attachment.uploadedBy === user._id;
    const isAgentAssigned =
      user.role === "agent" && ticket.assignedTo === user._id;
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAgentAssigned && !isAdmin)
      throw new Error("You cannot delete this attachment");

    await ctx.db.delete(attachmentId);
  },
});
