import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertAssessmentSchema } from "@shared/schema";
import { GitBranch, Users, Info } from "lucide-react";

const formSchema = insertAssessmentSchema.extend({
  codeReviewProcess: z.object({
    requiredReviews: z.boolean().default(false),
    automatedChecks: z.boolean().default(false),
    codeQualityGates: z.boolean().default(false),
  }),
  repositorySettings: z.object({
    branchProtection: z.boolean().default(false),
    mergeRestrictions: z.boolean().default(false),
    statusChecks: z.boolean().default(false),
  }),
  collaborationTools: z.object({
    issueTracking: z.boolean().default(false),
    projectManagement: z.boolean().default(false),
    documentation: z.boolean().default(false),
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function AssessmentForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamSize: "",
      branchingStrategy: "",
      branchProtection: "",
      skillLevel: "",
      codeReviewProcess: {
        requiredReviews: false,
        automatedChecks: false,
        codeQualityGates: false,
      },
      repositorySettings: {
        branchProtection: false,
        mergeRestrictions: false,
        statusChecks: false,
      },
      collaborationTools: {
        issueTracking: false,
        projectManagement: false,
        documentation: false,
      },
    },
  });

  const createAssessment = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/assessments", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Assessment completed!",
        description: "Your assessment has been saved. Redirecting to workflow designer...",
      });
      setTimeout(() => {
        setLocation("/workflow-designer");
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createAssessment.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Repository Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-github-dark">
                <GitBranch className="mr-2 h-5 w-5 text-github-blue" />
                Repository Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="branchProtection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Protection Rules</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select protection level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None implemented</SelectItem>
                        <SelectItem value="basic">Basic protection</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive protection</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branchingStrategy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Branching Strategy</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="gitflow" id="gitflow" />
                          <label htmlFor="gitflow" className="text-sm">GitFlow</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="trunk" id="trunk" />
                          <label htmlFor="trunk" className="text-sm">Trunk-based development</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="feature" id="feature" />
                          <label htmlFor="feature" className="text-sm">Feature branches</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <FormLabel>Repository Configuration</FormLabel>
                <FormField
                  control={form.control}
                  name="repositorySettings.branchProtection"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Branch protection enabled
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="repositorySettings.mergeRestrictions"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Merge restrictions configured
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="repositorySettings.statusChecks"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Status checks required
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Team Collaboration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-github-dark">
                <Users className="mr-2 h-5 w-5 text-github-blue" />
                Team Collaboration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-5">1-5 developers</SelectItem>
                        <SelectItem value="6-15">6-15 developers</SelectItem>
                        <SelectItem value="16+">16+ developers</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skillLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Skill Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select skill level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <FormLabel>Code Review Process</FormLabel>
                <FormField
                  control={form.control}
                  name="codeReviewProcess.requiredReviews"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Required PR reviews
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="codeReviewProcess.automatedChecks"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Automated CI/CD checks
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="codeReviewProcess.codeQualityGates"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Code quality gates
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="currentChallenges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Challenges (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe any current challenges with your Git/GitHub workflow..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div className="text-sm text-github-muted flex items-center">
            <Info className="mr-2 h-4 w-4" />
            Assessment will help generate personalized recommendations
          </div>
          <Button
            type="submit"
            className="bg-github-blue hover:bg-blue-700 text-white"
            disabled={createAssessment.isPending}
          >
            {createAssessment.isPending ? "Saving..." : "Continue to Workflow Designer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
