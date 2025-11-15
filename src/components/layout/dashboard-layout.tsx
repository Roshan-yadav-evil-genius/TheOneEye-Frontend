"use client"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <main className="flex flex-col flex-1">
      {children}
    </main>
  )
}
