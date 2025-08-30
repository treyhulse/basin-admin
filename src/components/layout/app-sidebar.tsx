"use client"

import * as React from "react"
import {
  Bot,
  Brain,
  Cpu,
  Database,
  Settings2,
  Users,
  Wrench,
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavMCP } from "@/components/layout/nav-mcp"
import { NavUser } from "@/components/layout/nav-user"
import { TeamSwitcher } from "@/components/layout/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GitHubStarsWidget } from "@/components/layout/github-stars-widget"
import Image from "next/image"

// Navigation data for the sidebar
const data = {
  navMain: [
    {
      title: "Data Management",
      url: "/dashboard",
      icon: Database,
      isActive: true,
      items: [
        {
          title: "Collections",
          url: "/dashboard/collections",
        },
        {
          title: "Data Views",
          url: "/dashboard/data-views",
        },
        {
          title: "API Keys",
          url: "/dashboard/api-keys",
        },
      ],
    },
    {
      title: "Administration",
      url: "/dashboard",
      icon: Users,
      items: [
        {
          title: "Users",
          url: "/dashboard/users",
        },
        {
          title: "Roles & Permissions",
          url: "/dashboard/roles",
        },
        {
          title: "Organization",
          url: "/dashboard/organization",
        },
      ],
    },
    {
      title: "System",
      url: "/dashboard",
      icon: Settings2,
      items: [
        {
          title: "Settings",
          url: "/dashboard/settings",
        },
        {
          title: "Profile",
          url: "/dashboard/profile",
        },
      ],
    },
  ],
  mcpTools: [
    {
      name: "MCP Server",
      url: "/dashboard/mcp/server",
      icon: Cpu,
    },
    {
      name: "Models",
      url: "/dashboard/mcp/models",
      icon: Brain,
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
    },
    {
      name: "Agents",
      url: "/dashboard/mcp/agents",
      icon: Bot,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between w-full">
          <Image
            src="/logos/basin-logo.svg"
            alt="Basin"
            width={36}
            height={36}
            className="shrink-0"
          />
          <GitHubStarsWidget owner="treyhulse" repo="basin-admin" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavMCP mcpTools={data.mcpTools} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
