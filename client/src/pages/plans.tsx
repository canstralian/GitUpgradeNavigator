import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import PlanCard from "@/components/plans/plan-card";
import ProgressTracker from "@/components/shared/progress-tracker";
import { Plus, Target, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { UpgradePlan, Assessment, WorkflowTemplate } from "@shared/schema";

export default function Plans() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<string>("");
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: plans, isLoading } = useQuery<UpgradePlan[]>({
    queryKey: ["/api/upgrade-plans"],
  });

  const { data: assessments } = useQuery<Assessment[]>({
    queryKey: ["/api/assessments"],
  });

  const { data: workflows } = useQuery<WorkflowTemplate[]>({
    queryKey: ["/api/workflow-templates"],
  });

  const generatePlan = useMutation({
    mutationFn: async ({ assessmentId, workflowType }: { assessmentId: number; workflowType: string }) => {
      const response = await apiRequest("POST", "/api/generate-plan", {
        assessmentId,
        workflowType,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/upgrade-plans"] });
      setIsGenerating(false);
      setSelectedAssessment("");
      setSelectedWorkflow("");
      toast({
        title: "Plan generated successfully!",
        description: "Your comprehensive upgrade plan is ready for implementation.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGeneratePlan = () => {
    if (!selectedAssessment || !selectedWorkflow) {
      toast({
        title: "Missing information",
        description: "Please select both an assessment and workflow type.",
        variant: "destructive",
      });
      return;
    }

    generatePlan.mutate({
      assessmentId: parseInt(selectedAssessment),
      workflowType: selectedWorkflow,
    });
  };

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading upgrade plans...</div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProgressTracker currentStep={3} />
      
      {/* Statistics Overview */}
      {plans && plans.length > 0 && (
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Target className="h-8 w-8 text-github-blue" />
                  <div>
                    <p className="text-2xl font-bold text-github-dark">{plans.length}</p>
                    <p className="text-sm text-github-muted">Total Plans</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-8 w-8 text-github-green" />
                  <div>
                    <p className="text-2xl font-bold text-github-dark">
                      {plans.filter(p => p.status === 'completed').length}
                    </p>
                    <p className="text-sm text-github-muted">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold text-github-dark">
                      {plans.filter(p => p.status === 'in-progress').length}
                    </p>
                    <p className="text-sm text-github-muted">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
      
      <section className="mb-12">
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-github-dark">
                  Upgrade Plans
                </CardTitle>
                <p className="text-github-muted mt-2">
                  Comprehensive improvement roadmaps with step-by-step implementation guides
                </p>
              </div>
              <Dialog open={isGenerating} onOpenChange={setIsGenerating}>
                <DialogTrigger asChild>
                  <Button className="bg-github-blue hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Generate New Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Generate Upgrade Plan</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="assessment">Select Assessment</Label>
                      <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an assessment" />
                        </SelectTrigger>
                        <SelectContent>
                          {assessments?.map((assessment) => (
                            <SelectItem key={assessment.id} value={assessment.id.toString()}>
                              Assessment #{assessment.id} - {assessment.teamSize} team
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="workflow">Select Workflow Type</Label>
                      <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a workflow strategy" />
                        </SelectTrigger>
                        <SelectContent>
                          {workflows?.map((workflow) => (
                            <SelectItem key={workflow.id} value={workflow.type}>
                              {workflow.name} - {workflow.complexity} complexity
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsGenerating(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleGeneratePlan}
                        disabled={generatePlan.isPending}
                        className="bg-github-blue hover:bg-blue-700 text-white"
                      >
                        {generatePlan.isPending ? "Generating..." : "Generate Plan"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {plans && plans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-github-muted mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-github-muted" />
                  </div>
                  <h3 className="font-medium text-github-dark mb-2">No upgrade plans yet</h3>
                  <p className="text-sm mb-4">Complete an assessment to generate your first comprehensive upgrade plan</p>
                  <div className="text-xs text-github-muted max-w-md mx-auto space-y-1">
                    <p>• Repository configuration and security settings</p>
                    <p>• Workflow implementation with branching strategies</p>
                    <p>• Code review and collaboration processes</p>
                    <p>• CI/CD automation and quality gates</p>
                    <p>• Documentation and team training</p>
                    <p>• Monitoring and optimization</p>
                  </div>
                </div>
                <Button 
                  className="bg-github-blue hover:bg-blue-700 text-white"
                  onClick={() => setIsGenerating(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Your First Plan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
