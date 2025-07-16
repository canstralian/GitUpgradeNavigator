import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface ProgressTrackerProps {
  currentStep: number;
}

export default function ProgressTracker({ currentStep }: ProgressTrackerProps) {
  const steps = [
    { id: 1, title: "Assessment", completed: currentStep > 1 },
    { id: 2, title: "Workflow Design", completed: currentStep > 2 },
    { id: 3, title: "Plan Generation", completed: currentStep > 3 },
    { id: 4, title: "Implementation", completed: currentStep > 4 },
  ];

  return (
    <section className="mb-8">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-github-dark mb-4">Current Progress</h3>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-8">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-github-green' 
                    : step.id === currentStep 
                      ? 'bg-github-blue' 
                      : 'bg-gray-200'
                }`}>
                  {step.completed ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <span className={`text-sm font-medium ${
                      step.id === currentStep ? 'text-white' : 'text-github-muted'
                    }`}>
                      {step.id}
                    </span>
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  step.id === currentStep ? 'text-github-dark' : 'text-github-muted'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="text-sm text-github-muted">
            Step {currentStep} of {steps.length}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-github-blue h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </Card>
    </section>
  );
}
