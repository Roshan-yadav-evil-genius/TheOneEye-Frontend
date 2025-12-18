"use client"

import * as React from "react"
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
import { useAuthStore } from "@/stores"
import { mainNavItems, defaultUserInfo } from "@/constants/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Auth store for user data
  const { user, isAuthenticated } = useAuthStore();

  // Use store user data if available, fallback to default
  const userData = user && isAuthenticated ? {
    name: `${user.first_name} ${user.last_name}`.trim() || user.username,
    email: user.email,
    avatar: "" // No avatar image, will show initials fallback
  } : defaultUserInfo;

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
        <NavMain items={mainNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
