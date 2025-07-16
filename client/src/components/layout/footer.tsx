import { Link } from "wouter";

export default function Footer() {
  const footerSections = [
    {
      title: "Resources",
      links: [
        { href: "/resources", label: "Documentation" },
        { href: "/resources", label: "Best Practices" },
        { href: "/resources", label: "Training Materials" },
        { href: "/resources", label: "Video Tutorials" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "#", label: "Help Center" },
        { href: "#", label: "Contact Us" },
        { href: "#", label: "Community Forum" },
        { href: "#", label: "Status Page" },
      ],
    },
    {
      title: "Tools",
      links: [
        { href: "/assessment", label: "Assessment Tool" },
        { href: "/workflow-designer", label: "Workflow Designer" },
        { href: "/plans", label: "Plan Generator" },
        { href: "/plans", label: "Progress Tracker" },
      ],
    },
    {
      title: "About",
      links: [
        { href: "#", label: "Privacy Policy" },
        { href: "#", label: "Terms of Service" },
        { href: "#", label: "Cookie Policy" },
        { href: "#", label: "License" },
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-github-dark mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2 text-sm text-github-muted">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <span className="hover:text-github-dark transition-colors">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-github-muted">
          <p>&copy; 2024 Git Upgrade Planner. Built with ❤️ for development teams.</p>
        </div>
      </div>
    </footer>
  );
}
