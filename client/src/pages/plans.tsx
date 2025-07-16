import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PlanCard from "@/components/plans/plan-card";
import ProgressTracker from "@/components/shared/progress-tracker";
import { Plus } from "lucide-react";
import type { UpgradePlan } from "@shared/schema";

export default function Plans() {
  const { data: plans, isLoading } = useQuery<UpgradePlan[]>({
    queryKey: ["/api/upgrade-plans"],
  });

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
      
      <section className="mb-12">
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-github-dark">
                  Generated Upgrade Plans
                </CardTitle>
                <p className="text-github-muted mt-2">
                  Structured improvement roadmaps based on your assessment
                </p>
              </div>
              <Button className="bg-github-blue hover:bg-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Generate New Plan
              </Button>
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
                  <p className="text-sm">Complete an assessment to generate your first upgrade plan</p>
                </div>
                <Button className="bg-github-blue hover:bg-blue-700 text-white">
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
