import { 
  assessments, 
  upgradePlans, 
  resources, 
  workflowTemplates,
  type Assessment,
  type InsertAssessment,
  type UpgradePlan,
  type InsertUpgradePlan,
  type Resource,
  type InsertResource,
  type WorkflowTemplate,
  type InsertWorkflowTemplate
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Assessment methods
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  getAllAssessments(): Promise<Assessment[]>;
  
  // Upgrade plan methods
  createUpgradePlan(plan: InsertUpgradePlan): Promise<UpgradePlan>;
  getUpgradePlan(id: number): Promise<UpgradePlan | undefined>;
  getAllUpgradePlans(): Promise<UpgradePlan[]>;
  updateUpgradePlan(id: number, updates: Partial<UpgradePlan>): Promise<UpgradePlan>;
  
  // Resource methods
  createResource(resource: InsertResource): Promise<Resource>;
  getResource(id: number): Promise<Resource | undefined>;
  getAllResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  getResourcesBySkillLevel(skillLevel: string): Promise<Resource[]>;
  
  // Workflow template methods
  createWorkflowTemplate(template: InsertWorkflowTemplate): Promise<WorkflowTemplate>;
  getWorkflowTemplate(id: number): Promise<WorkflowTemplate | undefined>;
  getAllWorkflowTemplates(): Promise<WorkflowTemplate[]>;
  getWorkflowTemplatesByType(type: string): Promise<WorkflowTemplate[]>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    // Check if workflow templates already exist
    const existingTemplates = await this.getAllWorkflowTemplates();
    if (existingTemplates.length === 0) {
      // Initialize workflow templates
      const defaultTemplates: Array<InsertWorkflowTemplate> = [
        {
          name: "GitFlow",
          type: "gitflow",
          description: "Best for release-based projects with multiple environments",
          complexity: "Medium",
          branches: {
            main: { name: "main", description: "Production-ready code", color: "#24292F" },
            develop: { name: "develop", description: "Integration branch", color: "#0969DA" },
            feature: { name: "feature/*", description: "Feature development", color: "#1A7F37" },
            release: { name: "release/*", description: "Release preparation", color: "#FB8500" },
            hotfix: { name: "hotfix/*", description: "Production fixes", color: "#D73A49" }
          },
          rules: {
            mainProtection: true,
            developProtection: true,
            requiredReviews: 2,
            statusChecks: true
          },
          advantages: [
            "Clear separation of concerns",
            "Parallel development support",
            "Release management",
            "Hotfix isolation"
          ],
          recommended: true
        },
        {
          name: "Trunk-based Development",
          type: "trunk",
          description: "Ideal for continuous deployment and fast-moving teams",
          complexity: "Low",
          branches: {
            main: { name: "main", description: "Always deployable", color: "#24292F" },
            feature: { name: "feature/*", description: "Short-lived features", color: "#1A7F37" }
          },
          rules: {
            mainProtection: true,
            requiredReviews: 1,
            statusChecks: true,
            fastForward: true
          },
          advantages: [
            "Simplified branching",
            "Faster integration",
            "Reduced merge conflicts",
            "Continuous deployment ready"
          ],
          recommended: false
        },
        {
          name: "Feature Branch Workflow",
          type: "feature-branch",
          description: "Simple approach for small teams and straightforward projects",
          complexity: "Low",
          branches: {
            main: { name: "main", description: "Stable code", color: "#24292F" },
            feature: { name: "feature/*", description: "New features", color: "#1A7F37" }
          },
          rules: {
            mainProtection: true,
            requiredReviews: 1,
            statusChecks: false
          },
          advantages: [
            "Easy to understand",
            "Minimal overhead",
            "Good for small teams",
            "Quick setup"
          ],
          recommended: false
        }
      ];

      for (const template of defaultTemplates) {
        await db.insert(workflowTemplates).values(template);
      }
    }

    // Check if resources already exist
    const existingResources = await this.getAllResources();
    if (existingResources.length === 0) {
      // Initialize default resources
      const defaultResources: Array<InsertResource> = [
        {
          title: "Git Best Practices Guide",
          description: "Comprehensive guide covering commit messages, branching strategies, and collaboration workflows.",
          type: "tutorial",
          category: "workflows",
          skillLevel: "beginner",
          url: "https://git-scm.com/book",
          rating: 5,
          downloadCount: 124,
          icon: "fas fa-book",
          tags: ["git", "best-practices", "workflow"]
        },
        {
          title: "GitHub Actions Workflow",
          description: "Pre-configured CI/CD workflows for testing, building, and deploying your applications.",
          type: "tool",
          category: "automation",
          skillLevel: "intermediate",
          url: "https://github.com/actions",
          rating: 4,
          downloadCount: 2300,
          icon: "fas fa-cogs",
          tags: ["github-actions", "ci-cd", "automation"]
        },
        {
          title: "Security Scanning Setup",
          description: "Step-by-step guide to implementing code scanning, secret detection, and vulnerability management.",
          type: "best-practice",
          category: "security",
          skillLevel: "advanced",
          url: "https://docs.github.com/en/code-security",
          rating: 5,
          downloadCount: 856,
          icon: "fas fa-shield-alt",
          tags: ["security", "scanning", "vulnerabilities"]
        },
        {
          title: "Team Training Materials",
          description: "Presentation slides and exercises for training your team on Git workflows and GitHub features.",
          type: "training",
          category: "workflows",
          skillLevel: "beginner",
          url: "/downloads/training-materials.zip",
          rating: 4,
          downloadCount: 445,
          icon: "fas fa-users",
          tags: ["training", "team", "presentations"]
        },
        {
          title: "Pre-commit Hooks",
          description: "Collection of pre-commit hooks for code formatting, linting, and quality checks.",
          type: "tool",
          category: "automation",
          skillLevel: "intermediate",
          url: "https://pre-commit.com/",
          rating: 4,
          downloadCount: 1200,
          icon: "fas fa-code",
          tags: ["pre-commit", "hooks", "quality"]
        },
        {
          title: "Metrics Dashboard",
          description: "Track your team's Git performance with detailed analytics and improvement suggestions.",
          type: "tool",
          category: "analytics",
          skillLevel: "advanced",
          url: "/tools/metrics-dashboard",
          rating: 5,
          downloadCount: 780,
          icon: "fas fa-chart-line",
          tags: ["metrics", "analytics", "performance"]
        }
      ];

      for (const resource of defaultResources) {
        await db.insert(resources).values(resource);
      }
    }
  }

  // Assessment methods
  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const [result] = await db
      .insert(assessments)
      .values(assessment)
      .returning();
    return result;
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    const [result] = await db
      .select()
      .from(assessments)
      .where(eq(assessments.id, id));
    return result || undefined;
  }

  async getAllAssessments(): Promise<Assessment[]> {
    return await db.select().from(assessments);
  }

  // Upgrade plan methods
  async createUpgradePlan(plan: InsertUpgradePlan): Promise<UpgradePlan> {
    const [result] = await db
      .insert(upgradePlans)
      .values(plan)
      .returning();
    return result;
  }

  async getUpgradePlan(id: number): Promise<UpgradePlan | undefined> {
    const [result] = await db
      .select()
      .from(upgradePlans)
      .where(eq(upgradePlans.id, id));
    return result || undefined;
  }

  async getAllUpgradePlans(): Promise<UpgradePlan[]> {
    return await db.select().from(upgradePlans);
  }

  async updateUpgradePlan(id: number, updates: Partial<UpgradePlan>): Promise<UpgradePlan> {
    const [result] = await db
      .update(upgradePlans)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(upgradePlans.id, id))
      .returning();
    
    if (!result) {
      throw new Error(`Upgrade plan with id ${id} not found`);
    }
    
    return result;
  }

  // Resource methods
  async createResource(resource: InsertResource): Promise<Resource> {
    const [result] = await db
      .insert(resources)
      .values(resource)
      .returning();
    return result;
  }

  async getResource(id: number): Promise<Resource | undefined> {
    const [result] = await db
      .select()
      .from(resources)
      .where(eq(resources.id, id));
    return result || undefined;
  }

  async getAllResources(): Promise<Resource[]> {
    return await db.select().from(resources);
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return await db
      .select()
      .from(resources)
      .where(eq(resources.category, category));
  }

  async getResourcesBySkillLevel(skillLevel: string): Promise<Resource[]> {
    return await db
      .select()
      .from(resources)
      .where(eq(resources.skillLevel, skillLevel));
  }

  // Workflow template methods
  async createWorkflowTemplate(template: InsertWorkflowTemplate): Promise<WorkflowTemplate> {
    const [result] = await db
      .insert(workflowTemplates)
      .values(template)
      .returning();
    return result;
  }

  async getWorkflowTemplate(id: number): Promise<WorkflowTemplate | undefined> {
    const [result] = await db
      .select()
      .from(workflowTemplates)
      .where(eq(workflowTemplates.id, id));
    return result || undefined;
  }

  async getAllWorkflowTemplates(): Promise<WorkflowTemplate[]> {
    return await db.select().from(workflowTemplates);
  }

  async getWorkflowTemplatesByType(type: string): Promise<WorkflowTemplate[]> {
    return await db
      .select()
      .from(workflowTemplates)
      .where(eq(workflowTemplates.type, type));
  }
}

export const storage = new DatabaseStorage();
