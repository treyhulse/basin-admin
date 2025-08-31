import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for learning and small projects",
    features: [
      "Up to 3 collections",
      "1,000 records per collection",
      "Basic API access",
      "Community support",
      "1 user account"
    ],
    limitations: [
      "No advanced features",
      "Limited storage",
      "Basic analytics"
    ],
    cta: "Get Started Free",
    popular: false,
    href: "/login"
  },
  {
    name: "Developer",
    price: "$19",
    period: "per month",
    description: "Great for developers and small teams",
    features: [
      "Up to 20 collections",
      "100,000 records per collection",
      "Full API access",
      "Webhook support",
      "Advanced analytics",
      "Up to 5 team members",
      "Priority support"
    ],
    limitations: [
      "No enterprise features",
      "Limited custom domains"
    ],
    cta: "Start Developer Plan",
    popular: true,
    href: "/login"
  },
  {
    name: "Professional",
    price: "$99",
    period: "per month",
    description: "For growing teams and production use",
    features: [
      "Unlimited collections",
      "Unlimited records",
      "Custom domains",
      "Advanced security",
      "Team management",
      "Advanced analytics",
      "Dedicated support",
      "SLA guarantees"
    ],
    limitations: [
      "No custom integrations",
      "Standard compliance"
    ],
    cta: "Start Professional Plan",
    popular: false,
    href: "/login"
  }
]

const addOns = [
  {
    name: "Additional Storage",
    price: "$0.10",
    description: "per GB per month",
    details: "Scale your storage as needed"
  },
  {
    name: "Team Members",
    price: "$5",
    description: "per user per month",
    details: "Add more team members to your workspace"
  },
  {
    name: "Custom Integrations",
    price: "Custom",
    description: "pricing",
    details: "Build custom integrations for your specific needs"
  }
]

export default function PricingPage() {
  return (
    <>
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your needs. All plans include our core features 
              with no hidden fees or surprises.
            </p>
          </div>

          {/* Pricing Tiers */}
          <div className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`border-0 shadow-sm hover:shadow-md transition-shadow ${
                    plan.popular ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="text-center pt-4">
                      <Badge className="bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-2">{plan.period}</span>
                    </div>
                    <CardDescription className="text-base mt-2">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-3">What&apos;s included:</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm">
                            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {plan.limitations.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm text-foreground mb-3">Limitations:</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, limitationIndex) => (
                            <li key={limitationIndex} className="flex items-center text-sm">
                              <X className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                              <span className="text-muted-foreground">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <Button className="w-full" asChild>
                      <Link href={plan.href}>
                        {plan.cta}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Add-ons & Extras
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {addOns.map((addOn, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow text-center">
                  <CardHeader>
                    <CardTitle className="text-xl">{addOn.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">{addOn.price}</span>
                      <span className="text-muted-foreground ml-1">{addOn.description}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {addOn.details}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I change plans at any time?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                    and we&apos;ll prorate any charges.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is there a free trial?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our Free plan is available indefinitely with no time limits. You can start building 
                    immediately without any commitment.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What happens if I exceed my plan limits?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We&apos;ll notify you when you&apos;re approaching limits. You can either upgrade your plan 
                    or purchase additional add-ons to continue growing.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="border-0 shadow-lg bg-muted/50 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
                <CardDescription className="text-lg">
                  Start with our free plan and scale as you grow.
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
                    <Link href="/contact">
                      Contact Sales
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
