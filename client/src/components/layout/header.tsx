import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Download, Github, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";

export default function Header() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: "/assessment", label: "Assessment" },
    { href: "/workflow-designer", label: "Workflow Designer" },
    { href: "/plans", label: "Plans" },
    { href: "/resources", label: "Resources" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Github className="h-8 w-8 text-github-dark" />
              <h1 className="text-xl font-semibold text-github-dark">
                Git Upgrade Planner
              </h1>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`transition-colors ${
                    location === link.href
                      ? "text-github-blue"
                      : "text-github-muted hover:text-github-dark"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="border-github-muted hover:bg-github-muted/10"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button className="bg-github-blue hover:bg-blue-700 text-white">
              <Download className="mr-2 h-4 w-4" />
              Export Plan
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
