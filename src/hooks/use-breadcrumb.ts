"use client"

import { usePathname } from "next/navigation"
import { useMemo } from "react"

interface BreadcrumbItem {
  label: string
  href: string
  isCurrentPage?: boolean
}

export function useBreadcrumb(): BreadcrumbItem[] {
  const pathname = usePathname()

  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    // Always start with Dashboard
    breadcrumbs.push({
      label: "Dashboard",
      href: "/dashboard",
      isCurrentPage: pathname === "/dashboard"
    })

    // If we're on the dashboard page, return early
    if (pathname === "/dashboard") {
      return breadcrumbs
    }

    // Build breadcrumbs for each segment
    let currentPath = ""
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      const isLast = index === segments.length - 1
      
      breadcrumbs.push({
        label,
        href: currentPath,
        isCurrentPage: isLast
      })
    })

    return breadcrumbs
  }, [pathname])
}
