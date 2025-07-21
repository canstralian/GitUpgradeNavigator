import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertAssessmentSchema, insertUpgradePlanSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Assessment routes
  app.post("/api/assessments", async (req, res) => {
    try {
      const assessmentData = insertAssessmentSchema.parse(req.body);
      const assessment = await storage.createAssessment(assessmentData);
      res.json(assessment);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid assessment data" });
    }
  });

  app.get("/api/assessments", async (req, res) => {
    try {
      const assessments = await storage.getAllAssessments();
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assessments" });
    }
  });

  app.get("/api/assessments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assessment = await storage.getAssessment(id);
      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assessment" });
    }
  });

  // Upgrade plan routes
  app.post("/api/upgrade-plans", async (req, res) => {
    try {
      const planData = insertUpgradePlanSchema.parse(req.body);
      const plan = await storage.createUpgradePlan(planData);
      res.json(plan);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid plan data" });
    }
  });

  app.get("/api/upgrade-plans", async (req, res) => {
    try {
      const plans = await storage.getAllUpgradePlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch upgrade plans" });
    }
  });

  app.get("/api/upgrade-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const plan = await storage.getUpgradePlan(id);
      if (!plan) {
        return res.status(404).json({ error: "Upgrade plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch upgrade plan" });
    }
  });

  app.put("/api/upgrade-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const plan = await storage.updateUpgradePlan(id, updates);
      res.json(plan);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to update plan" });
    }
  });

  // Resource routes
  app.get("/api/resources", async (req, res) => {
    try {
      const { category, skillLevel } = req.query;

      let resources;
      if (category && typeof category === 'string') {
        resources = await storage.getResourcesByCategory(category);
      } else if (skillLevel && typeof skillLevel === 'string') {
        resources = await storage.getResourcesBySkillLevel(skillLevel);
      } else {
        resources = await storage.getAllResources();
      }

      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  app.get("/api/resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const resource = await storage.getResource(id);
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resource" });
    }
  });

  // Workflow template routes
  app.get("/api/workflow-templates", async (req, res) => {
    try {
      const { type } = req.query;

      let templates;
      if (type && typeof type === 'string') {
        templates = await storage.getWorkflowTemplatesByType(type);
      } else {
        templates = await storage.getAllWorkflowTemplates();
      }

      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch workflow templates" });
    }
  });

  app.get("/api/workflow-templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getWorkflowTemplate(id);
      if (!template) {
        return res.status(404).json({ error: "Workflow template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch workflow template" });
    }
  });

  // Generate upgrade plan based on assessment
  app.post("/api/generate-plan", async (req, res) => {
    try {
      const { assessmentId, workflowType } = req.body;

      const assessment = await storage.getAssessment(assessmentId);
      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }

      const template = await storage.getWorkflowTemplatesByType(workflowType);
      if (!template.length) {
        return res.status(404).json({ error: "Workflow template not found" });
      }

      // Generate steps based on assessment and template
      const steps = generatePlanSteps(assessment, template[0]);

      const plan = await storage.createUpgradePlan({
        title: `${template[0].name} Implementation Plan`,
        description: `Upgrade plan for implementing ${template[0].name} workflow`,
        assessmentId,
        workflowType,
        steps,
        status: "pending",
        progress: 0,
        estimatedDuration: calculateEstimatedDuration(steps),
        priority: "medium"
      });

      res.json(plan);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to generate plan" });
    }
  });

  const httpServer = createServer(app);

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log error details for debugging
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${status}: ${message}`);
    if (status === 500) {
      console.error(err.stack);
    }

    // Don't expose internal errors in production
    const responseMessage = status === 500 && process.env.NODE_ENV === 'production' 
      ? "Internal Server Error" 
      : message;

    res.status(status).json({ 
      error: responseMessage,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });

  return httpServer;
}

function generatePlanSteps(assessment: any, template: any) {
  const steps = [];
  let stepId = 1;
  const generateStepId = () => Math.random().toString(36).substr(2, 9);

  // Phase 1: Repository Configuration & Security
  const repositorySteps = [
    {
      id: stepId++,
      title: "Audit Current Repository Settings",
      description: "Review existing repository configuration, access permissions, and security settings",
      category: "assessment",
      completed: false,
      estimatedTime: "30 minutes",
      priority: "high",
      phase: "Configuration Setup",
      instructions: [
        "Review repository visibility settings (public/private)",
        "Audit team member access levels and permissions",
        "Check current branch protection rules",
        "Document existing integrations and webhooks"
      ]
    }
  ];

  if (assessment.branchProtection === "none" || !assessment.repositorySettings?.branchProtection) {
    repositorySteps.push({
      id: stepId++,
      title: "Enable Branch Protection Rules",
      description: "Configure comprehensive branch protection for main and development branches",
      category: "security",
      completed: false,
      estimatedTime: "45 minutes",
      priority: "high",
      phase: "Configuration Setup",
      instructions: [
        "Enable 'Require pull request reviews before merging'",
        "Set minimum number of required reviewers (2 for teams >5, 1 for smaller teams)",
        "Enable 'Dismiss stale PR approvals when new commits are pushed'",
        "Require status checks to pass before merging",
        "Enable 'Require branches to be up to date before merging'",
        "Restrict pushes to matching branches (admins only)"
      ]
    });
  }

  repositorySteps.push({
    id: stepId++,
    title: "Configure Repository Security Settings",
    description: "Enable security features and vulnerability scanning",
    category: "security",
    completed: false,
    estimatedTime: "30 minutes",
    priority: "high",
    phase: "Configuration Setup",
    instructions: [
      "Enable Dependabot alerts for vulnerable dependencies",
      "Set up automated dependency updates",
      "Enable secret scanning for API keys and tokens",
      "Configure code scanning with CodeQL",
      "Set up security policies and vulnerability reporting"
    ]
  });

  // Phase 2: Workflow Implementation
  const workflowSteps = [];

  if (template.type === "gitflow") {
    workflowSteps.push({
      id: stepId++,
      title: "Set Up GitFlow Branch Structure",
      description: "Create and configure GitFlow branching model with proper naming conventions",
      category: "workflow",
      completed: false,
      estimatedTime: "1 hour",
      priority: "high",
      phase: "Workflow Setup",
      instructions: [
        "Create 'develop' branch from main",
        "Set up branch naming conventions: feature/*, release/*, hotfix/*",
        "Configure branch protection for develop branch",
        "Document GitFlow process for the team",
        "Set up branch deletion policies for merged branches"
      ]
    });

    workflowSteps.push({
      id: stepId++,
      title: "Configure GitFlow Release Process",
      description: "Establish release branch workflows and versioning strategy",
      category: "workflow",
      completed: false,
      estimatedTime: "45 minutes",
      priority: "medium",
      phase: "Workflow Setup",
      instructions: [
        "Define semantic versioning strategy (major.minor.patch)",
        "Create release branch template with checklist",
        "Set up automated changelog generation",
        "Configure release notes template",
        "Establish hotfix procedures for production issues"
      ]
    });
  } else if (template.type === "trunk") {
    workflowSteps.push({
      id: stepId++,
      title: "Configure Trunk-Based Development",
      description: "Set up trunk-based workflow with feature flags and continuous integration",
      category: "workflow",
      completed: false,
      estimatedTime: "1 hour",
      priority: "high",
      phase: "Workflow Setup",
      instructions: [
        "Configure main branch as single source of truth",
        "Set up short-lived feature branches (max 2 days)",
        "Implement feature flag system for incomplete features",
        "Configure fast-forward merge strategy",
        "Set up continuous integration for all commits"
      ]
    });
  }

  // Phase 3: Code Review & Collaboration
  const collaborationSteps = [];

  if (!assessment.codeReviewProcess?.requiredReviews) {
    collaborationSteps.push({
      id: stepId++,
      title: "Implement Code Review Process",
      description: "Establish comprehensive pull request review workflows and guidelines",
      category: "collaboration",
      completed: false,
      estimatedTime: "1 hour",
      priority: "high",
      phase: "Code Review Setup",
      instructions: [
        "Create pull request template with checklist",
        "Define code review criteria and standards",
        "Set up CODEOWNERS file for automatic reviewer assignment",
        "Configure required approvals based on file changes",
        "Establish review turnaround time expectations",
        "Create guidelines for constructive feedback"
      ]
    });
  }

  collaborationSteps.push({
    id: stepId++,
    title: "Standardize Commit Message Format",
    description: "Implement consistent commit message conventions for better project history",
    category: "collaboration",
    completed: false,
    estimatedTime: "30 minutes",
    priority: "medium",
    phase: "Code Review Setup",
    instructions: [
      "Adopt Conventional Commits format (feat:, fix:, docs:, etc.)",
      "Set up commit message template",
      "Configure commit linting with commitlint",
      "Create examples of good commit messages",
      "Set up pre-commit hooks for message validation"
    ]
  });

  // Phase 4: Automation & CI/CD
  const automationSteps = [];

  if (!assessment.codeReviewProcess?.automatedChecks) {
    automationSteps.push({
      id: generateStepId(),
      title: "Set Up Continuous Integration Pipeline",
      description: "Configure automated testing and build processes",
      category: "automation",
      completed: false,
      estimatedTime: "2 hours",
      priority: "high",
      phase: "Automation Setup",
      instructions: [
        "Create GitHub Actions workflow for testing",
        "Set up automated code linting and formatting",
        "Configure test coverage reporting",
        "Add build and deployment automation",
        "Set up status checks for pull requests",
        "Configure notification systems for failures"
      ]
    });
  }

  automationSteps.push({
    id: generateStepId(),
    title: "Configure Quality Gates",
    description: "Implement automated code quality checks and gates",
    category: "automation",
    completed: false,
    estimatedTime: "1 hour",
    priority: "medium",
    phase: "Automation Setup",
    instructions: [
      "Set up SonarCloud or similar code quality tool",
      "Configure minimum code coverage thresholds",
      "Add automated security scanning",
      "Set up performance regression testing",
      "Configure dependency vulnerability checks",
      "Implement automated code formatting"
    ]
  });

  // Phase 5: Documentation & Training
  const documentationSteps = [
    {
      id: stepId++,
      title: "Create Comprehensive Documentation",
      description: "Document all processes, workflows, and best practices",
      category: "documentation",
      completed: false,
      estimatedTime: "2 hours",
      priority: "medium",
      phase: "Documentation & Training",
      instructions: [
        "Create README with project overview and setup instructions",
        "Document branching strategy and workflow procedures",
        "Write contributing guidelines for new team members",
        "Create troubleshooting guide for common issues",
        "Document release and deployment procedures",
        "Set up wiki or knowledge base for ongoing documentation"
      ]
    },
    {
      id: stepId++,
      title: "Conduct Team Training Sessions",
      description: "Train team members on new workflows and best practices",
      category: "training",
      completed: false,
      estimatedTime: "4 hours",
      priority: "high",
      phase: "Documentation & Training",
      instructions: [
        "Conduct Git workflow training session",
        "Demonstrate pull request and code review process",
        "Train on CI/CD pipeline usage and troubleshooting",
        "Show how to use new tools and integrations",
        "Provide hands-on practice with new workflows",
        "Create reference materials and cheat sheets"
      ]
    }
  ];

  // Phase 6: Monitoring & Optimization
  const monitoringSteps = [
    {
      id: stepId++,
      title: "Set Up Project Monitoring",
      description: "Implement metrics and monitoring for development workflow",
      category: "monitoring",
      completed: false,
      estimatedTime: "1 hour",
      priority: "medium",
      phase: "Monitoring & Optimization",
      instructions: [
        "Set up GitHub Insights for team productivity metrics",
        "Configure notifications for important events",
        "Track pull request cycle time and review time",
        "Monitor code quality trends over time",
        "Set up alerts for security vulnerabilities",
        "Create dashboard for project health metrics"
      ]
    },
    {
      id: stepId++,
      title: "Establish Review and Improvement Process",
      description: "Create ongoing process for workflow optimization",
      category: "optimization",
      completed: false,
      estimatedTime: "30 minutes",
      priority: "low",
      phase: "Monitoring & Optimization",
      instructions: [
        "Schedule monthly workflow review meetings",
        "Create feedback mechanism for team members",
        "Establish metrics for measuring improvement",
        "Document lessons learned and best practices",
        "Plan for regular tool and process updates",
        "Create process for onboarding new team members"
      ]
    }
  ];

  // Combine all steps based on assessment and template
  steps.push(...repositorySteps);
  steps.push(...workflowSteps);
  steps.push(...collaborationSteps);
  steps.push(...automationSteps);
  steps.push(...documentationSteps);
  steps.push(...monitoringSteps);

  return steps;
}

function calculateEstimatedDuration(steps: any[]) {
  const totalMinutes = steps.reduce((acc, step) => {
    const timeStr = step.estimatedTime;
    const hours = timeStr.includes('hour') ? parseInt(timeStr) * 60 : 0;
    const minutes = timeStr.includes('minute') ? parseInt(timeStr) : 0;
    return acc + hours + minutes;
  }, 0);

  if (totalMinutes >= 120) {
    return `${Math.ceil(totalMinutes / 60)} hours`;
  }
  return `${totalMinutes} minutes`;
}