"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  IconArrowLeft, 
  IconClock, 
  IconActivity, 
  IconTrendingUp, 
  IconUsers,
  IconSettings,
  IconPlayerPlay,
  IconSquare
} from "@tabler/icons-react";

export default function WorkflowDetailsPage() {
  const params = useParams();
  const workflowId = params.id as string;

  // Mock data - in a real app this would come from an API
  const workflowData = {
    id: workflowId,
    name: "Email Notification Workflow",
    description: "Automated email notifications for user actions and system events",
    status: "active" as const,
    category: "Communication",
    tags: ["email", "notifications", "automation"],
    createdAt: "2024-01-15",
    lastModified: "2024-01-20",
    lastRun: "2 minutes ago",
    nextRun: "in 1 hour",
    totalRuns: 1247,
    successRate: 94.2,
    avgExecutionTime: "2.3s",
    totalExecutionTime: "47.8 minutes",
    errorCount: 73,
    lastError: "3 days ago",
    createdBy: "John Doe",
    nodes: [
      { id: "1", type: "trigger", label: "Start", status: "active" },
      { id: "2", type: "action", label: "Send Email", status: "active" },
      { id: "3", type: "action", label: "Database Query", status: "active" },
      { id: "4", type: "logic", label: "Switch", status: "active" },
      { id: "5", type: "trigger", label: "End", status: "active" },
    ],
    recentRuns: [
      { id: "1", status: "success", duration: "2.1s", timestamp: "2 minutes ago" },
      { id: "2", status: "success", duration: "2.4s", timestamp: "1 hour ago" },
      { id: "3", status: "error", duration: "1.8s", timestamp: "3 hours ago" },
      { id: "4", status: "success", duration: "2.2s", timestamp: "6 hours ago" },
      { id: "5", status: "success", duration: "2.0s", timestamp: "1 day ago" },
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return "text-green-600 dark:text-green-400";
    if (rate >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <IconArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{workflowData.name}</h1>
            <p className="text-muted-foreground">{workflowData.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getStatusColor(workflowData.status)}>
            {workflowData.status}
          </Badge>
          <Button variant="outline" size="sm">
            <IconSettings className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button size="sm">
            <IconPlayerPlay className="h-4 w-4 mr-2" />
            Run Now
          </Button>
        </div>
      </div>

      <Separator />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <IconActivity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflowData.totalRuns.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last run: {workflowData.lastRun}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getSuccessRateColor(workflowData.successRate)}`}>
              {workflowData.successRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {workflowData.errorCount} errors total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Execution Time</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflowData.avgExecutionTime}</div>
            <p className="text-xs text-muted-foreground">
              Total: {workflowData.totalExecutionTime}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created By</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflowData.createdBy}</div>
            <p className="text-xs text-muted-foreground">
              {workflowData.createdAt}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflow Details */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Information</CardTitle>
            <CardDescription>Basic details about this workflow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Category</label>
                <p className="text-sm">{workflowData.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Modified</label>
                <p className="text-sm">{workflowData.lastModified}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tags</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {workflowData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Next Scheduled Run</label>
              <p className="text-sm">{workflowData.nextRun}</p>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Nodes */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Nodes</CardTitle>
            <CardDescription>Components in this workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {workflowData.nodes.map((node) => (
                <div key={node.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      node.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <span className="text-sm font-medium">{node.label}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {node.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Runs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Runs</CardTitle>
          <CardDescription>Latest execution history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {workflowData.recentRuns.map((run) => (
              <div key={run.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    run.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">Run #{run.id}</p>
                    <p className="text-xs text-muted-foreground">{run.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{run.duration}</span>
                  <Badge variant="outline" className={getStatusColor(run.status)}>
                    {run.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
