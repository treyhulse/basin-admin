'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User, Database, Settings, Users, Key, Table, Kanban, Calendar, Grid3X3, Building2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/auth/protected-route';

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
  const { user, tenant, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Basin Admin</h1>
              {tenant && (
                <Link href="/dashboard/organization">
                  <div className="flex items-center space-x-2 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors cursor-pointer">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 font-medium">
                      {tenant.name}
                    </span>
                  </div>
                </Link>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">
                  {user?.first_name} {user?.last_name}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
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
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
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
