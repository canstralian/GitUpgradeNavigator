export const workflowTemplates = {
  gitflow: {
    name: "GitFlow",
    description: "A robust branching model for release-based development",
    branches: [
      { name: "main", color: "#24292F", description: "Production-ready code" },
      { name: "develop", color: "#0969DA", description: "Integration branch" },
      { name: "feature/*", color: "#1A7F37", description: "Feature development" },
      { name: "release/*", color: "#FB8500", description: "Release preparation" },
      { name: "hotfix/*", color: "#D73A49", description: "Production fixes" }
    ],
    advantages: [
      "Clear separation of concerns",
      "Parallel development support",
      "Release management",
      "Hotfix isolation"
    ],
    complexity: "Medium",
    recommended: true
  },
  trunk: {
    name: "Trunk-based Development",
    description: "Streamlined approach for continuous deployment",
    branches: [
      { name: "main", color: "#24292F", description: "Always deployable" },
      { name: "feature/*", color: "#1A7F37", description: "Short-lived features" }
    ],
    advantages: [
      "Simplified branching",
      "Faster integration",
      "Reduced merge conflicts",
      "Continuous deployment ready"
    ],
    complexity: "Low",
    recommended: false
  },
  feature: {
    name: "Feature Branch Workflow",
    description: "Simple branching for small teams",
    branches: [
      { name: "main", color: "#24292F", description: "Stable code" },
      { name: "feature/*", color: "#1A7F37", description: "New features" }
    ],
    advantages: [
      "Easy to understand",
      "Minimal overhead",
      "Good for small teams",
      "Quick setup"
    ],
    complexity: "Low",
    recommended: false
  }
};
