import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { WorkflowTemplate } from "@shared/schema";

interface WorkflowDiagramProps {
  template: WorkflowTemplate;
}

export default function WorkflowDiagram({ template }: WorkflowDiagramProps) {
  const branches = template.branches as any;
  const advantages = template.advantages as string[];

  return (
    <Card className="p-6 bg-gray-50 border border-gray-200">
      <div className="space-y-6">
        {/* Branch Diagram */}
        <div className="space-y-4">
          {Object.entries(branches).map(([key, branch]: [string, any]) => (
            <div key={key} className="flex items-center space-x-4">
              <div className="w-16 text-xs text-github-muted font-mono">
                {branch.name}
              </div>
              <div className="flex-1 flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: branch.color }}
                />
                <div 
                  className="flex-1 h-0.5" 
                  style={{ backgroundColor: branch.color }}
                />
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: branch.color }}
                />
                <div 
                  className="flex-1 h-0.5" 
                  style={{ backgroundColor: branch.color }}
                />
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: branch.color }}
                />
              </div>
              <div className="text-xs text-github-muted w-32">
                {branch.description}
              </div>
            </div>
          ))}
        </div>

        {/* Legend and Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {Object.entries(branches).map(([key, branch]: [string, any]) => (
                <div key={key} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: branch.color }}
                  />
                  <span className="text-xs text-github-muted">{branch.name}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="text-github-blue hover:bg-github-blue hover:text-white">
              View Implementation Guide
            </Button>
          </div>

          {/* Advantages */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-github-dark">Key Advantages:</h5>
            <div className="flex flex-wrap gap-2">
              {advantages.map((advantage, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {advantage}
                </Badge>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div className="mt-4 space-y-2">
            <h5 className="text-sm font-medium text-github-dark">Recommended Rules:</h5>
            <div className="text-xs text-github-muted space-y-1">
              {template.rules && Object.entries(template.rules as any).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${value ? 'bg-github-green' : 'bg-gray-300'}`} />
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}: {value ? 'Enabled' : 'Disabled'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
