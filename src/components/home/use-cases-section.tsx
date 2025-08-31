'use client';

import { useState } from 'react';
import { Database, Code, Rocket, Users, ShieldCheck, Zap, AppWindow } from 'lucide-react';

interface UseCase {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  features: string[];
  benefits: string[];
}

const useCases: UseCase[] = [
  {
    id: 'personal-projects',
    title: 'Personal Projects',
    description: 'Build and manage your side projects, portfolio sites, or creative experiments with a professional admin interface.',
    icon: Rocket,
    iconColor: 'text-primary',
    features: ['Portfolio management', 'Side project dashboards', 'Creative project tracking'],
    benefits: ['Professional admin interface', 'Easy project organization', 'Scalable as you grow']
  },
  {
    id: 'database-modeling',
    title: 'Database Modeling',
    description: 'Design your data structure visually and get instant APIs. Perfect for prototyping database schemas and relationships.',
    icon: Database,
    iconColor: 'text-primary',
    features: ['Visual schema design', 'Relationship modeling', 'Data validation rules'],
    benefits: ['Instant API generation', 'Visual data modeling', 'Built-in validation']
  },
  {
    id: 'api-prototyping',
    title: 'API Prototyping',
    description: 'Create REST APIs instantly from your data models. Test endpoints, manage authentication, and iterate quickly.',
    icon: Code,
    iconColor: 'text-primary',
    features: ['Instant REST APIs', 'Authentication & permissions', 'API key management'],
    benefits: ['Zero-config APIs', 'Built-in security', 'Rapid iteration']
  },
  {
    id: 'team-collaboration',
    title: 'Team Collaboration',
    description: 'Work together with role-based access control, user management, and secure multi-tenant architecture.',
    icon: Users,
    iconColor: 'text-primary',
    features: ['Role-based access', 'User management', 'Multi-tenant support'],
    benefits: ['Secure collaboration', 'Granular permissions', 'Team scalability']
  },
  {
    id: 'security-compliance',
    title: 'Security & Compliance',
    description: 'Enterprise-grade security with JWT authentication, permission management, and audit logging.',
    icon: ShieldCheck,
    iconColor: 'text-primary',
    features: ['JWT authentication', 'Permission management', 'Audit logging'],
    benefits: ['Production ready', 'Compliance friendly', 'Enterprise security']
  },
  {
    id: 'customer-portal',
    title: 'Customer Portal',
    description: 'Create a customer portal with role-based access, user management, and secure multi-tenant architecture.',
    icon: AppWindow,
    iconColor: 'text-primary',
    features: ['Role-based access', 'User management', 'Multi-tenant support'],
    benefits: ['Secure customer access', 'Granular permissions', 'Team scalability']
  },
  {
    id: 'ai-integration',
    title: 'AI Integration',
    description: 'Integrate AI models and tools through MCP servers. Connect GPT-4, Claude, and custom models.',
    icon: Zap,
    iconColor: 'text-primary',
    features: ['MCP server support', 'AI model integration', 'Custom tool creation'],
    benefits: ['AI-powered workflows', 'Model agnostic', 'Extensible architecture']
  }
];

export function UseCasesSection() {
  const [hoveredUseCase, setHoveredUseCase] = useState<UseCase | null>(useCases[0]);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Perfect For Every Use Case
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you&apos;re building your next big idea or scaling existing applications, 
              Basin Admin adapts to your needs.
            </p>
          </div>
          
          <div className="bg-background/50 backdrop-blur-sm rounded-2xl border border-border/50 p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column - Use Case List */}
              <div className="flex flex-col">
                {useCases.map((useCase, index) => (
                  <div
                    key={useCase.id}
                    className={`flex-1 p-3 border-l-4 border-transparent cursor-pointer transition-all duration-200 ${
                      hoveredUseCase?.id === useCase.id
                        ? 'border-l-primary bg-primary/5'
                        : 'hover:border-l-primary/30 hover:bg-background/30'
                    } ${index !== useCases.length - 1 ? 'border-b border-border/50' : ''}`}
                    onMouseEnter={() => setHoveredUseCase(useCase)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg bg-background/80 flex items-center justify-center ${useCase.iconColor}`}>
                        <useCase.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{useCase.title}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column - Use Case Details */}
              <div className="lg:col-span-2 lg:pl-8 flex flex-col">
                {hoveredUseCase && (
                  <div className="sticky top-8 h-full">
                    <div className="bg-background/80 rounded-xl border p-8 shadow-sm h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-center space-x-4 mb-6">
                        <div className={`w-16 h-16 rounded-xl bg-muted flex items-center justify-center ${hoveredUseCase.iconColor}`}>
                          <hoveredUseCase.icon className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-foreground">{hoveredUseCase.title}</h3>
                          <p className="text-muted-foreground">{hoveredUseCase.description}</p>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-8 flex-1">
                        <h4 className="font-semibold text-foreground mb-3">Key Features</h4>
                        <div className="space-y-2">
                          {hoveredUseCase.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="mt-auto">
                        <h4 className="font-semibold text-foreground mb-3">Why Choose This</h4>
                        <div className="space-y-2">
                          {hoveredUseCase.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-muted-foreground">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
