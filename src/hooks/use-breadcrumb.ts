"use client"

import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { useWorkflowListStore } from "@/stores"

interface BreadcrumbItem {
  label: string
  href: string
  isCurrentPage?: boolean
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function segmentToLabel(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function useBreadcrumb(): BreadcrumbItem[] {
  const pathname = usePathname()
  const workflows = useWorkflowListStore((s) => s.workflows)

  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    const isWorkflowDetail =
      segments.length === 2 &&
      segments[0] === "workflow" &&
      UUID_REGEX.test(segments[1])

    const workflowName =
      isWorkflowDetail
        ? workflows.find((w) => w.id === segments[1])?.name ?? null
        : null

    let currentPath = ""
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1

      const label =
        isLast && isWorkflowDetail && workflowName
          ? workflowName
          : isLast && isWorkflowDetail
            ? "Workflow"
            : segmentToLabel(segment)

      breadcrumbs.push({
        label,
        href: currentPath,
        isCurrentPage: isLast
      })
    })

    return breadcrumbs
  }, [pathname, workflows])
}
