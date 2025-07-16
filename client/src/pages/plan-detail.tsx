import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Users, 
  AlertCircle, 
  Download, 
  ArrowLeft,
  CheckSquare,
  Square,
  Trophy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { generatePlanPDF } from "@/lib/pdf-generator";
import type { UpgradePlan } from "@shared/schema";

interface PlanDetailProps {
  planId: string;
}

export default function PlanDetail({ planId }: PlanDetailProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: plan, isLoading } = useQuery<UpgradePlan>({
    queryKey: ["/api/upgrade-plans", planId],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/upgrade-plans/${planId}`);
      return response.json();
    },
  });

  const updatePlan = useMutation({
    mutationFn: async (updates: Partial<UpgradePlan>) => {
      const response = await apiRequest("PUT", `/api/upgrade-plans/${planId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/upgrade-plans", planId] });
      toast({
        title: "Plan updated",
        description: "Your progress has been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleStep = (stepId: number) => {
    if (!plan) return;
    
    const steps = plan.steps as any[];
    const updatedSteps = steps.map(step =>
      step.id === stepId ? { ...step, completed: !step.completed } : step
    );
    
    const completedSteps = updatedSteps.filter(step => step.completed).length;
    const progress = Math.round((completedSteps / updatedSteps.length) * 100);
    
    updatePlan.mutate({
      steps: updatedSteps,
      progress,
      status: progress === 100 ? "completed" : progress > 0 ? "in-progress" : "pending"
    });
  };

  const handleExportPDF = () => {
    if (plan) {
      generatePlanPDF(plan);
      toast({
        title: "PDF exported",
        description: "Your upgrade plan has been downloaded.",
      });
    }
  };

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading plan details...</div>
      </main>
    );
  }

  if (!plan) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Plan not found</div>
      </main>
    );
  }

  const steps = plan.steps as any[];
  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  // Group steps by phase
  const stepsByPhase = steps.reduce((acc: any, step: any) => {
    const phase = step.phase || "General";
    if (!acc[phase]) acc[phase] = [];
    acc[phase].push(step);
    return acc;
  }, {});

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-github-green bg-opacity-20 text-github-green';
      case 'in-progress':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-orange-100 text-orange-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/plans")}
            className="text-github-muted hover:text-github-dark"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Plans
          </Button>
        </div>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-github-dark">{plan.title}</h1>
            <p className="text-github-muted mt-2">{plan.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className={getStatusColor(plan.status)}>
              {plan.status === 'completed' ? 'Complete' : plan.status === 'in-progress' ? 'In Progress' : 'Pending'}
            </Badge>
            <Button
              onClick={handleExportPDF}
              className="bg-github-blue hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-github-green" />
              <div>
                <p className="text-2xl font-bold text-github-dark">{completedSteps}</p>
                <p className="text-sm text-github-muted">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Circle className="h-8 w-8 text-github-muted" />
              <div>
                <p className="text-2xl font-bold text-github-dark">{totalSteps - completedSteps}</p>
                <p className="text-sm text-github-muted">Remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-github-blue" />
              <div>
                <p className="text-2xl font-bold text-github-dark">{plan.estimatedDuration}</p>
                <p className="text-sm text-github-muted">Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-github-dark">{Math.round(progressPercentage)}%</p>
                <p className="text-sm text-github-muted">Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-github-dark">Overall Progress</h3>
            <Badge className={getPriorityColor(plan.priority)}>
              {plan.priority} priority
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-sm text-github-muted mt-2">
            <span>{completedSteps} of {totalSteps} steps completed</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Plan Content */}
      <Tabs defaultValue="phases" className="space-y-6">
        <TabsList>
          <TabsTrigger value="phases">Implementation Phases</TabsTrigger>
          <TabsTrigger value="all-steps">All Steps</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>

        <TabsContent value="phases" className="space-y-6">
          {Object.entries(stepsByPhase).map(([phase, phaseSteps]: [string, any[]]) => {
            const completedInPhase = phaseSteps.filter(step => step.completed).length;
            const totalInPhase = phaseSteps.length;
            const phaseProgress = totalInPhase > 0 ? (completedInPhase / totalInPhase) * 100 : 0;

            return (
              <Card key={phase}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-github-dark">{phase}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-github-muted">
                        {completedInPhase}/{totalInPhase} steps
                      </span>
                      <div className="w-24">
                        <Progress value={phaseProgress} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {phaseSteps.map((step) => (
                      <div
                        key={step.id}
                        className={`border rounded-lg p-4 transition-all ${
                          step.completed ? 'bg-green-50 border-green-200' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <button
                            onClick={() => toggleStep(step.id)}
                            className="mt-1 text-github-blue hover:text-blue-700"
                          >
                            {step.completed ? (
                              <CheckSquare className="h-5 w-5 text-github-green" />
                            ) : (
                              <Square className="h-5 w-5" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className={`font-medium ${
                                step.completed ? 'text-github-green' : 'text-github-dark'
                              }`}>
                                {step.title}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {step.estimatedTime}
                                </Badge>
                                <Badge className={getPriorityColor(step.priority)}>
                                  {step.priority}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-github-muted mb-3">
                              {step.description}
                            </p>
                            
                            {step.instructions && (
                              <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value={`step-${step.id}`}>
                                  <AccordionTrigger className="text-sm text-github-blue hover:text-blue-700">
                                    View detailed instructions
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-2">
                                      {step.instructions.map((instruction: string, index: number) => (
                                        <div key={index} className="flex items-start space-x-2">
                                          <span className="text-github-muted text-sm">•</span>
                                          <span className="text-sm text-github-dark">{instruction}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="all-steps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Complete Task List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border ${
                      step.completed ? 'bg-green-50 border-green-200' : 'border-gray-200'
                    }`}
                  >
                    <button
                      onClick={() => toggleStep(step.id)}
                      className="text-github-blue hover:text-blue-700"
                    >
                      {step.completed ? (
                        <CheckSquare className="h-5 w-5 text-github-green" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${
                          step.completed ? 'text-github-green' : 'text-github-dark'
                        }`}>
                          {step.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {step.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {step.estimatedTime}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-github-muted">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(stepsByPhase).map(([phase, phaseSteps]: [string, any[]], phaseIndex) => (
                  <div key={phase} className="relative">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        phaseSteps.every(step => step.completed) 
                          ? 'bg-github-green' 
                          : phaseSteps.some(step => step.completed)
                            ? 'bg-orange-500'
                            : 'bg-gray-300'
                      }`}>
                        <span className="text-white text-sm font-medium">{phaseIndex + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-github-dark">{phase}</h3>
                        <p className="text-sm text-github-muted">
                          {phaseSteps.filter(step => step.completed).length} of {phaseSteps.length} completed
                        </p>
                      </div>
                    </div>
                    
                    <div className="ml-4 pl-4 border-l border-gray-200 space-y-3">
                      {phaseSteps.map((step) => (
                        <div key={step.id} className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            step.completed ? 'bg-github-green' : 'bg-gray-300'
                          }`} />
                          <span className={`text-sm ${
                            step.completed ? 'text-github-green' : 'text-github-dark'
                          }`}>
                            {step.title}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {step.estimatedTime}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}