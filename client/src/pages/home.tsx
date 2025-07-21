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
        <Card className="card-enhanced bg-gradient-subtle border-none overflow-hidden">
          <div className="relative p-12 text-center">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-primary opacity-5 animate-pulse"></div>
            <div className="absolute top-4 left-4 w-20 h-20 bg-github-blue opacity-10 rounded-full animate-bounce"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-github-green opacity-10 rounded-full animate-bounce delay-300"></div>
            
            <div className="relative z-10">
              <h1 className="gradient-text mb-6">
                Git & GitHub Upgrade Planning Tool
              </h1>
              <p className="text-xl text-github-muted mb-10 max-w-4xl mx-auto leading-relaxed">
                Transform your development workflow with personalized assessments, visual workflow design, 
                and comprehensive improvement roadmaps tailored to your team's needs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                <Link href="/assessment" className="flex-1">
                  <Button className="w-full bg-gradient-primary hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12">
                    <FileText className="mr-2 h-5 w-5" />
                    Start Assessment
                  </Button>
                </Link>
                <Link href="/resources" className="flex-1">
                  <Button variant="outline" className="w-full border-github-blue text-github-blue hover:bg-github-blue-light transition-all duration-300 h-12">
                    <FileText className="mr-2 h-5 w-5" />
                    View Resources
                  </Button>
                </Link>
              </div>
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

          <Card className="card-interactive group">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <div className="w-14 h-14 bg-github-green rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <ServerCog className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-github-orange rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-github-dark mb-1">Workflow Designer</h3>
                  <span className="text-xs font-medium text-github-blue bg-github-blue-light px-2 py-1 rounded-full">Interactive</span>
                </div>
              </div>
              <p className="text-github-muted mb-6 leading-relaxed">
                Design and visualize your optimal Git workflow strategy with interactive diagrams 
                and implementation guidelines.
              </p>
              <Link href="/workflow-designer">
                <Button variant="outline" className="w-full border-github-green text-github-green hover:bg-github-green hover:text-white transition-all duration-300 h-11">
                  <ServerCog className="mr-2 h-4 w-4" />
                  Design Workflow
                </Button>
              </Link>
            </div>
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
