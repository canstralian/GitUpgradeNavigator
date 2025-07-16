import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AssessmentForm from "@/components/assessment/assessment-form";
import ProgressTracker from "@/components/shared/progress-tracker";

export default function Assessment() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProgressTracker currentStep={1} />
      
      <section className="mb-12">
        <Card>
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-xl font-semibold text-github-dark">
              Current Setup Assessment
            </CardTitle>
            <p className="text-github-muted mt-2">
              Evaluate your existing Git/GitHub configuration and team practices
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <AssessmentForm />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
