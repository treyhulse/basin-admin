import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Users, Settings, Plus, Table, Key, Shield } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2">
          Welcome to your Basin Admin dashboard. Manage your collections, users, and system configuration.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Active data collections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Active integrations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Items</CardTitle>
            <Table className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              Total records
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Manage your data collections and view data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/dashboard/collections"
              className="flex items-center p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <Database className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Collections</div>
                <div className="text-sm">Configure data structure and fields</div>
              </div>
            </Link>
            
            <Link
              href="/dashboard/data-views"
              className="flex items-center p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <Table className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Data Views</div>
                <div className="text-sm">View and manage data in different formats</div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Administration</CardTitle>
            <CardDescription>
              Manage users, permissions, and system settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/dashboard/users"
              className="flex items-center p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <Users className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">User Management</div>
                <div className="text-sm">Manage system users and accounts</div>
              </div>
            </Link>
            
            <Link
              href="/dashboard/roles"
              className="flex items-center p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <Shield className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Roles & Permissions</div>
                <div className="text-sm">Configure access control</div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Current system status and configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Version</Label>
              <p className="text-sm">1.0.0</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Environment</Label>
              <p className="text-sm">Development</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Last Updated</Label>
              <p className="text-sm">2024-01-30</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
