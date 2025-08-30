import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Database, 
  Code, 
  BarChart3, 
  Users, 
  Zap, 
  Shield,
  Rocket,
  Lightbulb
} from "lucide-react"
import Link from "next/link"

const solutions = [
  {
    icon: Database,
    title: "Database Prototyping",
    description: "Quickly design and test database schemas without the overhead of production infrastructure.",
    features: ["Flexible schema design", "Rapid iteration", "No setup required", "Instant deployment"],
    useCase: "Perfect for developers exploring new data models or testing concepts."
  },
  {
    icon: Code,
    title: "API Development",
    description: "Build and test APIs with automatic endpoint generation and real-time data.",
    features: ["Auto-generated endpoints", "Real-time data sync", "RESTful APIs", "Webhook support"],
    useCase: "Ideal for frontend developers who need a backend quickly."
  },
  {
    icon: BarChart3,
    title: "Data Visualization",
    description: "Create custom dashboards and data views to understand your information better.",
    features: ["Custom views", "Real-time charts", "Data filtering", "Export capabilities"],
    useCase: "Great for analysts and product managers exploring data patterns."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together on data projects with role-based access and shared workspaces.",
    features: ["Role management", "Shared collections", "Activity tracking", "Team permissions"],
    useCase: "Perfect for small teams working on data-driven projects."
  },
  {
    icon: Zap,
    title: "Rapid Prototyping",
    description: "Go from idea to working prototype in minutes, not days.",
    features: ["Instant setup", "No configuration", "Ready-to-use", "Scalable foundation"],
    useCase: "Excellent for startups and MVPs that need to validate ideas quickly."
  },
  {
    icon: Shield,
    title: "Development & Testing",
    description: "Safe environment for testing new features and integrations.",
    features: ["Isolated testing", "No production risk", "Easy rollbacks", "Development tools"],
    useCase: "Perfect for developers testing new features or integrations."
  }
]

const industries = [
  {
    icon: Rocket,
    title: "Startups & MVPs",
    description: "Get your product to market faster with instant backend infrastructure."
  },
  {
    icon: Lightbulb,
    title: "Side Projects",
    description: "Turn your ideas into reality without the complexity of traditional databases."
  },
  {
    icon: Code,
    title: "Learning & Education",
    description: "Perfect environment for learning database design and API development."
  }
]

export default function SolutionsPage() {
  return (
    <>
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Solutions for Every Need
            </h1>
            <p className="text-lg text-muted-foreground">
              Basin provides flexible solutions for development, prototyping, and learning. 
              Choose the approach that fits your project best.
            </p>
          </div>

          {/* Solutions Grid */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Core Solutions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {solutions.map((solution, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <solution.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{solution.title}</CardTitle>
                    <CardDescription className="text-base">
                      {solution.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-2">Key Features:</h4>
                      <ul className="space-y-1">
                        {solution.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="text-sm text-muted-foreground flex items-center">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-2">Best For:</h4>
                      <p className="text-sm text-muted-foreground">{solution.useCase}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Perfect For These Use Cases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {industries.map((industry, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow text-center">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <industry.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{industry.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {industry.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="border-0 shadow-lg bg-muted/50 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
                <CardDescription className="text-lg">
                  Choose the solution that fits your needs and start building today.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="/login">
                      Start Building Free
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/docs">
                      View Documentation
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  No credit card required • Free tier available • Instant setup
                </p>
              </CardContent>
            </Card>
          </div>
                  </div>
        </main>
      </>
  )
}
