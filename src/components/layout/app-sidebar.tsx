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
  Settings,
  User,
  Sparkles,
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavMCP } from "@/components/layout/nav-mcp"
import { NavCore } from "@/components/layout/nav-core"
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
        name: "MCP Client",
        url: "/dashboard/client",
        icon: Sparkles,
        isActive: pathname === "/dashboard/client",
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
        <NavCore />

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
