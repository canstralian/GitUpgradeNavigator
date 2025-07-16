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

export class MemStorage implements IStorage {
  private assessments: Map<number, Assessment> = new Map();
  private upgradePlans: Map<number, UpgradePlan> = new Map();
  private resources: Map<number, Resource> = new Map();
  private workflowTemplates: Map<number, WorkflowTemplate> = new Map();
  
  private assessmentIdCounter = 1;
  private planIdCounter = 1;
  private resourceIdCounter = 1;
  private templateIdCounter = 1;

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize workflow templates
    const defaultTemplates: Array<Omit<WorkflowTemplate, 'id'>> = [
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

    defaultTemplates.forEach(template => {
      this.workflowTemplates.set(this.templateIdCounter, {
        ...template,
        id: this.templateIdCounter
      });
      this.templateIdCounter++;
    });

    // Initialize default resources
    const defaultResources: Array<Omit<Resource, 'id' | 'createdAt'>> = [
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

    defaultResources.forEach(resource => {
      this.resources.set(this.resourceIdCounter, {
        ...resource,
        id: this.resourceIdCounter,
        createdAt: new Date()
      });
      this.resourceIdCounter++;
    });
  }

  // Assessment methods
  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const newAssessment: Assessment = {
      ...assessment,
      id: this.assessmentIdCounter++,
      createdAt: new Date(),
      currentChallenges: assessment.currentChallenges || null
    };
    this.assessments.set(newAssessment.id, newAssessment);
    return newAssessment;
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async getAllAssessments(): Promise<Assessment[]> {
    return Array.from(this.assessments.values());
  }

  // Upgrade plan methods
  async createUpgradePlan(plan: InsertUpgradePlan): Promise<UpgradePlan> {
    const newPlan: UpgradePlan = {
      ...plan,
      id: this.planIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: plan.progress || 0,
      status: plan.status || "pending",
      priority: plan.priority || "medium",
      description: plan.description || null,
      assessmentId: plan.assessmentId || null,
      estimatedDuration: plan.estimatedDuration || null
    };
    this.upgradePlans.set(newPlan.id, newPlan);
    return newPlan;
  }

  async getUpgradePlan(id: number): Promise<UpgradePlan | undefined> {
    return this.upgradePlans.get(id);
  }

  async getAllUpgradePlans(): Promise<UpgradePlan[]> {
    return Array.from(this.upgradePlans.values());
  }

  async updateUpgradePlan(id: number, updates: Partial<UpgradePlan>): Promise<UpgradePlan> {
    const existingPlan = this.upgradePlans.get(id);
    if (!existingPlan) {
      throw new Error(`Upgrade plan with id ${id} not found`);
    }
    
    const updatedPlan = {
      ...existingPlan,
      ...updates,
      updatedAt: new Date()
    };
    
    this.upgradePlans.set(id, updatedPlan);
    return updatedPlan;
  }

  // Resource methods
  async createResource(resource: InsertResource): Promise<Resource> {
    const newResource: Resource = {
      ...resource,
      id: this.resourceIdCounter++,
      createdAt: new Date(),
      url: resource.url || null,
      rating: resource.rating || 5,
      downloadCount: resource.downloadCount || 0
    };
    this.resources.set(newResource.id, newResource);
    return newResource;
  }

  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async getAllResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(r => r.category === category);
  }

  async getResourcesBySkillLevel(skillLevel: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(r => r.skillLevel === skillLevel);
  }

  // Workflow template methods
  async createWorkflowTemplate(template: InsertWorkflowTemplate): Promise<WorkflowTemplate> {
    const newTemplate: WorkflowTemplate = {
      ...template,
      id: this.templateIdCounter++,
      recommended: template.recommended || false
    };
    this.workflowTemplates.set(newTemplate.id, newTemplate);
    return newTemplate;
  }

  async getWorkflowTemplate(id: number): Promise<WorkflowTemplate | undefined> {
    return this.workflowTemplates.get(id);
  }

  async getAllWorkflowTemplates(): Promise<WorkflowTemplate[]> {
    return Array.from(this.workflowTemplates.values());
  }

  async getWorkflowTemplatesByType(type: string): Promise<WorkflowTemplate[]> {
    return Array.from(this.workflowTemplates.values()).filter(t => t.type === type);
  }
}

export const storage = new MemStorage();
