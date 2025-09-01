"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  Bot,
  Brain,
  Cpu,
  Database,
  ShieldUser,
  Wrench,
  KeyRound,
  Settings,
  Building2,
  Crown,
  Users,
  UserCheck,
  Shield,
  ChevronRight,
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavMCP } from "@/components/layout/nav-mcp"
import { NavUser } from "@/components/layout/nav-user"
import { SidebarHeader as SidebarHeaderComponent } from "@/components/layout/sidebar-header"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  // Navigation data for the sidebar
  const data = {
    navMain: [
      {
        title: "Collections",
        url: "/dashboard/data",
        icon: Database,
        isActive: pathname.startsWith("/dashboard/data"),
        items: [], // This will be populated dynamically with collections
      },
    ],
    mcpTools: [
      {
        name: "MCP Server",
        url: "/dashboard/mcp/server",
        icon: Cpu,
        isActive: pathname === "/dashboard/mcp/server",
      },
      {
        name: "Tools",
        url: "/dashboard/mcp/tools",
        icon: Wrench,
        isActive: pathname === "/dashboard/mcp/tools",
      },
      {
        name: "Agents",
        url: "/dashboard/mcp/agents",
        icon: Bot,
        isActive: pathname === "/dashboard/mcp/agents",
      },
    ],
    systemTools: [
      {
        name: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
        isActive: pathname === "/dashboard/settings",
      }
    ],
  }

  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader className="pb-2">
        <SidebarHeaderComponent />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavMCP mcpTools={data.mcpTools} />
        
        {/* Core System Tables Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Core</SidebarGroupLabel>
          <SidebarMenu>
            {/* Users & Access Group */}
            <Collapsible asChild defaultOpen={pathname.startsWith("/dashboard/users") || pathname.startsWith("/dashboard/roles") || pathname.startsWith("/dashboard/permissions") || pathname.startsWith("/dashboard/user-roles")}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="Users & Access">
                    <Users />
                    <span>Users & Access</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 data-[state=open]:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={pathname.startsWith("/dashboard/users")}>
                        <a href="/dashboard/users">
                          <Users />
                          <span>Users</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={pathname.startsWith("/dashboard/roles")}>
                        <a href="/dashboard/roles">
                          <Crown />
                          <span>Roles</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={pathname.startsWith("/dashboard/permissions")}>
                        <a href="/dashboard/permissions">
                          <Shield />
                          <span>Permissions</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={pathname.startsWith("/dashboard/user-roles")}>
                        <a href="/dashboard/user-roles">
                          <UserCheck />
                          <span>User Roles</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            {/* Organization Group */}
            <Collapsible asChild defaultOpen={pathname.startsWith("/dashboard/tenants") || pathname.startsWith("/dashboard/user-tenants")}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="Organization">
                    <Building2 />
                    <span>Organization</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 data-[state=open]:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={pathname.startsWith("/dashboard/tenants")}>
                        <a href="/dashboard/tenants">
                          <Building2 />
                          <span>Tenants</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={pathname.startsWith("/dashboard/user-tenants")}>
                        <a href="/dashboard/user-tenants">
                          <UserCheck />
                          <span>User Tenants</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            {/* Data Management Group */}
            <Collapsible asChild defaultOpen={pathname.startsWith("/dashboard/collections") || pathname.startsWith("/dashboard/fields") || pathname.startsWith("/dashboard/api-keys")}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="Data Management">
                    <Database />
                    <span>Data Management</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 data-[state=open]:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={pathname.startsWith("/dashboard/collections")}>
                        <a href="/dashboard/collections">
                          <Database />
                          <span>Collections</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={pathname.startsWith("/dashboard/fields")}>
                        <a href="/dashboard/fields">
                          <Settings />
                          <span>Fields</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={pathname.startsWith("/dashboard/api-keys")}>
                        <a href="/dashboard/api-keys">
                          <KeyRound />
                          <span>API Keys</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>

        {/* System Section */}
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarMenu>
            {data.systemTools.map((tool) => (
              <SidebarMenuItem key={tool.name}>
                <SidebarMenuButton asChild isActive={tool.isActive}>
                  <a href={tool.url}>
                    <tool.icon />
                    <span>{tool.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
