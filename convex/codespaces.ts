import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============================================
// CREATING CODESPACE
// ============================================
export const createCodespace = mutation({
  args: {
    projectId: v.id("projects"),
    createdBy: v.id("users"),
    codespaceName: v.optional(v.string()),
    codespaceDescription: v.optional(v.string()),
    code: v.optional(v.string()),
    messageHistory: v.optional(v.array(v.any())),
  },
  handler: async (ctx, args) => {
    // CHECK1 : user session
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    // CHECK2: user is authorized
    const user = await ctx.db.get(args.createdBy);
    if (!user || user.tokenIdentifier !== identity.tokenIdentifier) {
      throw new Error("Unauthorized");
    }

    const codespaceId = await ctx.db.insert("codespaces", {
      projectId: args.projectId,
      createdBy: args.createdBy,
      codespaceName: args.codespaceName,
      codespaceDescription: args.codespaceDescription,
      code: args.code,
      messageHistory: args.messageHistory,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return codespaceId;
  },
});

// ============================================
// GETTING ALL CODESPACE FOR A PROJECTID
// ============================================
// ALREADY CREATED IN PROJECT.TS
// export const getCodespacesByProjectId = query({
//   args: {
//     projectId: v.id("projects"),
//   },
//   handler: async (ctx, args) => {
//     const codespaces = await ctx.db
//       .query("codespaces")
//       .filter((q) => q.eq(q.field("projectId"), args.projectId))
//       .collect();
//     return codespaces;
//   },
// });

