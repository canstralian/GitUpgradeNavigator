import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MoreVertical, Check, FileText, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { UpgradePlan } from "@shared/schema";

interface PlanCardProps {
  plan: UpgradePlan;
}

export default function PlanCard({ plan }: PlanCardProps) {
  const steps = plan.steps as any[];
  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Complete';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  return (
    <Card className="p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-github-dark">{plan.title}</h4>
          <p className="text-sm text-github-muted mt-1">
            Generated {formatDistanceToNow(new Date(plan.createdAt))} ago
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(plan.status)}>
            {getStatusText(plan.status)}
          </Badge>
          <Button variant="ghost" size="sm" className="text-github-muted hover:text-github-dark">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {steps.slice(0, 3).map((step, index) => (
          <div key={step.id} className="flex items-center space-x-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              step.completed 
                ? 'bg-github-green' 
                : index === 0 
                  ? 'bg-github-blue' 
                  : 'bg-gray-200'
            }`}>
              {step.completed ? (
                <Check className="text-white h-3 w-3" />
              ) : (
                <span className={`text-xs ${
                  index === 0 ? 'text-white' : 'text-github-muted'
                }`}>
                  {index + 1}
                </span>
              )}
            </div>
            <span className={`text-sm ${
              step.completed ? 'text-github-dark' : 'text-github-muted'
            }`}>
              {step.title}
            </span>
          </div>
        ))}
        
        {steps.length > 3 && (
          <div className="text-xs text-github-muted ml-8">
            ... and {steps.length - 3} more steps
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Progress value={progressPercentage} className="w-24 h-2" />
          <span className="text-xs text-github-muted">
            {completedSteps}/{totalSteps} steps
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-github-blue hover:bg-github-blue hover:text-white">
            <FileText className="h-4 w-4 mr-1" />
            Details
          </Button>
          {plan.status === 'completed' && (
            <Button variant="ghost" size="sm" className="text-github-blue hover:bg-github-blue hover:text-white">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
