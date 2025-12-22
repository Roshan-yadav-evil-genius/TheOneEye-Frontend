import { IconPray, IconSettings, IconClock } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface WorkflowCardProps {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
  lastRun?: string
  nextRun?: string
  runsCount: number
  onRun?: (id: string) => void
  onEdit?: (id: string) => void
  onView?: (id: string) => void
}

export function WorkflowCard({
  id,
  name,
  description,
  status,
  lastRun,
  nextRun,
  runsCount,
  onRun,
  onEdit,
  onView,
}: WorkflowCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/workflow/${id}`)
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card 
      className="@container/card hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-semibold @[250px]/card:text-2xl leading-tight">
              {name}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
            <Badge variant="outline" className={getStatusColor(status)}>
              {status}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(id)
              }}
              className="h-8 w-8 p-0"
            >
              <IconSettings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardFooter className="flex-col items-start gap-4 pt-0">
        <div className="flex w-full justify-between">
          <div className="space-y-2">
            {lastRun && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconClock className="h-4 w-4 flex-shrink-0" />
                <span>Last run: {lastRun}</span>
              </div>
            )}

            {nextRun && status === "active" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconClock className="h-4 w-4 flex-shrink-0" />
                <span>Next run: {nextRun}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-baseline gap-1">
              <span className="font-semibold text-base">{runsCount.toLocaleString()}</span>
              <span className="text-muted-foreground text-xs flex items-center gap-1">
                <IconPray className="h-3 w-3" />
                runs
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onView?.(id)
            }}
            className="flex-1 h-9"
          >
            View Details
          </Button>
          {status === "inactive" && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onRun?.(id)
              }}
              className="flex-1 h-9"
            >
              Run Now
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
