"use client"

import { useState, useEffect } from "react"
import { Database, Users, Building2, Shield, Key, UserCheck, Crown, Settings } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { CollectionDataTableWrapper } from "@/components/data/collection-data-table-wrapper"
import { useCollectionCrud } from "@/hooks/use-collection-crud"

// Core table definitions with metadata
const CORE_TABLES = {
  // Users Group
  users: {
    name: "users",
    displayName: "Users",
    description: "System users and their basic information",
    icon: Users,
    group: "users",
    groupDisplayName: "Users & Access",
    isEditable: true,
    isDeletable: false, // Core system table
  },
  user_roles: {
    name: "user_roles", 
    displayName: "User Roles",
    description: "Assignments of roles to users",
    icon: UserCheck,
    group: "users",
    groupDisplayName: "Users & Access",
    isEditable: true,
    isDeletable: true,
  },
  roles: {
    name: "roles",
    displayName: "Roles", 
    description: "System roles and permissions",
    icon: Crown,
    group: "users",
    groupDisplayName: "Users & Access",
    isEditable: true,
    isDeletable: false, // Core system table
  },
  permissions: {
    name: "permissions",
    displayName: "Permissions",
    description: "Individual system permissions",
    icon: Shield,
    group: "users", 
    groupDisplayName: "Users & Access",
    isEditable: true,
    isDeletable: false, // Core system table
  },
  
  // Organization Group
  tenants: {
    name: "tenants",
    displayName: "Tenants",
    description: "Organizational tenants and their settings",
    icon: Building2,
    group: "organization",
    groupDisplayName: "Organization",
    isEditable: true,
    isDeletable: false, // Core system table
  },
  user_tenants: {
    name: "user_tenants",
    displayName: "User Tenants", 
    description: "User assignments to tenants",
    icon: UserCheck,
    group: "organization",
    groupDisplayName: "Organization", 
    isEditable: true,
    isDeletable: true,
  },
  
  // Data Group
  collections: {
    name: "collections",
    displayName: "Collections",
    description: "Data collection definitions",
    icon: Database,
    group: "data",
    groupDisplayName: "Data Management",
    isEditable: true,
    isDeletable: false, // Core system table
  },
  fields: {
    name: "fields", 
    displayName: "Fields",
    description: "Field definitions for collections",
    icon: Settings,
    group: "data",
    groupDisplayName: "Data Management",
    isEditable: true,
    isDeletable: true,
  },
  api_keys: {
    name: "api_keys",
    displayName: "API Keys",
    description: "API key management and authentication",
    icon: Key,
    group: "data",
    groupDisplayName: "Data Management",
    isEditable: true,
    isDeletable: true,
  },
}

interface CorePageProps {
  params: Promise<{ core: string }>
}

// URL slug to table name mapping
const URL_TO_TABLE_MAP: Record<string, string> = {
  'user-roles': 'user_roles',
  'user-tenants': 'user_tenants', 
  'api-keys': 'api_keys',
}

// Table name to URL slug mapping
const TABLE_TO_URL_MAP: Record<string, string> = {
  'user_roles': 'user-roles',
  'user_tenants': 'user-tenants',
  'api_keys': 'api-keys',
}

export default function CorePage({ params }: CorePageProps) {
  const [tableName, setTableName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  // CRUD hook for the selected table
  const { actions, state } = useCollectionCrud({ collectionName: tableName })

  useEffect(() => {
    const getTableName = async () => {
      try {
        const { core } = await params
        // Convert URL slug to table name
        const actualTableName = URL_TO_TABLE_MAP[core] || core
        setTableName(actualTableName)
      } catch (error) {
        console.error('Error getting table name from params:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getTableName()
  }, [params])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading core table...</span>
      </div>
    )
  }

  const currentTable = CORE_TABLES[tableName as keyof typeof CORE_TABLES]
  
  if (!currentTable) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Table Not Found</h3>
          <p className="text-muted-foreground">The requested core table "{tableName}" does not exist.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <CollectionDataTableWrapper 
      collectionName={tableName}
      crudActions={actions}
      crudState={state}
    />
  )
}
