"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Area,
  AreaChart,
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { 
  IconArrowLeft, 
  IconClock, 
  IconActivity, 
  IconTrendingUp, 
  IconUsers,
  IconSettings,
  IconPlayerPlay,
  IconCpu,
  IconDeviceDesktop,
  IconNetwork,
  IconServer,
  IconRefresh
} from "@tabler/icons-react";
import { useWorkflowStats } from "@/hooks/use-workflow-stats";
import { TimeRange } from "@/types/stats";

export default function WorkflowDetailsPage() {
  const params = useParams();
  const workflowId = params.id as string;
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");

  // Use the real stats hook
  const {
    chartData,
    currentStats,
    isLoading,
    error,
    refetch,
    setTimeRange: setStatsTimeRange,
  } = useWorkflowStats({
    workflowId,
    timeRange,
  });

  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    const newRange = value as TimeRange;
    setTimeRange(newRange);
    setStatsTimeRange(newRange);
  };

  // Handle manual refresh
  const handleRefresh = () => {
    refetch();
  };

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

  // Use real chart data from the API
  const dockerResourceData = chartData;

  // Chart configurations with high contrast colors
  const cpuChartConfig = {
    cpu: {
      label: "CPU Usage",
      color: "#3b82f6", // Bright blue
    },
  } satisfies ChartConfig;

  const memoryChartConfig = {
    memory: {
      label: "Memory Usage",
      color: "#10b981", // Bright green
    },
  } satisfies ChartConfig;

  const networkChartConfig = {
    networkIn: {
      label: "Network In",
      color: "#f59e0b", // Bright orange
    },
    networkOut: {
      label: "Network Out",
      color: "#ef4444", // Bright red
    },
  } satisfies ChartConfig;

  const diskChartConfig = {
    diskRead: {
      label: "Disk Read",
      color: "#8b5cf6", // Bright purple
    },
    diskWrite: {
      label: "Disk Write",
      color: "#06b6d4", // Bright cyan
    },
  } satisfies ChartConfig;

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
      </div>

      <Separator />

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Resource Utilization</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <IconRefresh className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <IconActivity className="h-5 w-5" />
              <span>Error loading resource statistics: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <IconRefresh className="h-5 w-5 animate-spin" />
              <span>Loading resource statistics...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Data State */}
      {!isLoading && !error && dockerResourceData.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <IconActivity className="h-5 w-5" />
              <span>No resource statistics available for the selected time range.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Docker Resource Charts */}
      {!isLoading && !error && dockerResourceData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU Usage Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <IconCpu className="h-5 w-5" />
                  CPU Usage
                </CardTitle>
                <CardDescription>CPU utilization over time</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-500">
                  {currentStats ? `${currentStats.cpu}%` : 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">Current</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2">
            <ChartContainer config={cpuChartConfig} className="h-[200px] w-full">
              <LineChart data={dockerResourceData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={[0, 100]}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey="cpu"
                  type="monotone"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Memory Usage Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <IconDeviceDesktop className="h-5 w-5" />
                  Memory Usage
                </CardTitle>
                <CardDescription>Memory consumption over time</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-500">
                  {currentStats ? `${currentStats.memory}%` : 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">Current</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2">
            <ChartContainer config={memoryChartConfig} className="h-[200px] w-full">
              <AreaChart data={dockerResourceData}>
                <defs>
                  <linearGradient id="fillMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#10b981"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="#10b981"
                      stopOpacity={0.2}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={[0, 100]}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
                <Area
                  dataKey="memory"
                  type="monotone"
                  fill="url(#fillMemory)"
                  stroke="#10b981"
                  strokeWidth={3}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Network I/O Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <IconNetwork className="h-5 w-5" />
                  Network I/O
                </CardTitle>
                <CardDescription>Network traffic in/out over time</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-orange-500">
                  {currentStats ? `${currentStats.networkIn} KB/s` : 'N/A'}
                </div>
                <div className="text-sm font-bold text-red-500">
                  {currentStats ? `${currentStats.networkOut} KB/s` : 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">In / Out</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2">
            <ChartContainer config={networkChartConfig} className="h-[200px] w-full">
              <LineChart data={dockerResourceData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey="networkIn"
                  type="monotone"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, stroke: '#f59e0b', strokeWidth: 2, fill: '#ffffff' }}
                />
                <Line
                  dataKey="networkOut"
                  type="monotone"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, stroke: '#ef4444', strokeWidth: 2, fill: '#ffffff' }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Disk I/O Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <IconServer className="h-5 w-5" />
                  Disk I/O
                </CardTitle>
                <CardDescription>Disk read/write operations over time</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-500">
                  {currentStats ? `${currentStats.diskRead} MB/s` : 'N/A'}
                </div>
                <div className="text-sm font-bold text-cyan-500">
                  {currentStats ? `${currentStats.diskWrite} MB/s` : 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">Read / Write</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2">
            <ChartContainer config={diskChartConfig} className="h-[200px] w-full">
              <LineChart data={dockerResourceData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey="diskRead"
                  type="monotone"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, stroke: '#8b5cf6', strokeWidth: 2, fill: '#ffffff' }}
                />
                <Line
                  dataKey="diskWrite"
                  type="monotone"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, stroke: '#06b6d4', strokeWidth: 2, fill: '#ffffff' }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        </div>
      )}

      {/* Recent Runs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Runs</CardTitle>
          <CardDescription>Latest execution history</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Run ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflowData.recentRuns.map((run) => (
                <TableRow key={run.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        run.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      Run #{run.id}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(run.status)}>
                      {run.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {run.duration}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {run.timestamp}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View Logs
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
