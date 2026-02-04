import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(), //clerk user ID for auth
    email: v.string(),
    imageUrl: v.optional(v.string()),
    hasCompletedOnboarding: v.optional(v.boolean()),
    githubUsername: v.optional(v.string()),
    preferedTheme: v.optional(
      v.union(v.literal("light"), v.literal("dark"), v.literal("system")),
    ),
    // PLAN TYPE
    type: v.optional(
      v.union(v.literal("free"), v.literal("pro"), v.literal("elite")),
    ),
    // PROJECT LIMIT
    limit: v.optional(v.union(v.literal(3), v.literal(6), v.literal(12))),
    // ROLES
    usersType: v.optional(v.union(v.literal("user"), v.literal("admin"))),
    createdAt: v.number(),
    updatedAt: v.number(),
    //   INDEXES.....
  }).index("by_token", ["tokenIdentifier"]),

  projects: defineTable({
    projectName: v.string(),
    projectDescription: v.optional(v.string()),
    projectTags: v.optional(v.array(v.string())), // min 2 max 5
    ownerId: v.id("users"),
    ownerEmail: v.string(),
    inviteCode: v.optional(v.string()),
    inviteLink: v.optional(v.string()), // auto creates random invite link unique !
    isPublic: v.boolean(),
    // Now we store id + avatar
    projectMembers: v.optional(
      v.array(
        v.object({
          userId: v.id("users"),
          avatar: v.string(),
        }),
      ),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_invite_code", ["inviteCode"]),

  // Style guide table
  styleGuides: defineTable({
    name: v.string(),
    userId: v.id("users"),
    colors: v.optional(v.any()), // just to make sure it properly stores without Error !
    fonts: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // CODESPACE TABLE LINKED TO PROJECT.
  codespaces: defineTable({
    projectId: v.id("projects"),
    createdBy: v.id("users"),
    updatedBy: v.optional(v.id("users")),
    codespaceName: v.optional(v.string()),
    codespaceDescription: v.optional(v.string()),
    code: v.optional(v.string()),
    messageHistory: v.optional(v.array(v.any())),
    // codespaceTeamTags: v.optional(v.array(v.string())), // Future addition.
    updatedAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_updated_by", ["updatedBy"])
    .index("by_created_by", ["createdBy"]),
});
