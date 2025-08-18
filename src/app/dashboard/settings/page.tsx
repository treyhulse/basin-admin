import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Database, Shield, Globe, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure your system settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-600" />
              <span>API Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure your API endpoints and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="api-url">API Base URL</Label>
              <Input
                id="api-url"
                defaultValue="http://localhost:8080"
                placeholder="Enter API base URL"
              />
            </div>
            <div>
              <Label htmlFor="api-timeout">API Timeout (seconds)</Label>
              <Input
                id="api-timeout"
                type="number"
                defaultValue="30"
                placeholder="Enter timeout value"
              />
            </div>
            <Button className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save API Settings
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Security Settings</span>
            </CardTitle>
            <CardDescription>
              Configure authentication and security options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="jwt-expiry">JWT Token Expiry (hours)</Label>
              <Input
                id="jwt-expiry"
                type="number"
                defaultValue="24"
                placeholder="Enter expiry time"
              />
            </div>
            <div>
              <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
              <Input
                id="max-login-attempts"
                type="number"
                defaultValue="5"
                placeholder="Enter max attempts"
              />
            </div>
            <Button className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Security Settings
            </Button>
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-purple-600" />
              <span>General Settings</span>
            </CardTitle>
            <CardDescription>
              Configure general application settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="app-name">Application Name</Label>
              <Input
                id="app-name"
                defaultValue="Basin Admin"
                placeholder="Enter application name"
              />
            </div>
            <div>
              <Label htmlFor="timezone">Default Timezone</Label>
              <select
                id="timezone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="UTC"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>
            <Button className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save General Settings
            </Button>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-orange-600" />
              <span>Database Settings</span>
            </CardTitle>
            <CardDescription>
              Configure database connection and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="db-host">Database Host</Label>
              <Input
                id="db-host"
                defaultValue="localhost"
                placeholder="Enter database host"
              />
            </div>
            <div>
              <Label htmlFor="db-port">Database Port</Label>
              <Input
                id="db-port"
                type="number"
                defaultValue="5432"
                placeholder="Enter database port"
              />
            </div>
            <div>
              <Label htmlFor="db-name">Database Name</Label>
              <Input
                id="db-name"
                defaultValue="basin"
                placeholder="Enter database name"
              />
            </div>
            <Button className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Database Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-gray-600" />
            <span>System Information</span>
          </CardTitle>
          <CardDescription>
            View system details and version information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Version</Label>
              <p className="text-sm text-gray-900">1.0.0</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Environment</Label>
              <p className="text-sm text-gray-900">Development</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
              <p className="text-sm text-gray-900">2024-01-30</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
