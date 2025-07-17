import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ResourceCard from "@/components/resources/resource-card";
import { Plus } from "lucide-react";
import type { Resource } from "@shared/schema";

export default function Resources() {
  const [skillLevelFilter, setSkillLevelFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: resources, isLoading, error } = useQuery<Resource[]>({
    queryKey: ["/api/resources", { category: categoryFilter, skillLevel: skillLevelFilter }],
  });

  const filteredResources = useMemo(() => {
    if (!resources) return [];

    return resources.filter(resource => {
      const matchesCategory = categoryFilter === "all" || resource.category === categoryFilter;
      const matchesSkillLevel = skillLevelFilter === "all" || resource.skillLevel === skillLevelLevel;
      return matchesCategory && matchesSkillLevel;
    });
  }, [resources, categoryFilter, skillLevelFilter]);

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading resources...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600">
          Error loading resources. Please try again later.
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-12">
        <Card>
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-github-dark">
                  Resource Library
                </CardTitle>
                <p className="text-github-muted mt-2">
                  Tools, tutorials, and best practices for Git/GitHub improvement
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Select value={skillLevelFilter} onValueChange={setSkillLevelFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Skill Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skill Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="workflows">Workflows</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="automation">Automation</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {filteredResources?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-github-muted mb-4">No resources found matching your filters.</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSkillLevelFilter("all");
                    setCategoryFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources?.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            )}

            <div className="mt-8 text-center">
              <Button variant="outline" className="border-github-muted text-github-dark hover:bg-gray-50">
                <Plus className="mr-2 h-4 w-4" />
                Load More Resources
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}