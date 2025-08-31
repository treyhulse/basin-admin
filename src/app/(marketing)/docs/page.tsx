import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Code, 
  Database, 
  Key, 
  Users, 
  BarChart3,
  Zap,
  ArrowRight,
  Play,
  FileText,
  Github,
  MessageSquare
} from "lucide-react"
import Link from "next/link"

const quickStart = [
  {
    step: "1",
    title: "Create Account",
    description: "Sign up for free and get instant access to Basin",
    action: "Sign Up",
    href: "/login"
  },
  {
    step: "2",
    title: "Create Your First Collection",
    description: "Design your data structure with our intuitive interface",
    action: "View Guide",
    href: "#collections"
  },
  {
    step: "3",
    title: "Generate API Keys",
    description: "Get your API credentials to start integrating",
    action: "Learn More",
    href: "#api-keys"
  },
  {
    step: "4",
    title: "Start Building",
    description: "Use our APIs to build your application",
    action: "API Reference",
    href: "#api-reference"
  }
]

const docSections = [
  {
    icon: Database,
    title: "Collections",
    description: "Learn how to create and manage your data collections",
    topics: ["Schema Design", "Data Types", "Relationships", "Validation"],
    href: "#collections"
  },
  {
    icon: Code,
    title: "API Reference",
    description: "Complete API documentation with examples and SDKs",
    topics: ["REST API", "Authentication", "Endpoints", "SDKs"],
    href: "#api-reference"
  },
  {
    icon: Key,
    title: "API Keys",
    description: "Manage your API keys and security settings",
    topics: ["Key Management", "Permissions", "Security", "Rate Limits"],
    href: "#api-keys"
  },
  {
    icon: BarChart3,
    title: "Data Views",
    description: "Create custom views and dashboards for your data",
    topics: ["View Builder", "Filters", "Charts", "Export"],
    href: "#data-views"
  },
  {
    icon: Users,
    title: "User Management",
    description: "Manage team members and role-based access",
    topics: ["Team Setup", "Roles", "Permissions", "Invitations"],
    href: "#user-management"
  },
  {
    icon: Zap,
    title: "Integrations",
    description: "Connect Basin with your favorite tools and services",
    topics: ["Webhooks", "Third-party Apps", "Custom Integrations"],
    href: "#integrations"
  }
]

const resources = [
  {
    icon: Play,
    title: "Video Tutorials",
    description: "Step-by-step video guides for common tasks",
    href: "#tutorials"
  },
  {
    icon: FileText,
    title: "Code Examples",
    description: "Ready-to-use code snippets in multiple languages",
    href: "#examples"
  },
  {
    icon: Github,
    title: "Open Source",
    description: "Contribute to Basin and view our source code",
    href: "#github"
  },
  {
    icon: MessageSquare,
    title: "Community",
    description: "Join our community for help and discussions",
    href: "#community"
  }
]

export default function DocsPage() {
  return (
    <>
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Documentation
            </h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to get started with Basin. From quick start guides 
              to advanced API documentation.
            </p>
          </div>

          {/* Quick Start */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Quick Start Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStart.map((item, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-primary">{item.step}</span>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={item.href}>
                        {item.action}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Documentation Sections */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Documentation Sections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {docSections.map((section, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow group">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <section.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <CardDescription className="text-base">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-2">Topics covered:</h4>
                      <ul className="space-y-1">
                        {section.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="text-sm text-muted-foreground flex items-center">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button variant="ghost" className="w-full group-hover:bg-primary/10" asChild>
                      <Link href={section.href}>
                        View Documentation
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Additional Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resources.map((resource, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow text-center">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <resource.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm mb-4">
                      {resource.description}
                    </CardDescription>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={resource.href}>
                        Explore
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Search and Navigation */}
          <div className="mb-20">
            <Card className="border-0 shadow-lg bg-muted/50">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Can&apos;t find what you&apos;re looking for?</CardTitle>
                <CardDescription className="text-lg">
                  Search our documentation or get help from our team.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <Button variant="outline" size="lg" className="flex-1">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Search Docs
                  </Button>
                  <Button size="lg" className="flex-1" asChild>
                    <Link href="/contact">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Get Help
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Need something specific? Our team is here to help you succeed.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="border-0 shadow-lg bg-muted/50 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Ready to Start Building?</CardTitle>
                <CardDescription className="text-lg">
                  Create your account and start building with Basin today.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="/login">
                      Get Started Free
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/solutions">
                      View Solutions
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  No credit card required • Free forever plan • Instant setup
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
