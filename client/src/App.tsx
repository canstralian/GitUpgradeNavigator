import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import Assessment from "@/pages/assessment";
import WorkflowDesigner from "@/pages/workflow-designer";
import Plans from "@/pages/plans";
import Resources from "@/pages/resources";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-github-bg">
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/assessment" component={Assessment} />
        <Route path="/workflow-designer" component={WorkflowDesigner} />
        <Route path="/plans" component={Plans} />
        <Route path="/resources" component={Resources} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
