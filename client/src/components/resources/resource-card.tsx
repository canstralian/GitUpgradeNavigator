import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Download, Clock, Star } from "lucide-react";
import type { Resource } from "@shared/schema";

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-700';
      case 'intermediate':
        return 'bg-orange-100 text-orange-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tutorial':
        return 'bg-github-blue';
      case 'tool':
        return 'bg-github-green';
      case 'best-practice':
        return 'bg-red-500';
      case 'training':
        return 'bg-purple-500';
      default:
        return 'bg-github-muted';
    }
  };

  const resourceConfig = {
    tutorial: {
      actionIcon: ExternalLink,
      actionText: "Read Guide",
      metricIcon: Star,
      metricIconClass: "h-4 w-4 text-yellow-400",
      metricText: `${resource.rating}/5 (${resource.downloadCount} reviews)`
    },
    tool: {
      actionIcon: Download,
      actionText: "Download",
      metricIcon: Download,
      metricIconClass: "h-4 w-4 text-github-muted",
      metricText: `${resource.downloadCount} downloads`
    },
    training: {
      actionIcon: Download,
      actionText: "Download",
      metricIcon: Clock,
      metricIconClass: "h-4 w-4 text-github-muted",
      metricText: `${resource.downloadCount} downloads`
    },
    default: {
      actionIcon: ExternalLink,
      actionText: "View Guide",
      metricIcon: Clock,
      metricIconClass: "h-4 w-4 text-github-muted",
      metricText: `${resource.downloadCount} views`
    }
  };

  const config = resourceConfig[resource.type] || resourceConfig.default;
  const ActionIcon = config.actionIcon;
  const MetricIcon = config.metricIcon;

  return (
    <Card className="p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(resource.type)}`}>
            <i className={`${resource.icon} text-white`} />
          </div>
          <div>
            <h4 className="font-semibold text-github-dark">{resource.title}</h4>
            <p className="text-xs text-github-muted capitalize">{resource.type}</p>
          </div>
        </div>
        <Badge className={getSkillLevelColor(resource.skillLevel)}>
          {resource.skillLevel}
        </Badge>
      </div>

      <p className="text-sm text-github-muted mb-4">{resource.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MetricIcon className={config.metricIconClass} />
          <span className="text-sm text-github-muted">{config.metricText}</span>
        </div>
        <Button variant="ghost" size="sm" className="text-github-blue hover:bg-github-blue hover:text-white">
          <ActionIcon className="h-4 w-4 mr-1" />
          {config.actionText}
        </Button>
      </div>
    </Card>
  );
}
