import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgressTracker from "@/components/shared/progress-tracker";
import { FileText, Users, ServerCog, Download, Share2, Calendar, HelpCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <section className="mb-12">
        <Card className="p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-github-dark mb-4">
              Git & GitHub Upgrade Planning Tool
            </h2>
            <p className="text-lg text-github-muted mb-8 max-w-3xl mx-auto">
              Assess your current Git/GitHub setup and create comprehensive improvement roadmaps with 
              step-by-step instructions, workflow recommendations, and team training plans.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/assessment">
                <Button className="bg-github-blue hover:bg-blue-700 text-white">
                  <FileText className="mr-2 h-4 w-4" />
                  Start Assessment
                </Button>
              </Link>
              <Link href="/resources">
                <Button variant="outline" className="border-github-muted text-github-dark hover:bg-gray-50">
                  <FileText className="mr-2 h-4 w-4" />
                  View Resources
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>

      {/* Progress Tracker */}
      <ProgressTracker currentStep={1} />

      {/* Quick Actions */}
      <section className="mb-12">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-github-dark mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="flex items-center space-x-3 p-4 h-auto justify-start"
            >
              <Download className="h-5 w-5 text-github-blue" />
              <div className="text-left">
                <div className="font-medium text-sm text-github-dark">Export Plan</div>
                <div className="text-xs text-github-muted">Download PDF report</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center space-x-3 p-4 h-auto justify-start"
            >
              <Share2 className="h-5 w-5 text-github-blue" />
              <div className="text-left">
                <div className="font-medium text-sm text-github-dark">Share Plan</div>
                <div className="text-xs text-github-muted">Send to team members</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center space-x-3 p-4 h-auto justify-start"
            >
              <Calendar className="h-5 w-5 text-github-blue" />
              <div className="text-left">
                <div className="font-medium text-sm text-github-dark">Schedule Review</div>
                <div className="text-xs text-github-muted">Set up progress check</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center space-x-3 p-4 h-auto justify-start"
            >
              <HelpCircle className="h-5 w-5 text-github-blue" />
              <div className="text-left">
                <div className="font-medium text-sm text-github-dark">Get Help</div>
                <div className="text-xs text-github-muted">Contact support</div>
              </div>
            </Button>
          </div>
        </Card>
      </section>

      {/* Feature Overview */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-github-blue rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-github-dark">Interactive Assessment</h3>
            </div>
            <p className="text-github-muted text-sm mb-4">
              Evaluate your current Git/GitHub setup with comprehensive forms covering repository settings, 
              team collaboration, and workflow practices.
            </p>
            <Link href="/assessment">
              <Button variant="outline" size="sm" className="w-full">
                Start Assessment
              </Button>
            </Link>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-github-green rounded-lg flex items-center justify-center">
                <ServerCog className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-github-dark">Workflow Designer</h3>
            </div>
            <p className="text-github-muted text-sm mb-4">
              Design and visualize your optimal Git workflow strategy with interactive diagrams 
              and implementation guidelines.
            </p>
            <Link href="/workflow-designer">
              <Button variant="outline" size="sm" className="w-full">
                Design Workflow
              </Button>
            </Link>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-github-muted rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-github-dark">Resource Library</h3>
            </div>
            <p className="text-github-muted text-sm mb-4">
              Access curated tools, tutorials, and best practices organized by skill level 
              and category for comprehensive learning.
            </p>
            <Link href="/resources">
              <Button variant="outline" size="sm" className="w-full">
                Browse Resources
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </main>
  );
}
