'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { Database, Settings, Users, Key, Table, Building2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/auth/protected-route';
import DashboardHeader from '@/components/dashboard-header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  // Organization
  { 
    name: 'Organization', 
    href: '/dashboard/organization', 
    icon: Building2,
    description: 'Manage organization settings'
  },
  
  // Data Management
  { 
    name: 'Collections', 
    href: '/dashboard/collections', 
    icon: Database,
    description: 'Manage data collections'
  },
  { 
    name: 'Data Views', 
    href: '/dashboard/data-views', 
    icon: Table,
    description: 'View and manage data'
  },
  
  // Administration
  { 
    name: 'Users', 
    href: '/dashboard/users', 
    icon: Users,
    description: 'Manage system users'
  },
  { 
    name: 'Roles & Permissions', 
    href: '/dashboard/roles', 
    icon: Settings,
    description: 'Configure access control'
  },
  { 
    name: 'API Keys', 
    href: '/dashboard/api-keys', 
    icon: Key,
    description: 'Manage API access'
  },
  
  // System
  { 
    name: 'Settings', 
    href: '/dashboard/settings', 
    icon: Settings,
    description: 'System configuration'
  },
];

function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <DashboardHeader />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 shadow-sm min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-accent text-accent-foreground border-r-2 border-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </ProtectedRoute>
  );
}
