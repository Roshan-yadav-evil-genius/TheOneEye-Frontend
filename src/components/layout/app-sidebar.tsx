"use client"

import * as React from "react"
import {
  IconDashboard,
  IconFolder,
  IconListDetails,
  IconNetwork,
} from "@tabler/icons-react"

import { NavMain } from "@/components/navigation/nav-main"
import { NavUser } from "@/components/navigation/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { useUserStore, useUIStore } from "@/stores"

const data = {
  user: {
    name: "Roshan Yadav",
    email: "roshan.yadav@12thwonder.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Workflow",
      url: "/workflow",
      icon: IconListDetails,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: IconFolder,
    },
    {
      title: "Nodes",
      url: "/nodes",
      icon: IconNetwork,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Zustand store hooks
  const { user } = useUserStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  // Use store user data if available, fallback to static data
  const userData = user ? {
    name: user.name,
    email: user.email,
    avatar: user.avatar || "/avatars/shadcn.jpg"
  } : data.user;

  return (
    <Sidebar 
      collapsible="offcanvas" 
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image src="/logo.png" width={50} height={20} alt="TheOneEye"/>
                <span className="text-base font-semibold">TheOneEye</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
