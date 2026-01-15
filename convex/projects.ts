import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()), // Added description to match schema more closely if needed, though mostly optional
    tags: v.array(v.string()),
    isPublic: v.boolean(),
    ownerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const user = await ctx.db.get(args.ownerId);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.tokenIdentifier !== identity.tokenIdentifier) {
        throw new Error("Unauthorized");
    }

    // Generate a random invite link (simple implementation)
    const inviteCode = Math.random().toString(36).substring(2, 10); // Simple random string
    const inviteLink = `https://looma.app/invite/${inviteCode}`; // Placeholder domain

    const projectId = await ctx.db.insert("projects", {
      projectName: args.name,
      projectDescription: args.description,
      projectTags: args.tags,
      ownerId: args.ownerId,
      ownerEmail: user.email,
      inviteLink: inviteLink,
      isPublic: args.isPublic,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { projectId, inviteLink };
  },
});
