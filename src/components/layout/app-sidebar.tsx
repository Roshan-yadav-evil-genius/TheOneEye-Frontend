"use client"

import * as React from "react"
import {
  IconBrowser,
  IconDashboard,
  IconListDetails,
  IconKey,
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
import { useAuthStore } from "@/stores/auth-store"
import { useUIStore } from "@/stores"

const data = {
  user: {
    name: "Roshan Yadav",
    email: "roshan.yadav@12thwonder.com",
    avatar: "",
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
      title:"Sessions",
      url: "/browser-sessions",
      icon: IconBrowser,
    },
    {
      title: "Auth",
      url: "/auth",
      icon: IconKey,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Zustand store hooks
  const { user, isAuthenticated } = useAuthStore();
  const { } = useUIStore();

  // Use store user data if available, fallback to static data
  const userData = user && isAuthenticated ? {
    name: `${user.first_name} ${user.last_name}`.trim() || user.username,
    email: user.email,
    avatar: "" // No avatar image, will show initials fallback
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
