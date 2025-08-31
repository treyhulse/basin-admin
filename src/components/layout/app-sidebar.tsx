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
} from "@/components/ui/sidebar"

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
        name: "Models",
        url: "/dashboard/mcp/models",
        icon: Brain,
        isActive: pathname.startsWith("/dashboard/mcp/models"),
        items: [
          {
            title: "GPT-4",
            url: "/dashboard/mcp/models",
          },
          {
            title: "Claude",
            url: "/dashboard/mcp/models",
          },
          {
            title: "Gemini",
            url: "/dashboard/mcp/models",
          },
        ],
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
    adminTools: [
      {
        name: "Users",
        url: "/dashboard/users",
        icon: ShieldUser,
        isActive: pathname === "/dashboard/users",
      },
      {
        name: "Roles & Permissions",
        url: "/dashboard/roles",
        icon: Crown,
        isActive: pathname === "/dashboard/roles",
      },
      {
        name: "Organization",
        url: "/dashboard/organization",
        icon: Building2,
        isActive: pathname === "/dashboard/organization",
      },
    ],
    systemTools: [
      {
        name: "API Keys",
        url: "/dashboard/api-keys",
        icon: KeyRound,
        isActive: pathname === "/dashboard/api-keys",
      },
      {
        name: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
        isActive: pathname === "/dashboard/settings",
      }
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="pb-2">
        <SidebarHeaderComponent />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavMCP mcpTools={data.mcpTools} />
        
        {/* Administration Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarMenu>
            {data.adminTools.map((tool) => (
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
