import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  teamSize: text("team_size").notNull(),
  branchingStrategy: text("branching_strategy").notNull(),
  branchProtection: text("branch_protection").notNull(),
  codeReviewProcess: jsonb("code_review_process").notNull(),
  repositorySettings: jsonb("repository_settings").notNull(),
  collaborationTools: jsonb("collaboration_tools").notNull(),
  currentChallenges: text("current_challenges"),
  skillLevel: text("skill_level").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const upgradePlans = pgTable("upgrade_plans", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  assessmentId: integer("assessment_id").references(() => assessments.id),
  workflowType: text("workflow_type").notNull(),
  steps: jsonb("steps").notNull(),
  status: text("status").notNull().default("pending"),
  progress: integer("progress").notNull().default(0),
  estimatedDuration: text("estimated_duration"),
  priority: text("priority").notNull().default("medium"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  category: text("category").notNull(),
  skillLevel: text("skill_level").notNull(),
  url: text("url"),
  rating: integer("rating").default(5),
  downloadCount: integer("download_count").default(0),
  icon: text("icon").notNull(),
  tags: jsonb("tags").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workflowTemplates = pgTable("workflow_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  complexity: text("complexity").notNull(),
  branches: jsonb("branches").notNull(),
  rules: jsonb("rules").notNull(),
  advantages: jsonb("advantages").notNull(),
  recommended: boolean("recommended").default(false),
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
});

export const insertUpgradePlanSchema = createInsertSchema(upgradePlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

export const insertWorkflowTemplateSchema = createInsertSchema(workflowTemplates).omit({
  id: true,
});

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type UpgradePlan = typeof upgradePlans.$inferSelect;
export type InsertUpgradePlan = z.infer<typeof insertUpgradePlanSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type WorkflowTemplate = typeof workflowTemplates.$inferSelect;
export type InsertWorkflowTemplate = z.infer<typeof insertWorkflowTemplateSchema>;
