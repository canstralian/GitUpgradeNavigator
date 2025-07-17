import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import Assessment from "@/pages/assessment";
import WorkflowDesigner from "@/pages/workflow-designer";
import Plans from "@/pages/plans";
import PlanDetail from "@/pages/plan-detail";
import Resources from "@/pages/resources";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/assessment" component={Assessment} />
        <Route path="/workflow-designer" component={WorkflowDesigner} />
        <Route path="/plans" component={Plans} />
        <Route path="/plans/:planId">
          {(params) => <PlanDetail planId={params.planId} />}
        </Route>
        <Route path="/resources" component={Resources} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

import { ErrorBoundary } from "@/components/error-boundary";

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
