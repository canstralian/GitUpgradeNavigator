import type { Express } from "express";
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
  return httpServer;
}

function generatePlanSteps(assessment: any, template: any) {
  const steps = [];
  
  // Repository setup steps
  if (assessment.branchProtection === "None implemented") {
    steps.push({
      id: 1,
      title: "Enable Branch Protection Rules",
      description: "Configure branch protection for main branches",
      category: "security",
      completed: false,
      estimatedTime: "30 minutes",
      priority: "high"
    });
  }

  // Workflow-specific steps
  if (template.type === "gitflow") {
    steps.push({
      id: 2,
      title: "Create Development Branch",
      description: "Set up dedicated development branch for integration",
      category: "workflow",
      completed: false,
      estimatedTime: "15 minutes",
      priority: "high"
    });

    steps.push({
      id: 3,
      title: "Configure Branch Naming Convention",
      description: "Establish naming patterns for feature, release, and hotfix branches",
      category: "workflow",
      completed: false,
      estimatedTime: "20 minutes",
      priority: "medium"
    });
  }

  // Code review steps
  if (!assessment.codeReviewProcess?.requiredReviews) {
    steps.push({
      id: 4,
      title: "Implement Code Review Process",
      description: "Set up required pull request reviews and approval workflows",
      category: "collaboration",
      completed: false,
      estimatedTime: "45 minutes",
      priority: "high"
    });
  }

  // CI/CD steps
  if (!assessment.codeReviewProcess?.automatedChecks) {
    steps.push({
      id: 5,
      title: "Set up Automated Testing",
      description: "Configure continuous integration with automated test runs",
      category: "automation",
      completed: false,
      estimatedTime: "2 hours",
      priority: "medium"
    });
  }

  // Team training
  steps.push({
    id: 6,
    title: "Conduct Team Training",
    description: "Train team members on new workflow and best practices",
    category: "training",
    completed: false,
    estimatedTime: "3 hours",
    priority: "medium"
  });

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
