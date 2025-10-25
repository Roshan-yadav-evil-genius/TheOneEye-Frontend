"use client"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="px-4 lg:px-6">
      <div className="space-y-4">
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}
