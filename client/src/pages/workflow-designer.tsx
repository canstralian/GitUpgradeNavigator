import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WorkflowDiagram from "@/components/workflow/workflow-diagram";
import ProgressTracker from "@/components/shared/progress-tracker";
import type { WorkflowTemplate } from "@shared/schema";

export default function WorkflowDesigner() {
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);

  const { data: templates, isLoading } = useQuery<WorkflowTemplate[]>({
    queryKey: ["/api/workflow-templates"],
  });

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading workflow templates...</div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProgressTracker currentStep={2} />
      
      <section className="mb-12">
        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-xl font-semibold text-github-dark">
              Workflow Designer
            </CardTitle>
            <p className="text-github-muted mt-2">
              Design and visualize your optimal Git workflow strategy
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Workflow Options */}
              <div className="space-y-4">
                <h4 className="font-semibold text-github-dark mb-4">
                  Available Strategies
                </h4>
                
                {templates?.map((template) => (
                  <div
                    key={template.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedTemplate?.id === template.id
                        ? "border-github-blue bg-blue-50"
                        : "border-gray-200 hover:border-github-blue"
                    } ${template.recommended ? "border-github-blue bg-blue-50" : ""}`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-github-dark">{template.name}</h5>
                      {template.recommended && (
                        <Badge className="bg-github-blue text-white">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-github-muted mb-3">
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-github-muted">
                        Complexity: {template.complexity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-github-blue hover:bg-github-blue hover:text-white"
                      >
                        {selectedTemplate?.id === template.id ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Visual Diagram */}
              <div className="lg:col-span-2">
                <h4 className="font-semibold text-github-dark mb-4">
                  {selectedTemplate ? `${selectedTemplate.name} Workflow` : "Select a Workflow"}
                </h4>
                
                {selectedTemplate ? (
                  <WorkflowDiagram template={selectedTemplate} />
                ) : (
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 text-center">
                    <p className="text-github-muted">
                      Select a workflow strategy to view its diagram and implementation details
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
