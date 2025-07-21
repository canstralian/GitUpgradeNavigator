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
      <Card className="card-enhanced overflow-hidden">
        <div className="bg-gradient-subtle p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-github-dark">Current Progress</h3>
            <div className="text-sm font-medium text-github-muted bg-github-surface px-3 py-1 rounded-full">
              Step {currentStep} of {steps.length}
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Desktop view */}
            <div className="hidden md:flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${
                      step.completed 
                        ? 'bg-github-green shadow-green-200 pulse-glow' 
                        : step.id === currentStep 
                          ? 'bg-github-blue shadow-blue-200 pulse-glow' 
                          : 'bg-gray-200 shadow-gray-200'
                    }`}>
                      {step.completed ? (
                        <Check className="h-6 w-6 text-white animate-in zoom-in-50" />
                      ) : (
                        <span className={`text-lg font-bold ${
                          step.id === currentStep ? 'text-white' : 'text-github-muted'
                        }`}>
                          {step.id}
                        </span>
                      )}
                      {step.id === currentStep && (
                        <div className="absolute -inset-1 bg-github-blue rounded-2xl opacity-20 animate-ping"></div>
                      )}
                    </div>
                    <span className={`text-sm font-semibold text-center min-w-0 ${
                      step.id === currentStep ? 'text-github-blue' : step.completed ? 'text-github-green' : 'text-github-muted'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 transition-all duration-500 ${
                      step.completed ? 'bg-github-green' : 'bg-gray-200'
                    }`}>
                      <div className={`h-full transition-all duration-1000 ${
                        step.completed ? 'w-full bg-github-green' : 'w-0'
                      }`}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile view */}
            <div className="md:hidden space-y-4">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 ${
                    step.completed 
                      ? 'bg-github-green' 
                      : step.id === currentStep 
                        ? 'bg-github-blue' 
                        : 'bg-gray-200'
                  }`}>
                    {step.completed ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <span className={`text-sm font-bold ${
                        step.id === currentStep ? 'text-white' : 'text-github-muted'
                      }`}>
                        {step.id}
                      </span>
                    )}
                  </div>
                  <span className={`font-semibold ${
                    step.id === currentStep ? 'text-github-blue' : step.completed ? 'text-github-green' : 'text-github-muted'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-primary h-3 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs font-medium text-github-muted">
              <span>0%</span>
              <span className="text-github-blue font-bold">
                {Math.round((currentStep / steps.length) * 100)}%
              </span>
              <span>100%</span>
            </div>
          </div>
      </Card>
    </section>
  );
}
