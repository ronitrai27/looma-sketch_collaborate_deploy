import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save imported Figma file metadata to the project
export const saveFigmaImport = mutation({
  args: {
    projectId: v.id("projects"),
    figmaData: v.object({
      fileKey: v.string(),
      fileName: v.string(),
      fileUrl: v.string(),
      lastModified: v.string(),
      thumbnailUrl: v.optional(v.string()),
      importedAt: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Get the project to verify ownership/membership
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user is owner or member
    const isOwner = project.ownerId === user._id;
    const isMember = project.projectMembers?.some(
      (member) => member.userId === user._id
    );

    if (!isOwner && !isMember) {
      throw new Error("Not authorized to import to this project");
    }

    // Check if this file was already imported
    const existing = await ctx.db
      .query("figmaImports")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .filter((q) => q.eq(q.field("fileKey"), args.figmaData.fileKey))
      .first();

    if (existing) {
      // Update existing import
      await ctx.db.patch(existing._id, {
        fileName: args.figmaData.fileName,
        fileUrl: args.figmaData.fileUrl,
        lastModified: args.figmaData.lastModified,
        thumbnailUrl: args.figmaData.thumbnailUrl,
        importedAt: args.figmaData.importedAt,
        importedBy: user._id,
      });
      return { success: true, updated: true, importId: existing._id };
    }

    // Create new import
    const importId = await ctx.db.insert("figmaImports", {
      projectId: args.projectId,
      fileKey: args.figmaData.fileKey,
      fileName: args.figmaData.fileName,
      fileUrl: args.figmaData.fileUrl,
      lastModified: args.figmaData.lastModified,
      thumbnailUrl: args.figmaData.thumbnailUrl,
      importedAt: args.figmaData.importedAt,
      importedBy: user._id,
    });

    return { success: true, updated: false, importId };
  },
});

// Get Figma imports for a project
export const getFigmaImports = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const imports = await ctx.db
      .query("figmaImports")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    return imports;
  },
});
