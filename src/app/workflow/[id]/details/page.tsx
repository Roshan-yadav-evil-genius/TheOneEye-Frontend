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
  IconServer
} from "@tabler/icons-react";

export default function WorkflowDetailsPage() {
  const params = useParams();
  const workflowId = params.id as string;
  const [timeRange, setTimeRange] = useState("24h");

  // Current live values (in a real app this would come from real-time monitoring)
  const currentValues = {
    cpu: 45,
    memory: 78,
    networkIn: 420,
    networkOut: 280,
    diskRead: 18,
    diskWrite: 12
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

  // Docker resource utilization data
  const dockerResourceData = [
    { time: "00:00", cpu: 15, memory: 45, networkIn: 120, networkOut: 80, diskRead: 5, diskWrite: 3 },
    { time: "01:00", cpu: 12, memory: 42, networkIn: 95, networkOut: 65, diskRead: 4, diskWrite: 2 },
    { time: "02:00", cpu: 8, memory: 38, networkIn: 70, networkOut: 45, diskRead: 3, diskWrite: 1 },
    { time: "03:00", cpu: 6, memory: 35, networkIn: 50, networkOut: 30, diskRead: 2, diskWrite: 1 },
    { time: "04:00", cpu: 10, memory: 40, networkIn: 85, networkOut: 55, diskRead: 4, diskWrite: 2 },
    { time: "05:00", cpu: 18, memory: 48, networkIn: 150, networkOut: 100, diskRead: 6, diskWrite: 4 },
    { time: "06:00", cpu: 25, memory: 55, networkIn: 200, networkOut: 130, diskRead: 8, diskWrite: 5 },
    { time: "07:00", cpu: 35, memory: 65, networkIn: 280, networkOut: 180, diskRead: 12, diskWrite: 8 },
    { time: "08:00", cpu: 45, memory: 75, networkIn: 350, networkOut: 220, diskRead: 15, diskWrite: 10 },
    { time: "09:00", cpu: 55, memory: 85, networkIn: 420, networkOut: 280, diskRead: 18, diskWrite: 12 },
    { time: "10:00", cpu: 60, memory: 90, networkIn: 480, networkOut: 320, diskRead: 20, diskWrite: 15 },
    { time: "11:00", cpu: 58, memory: 88, networkIn: 460, networkOut: 300, diskRead: 19, diskWrite: 14 },
    { time: "12:00", cpu: 52, memory: 82, networkIn: 400, networkOut: 260, diskRead: 16, diskWrite: 11 },
    { time: "13:00", cpu: 48, memory: 78, networkIn: 380, networkOut: 240, diskRead: 14, diskWrite: 9 },
    { time: "14:00", cpu: 50, memory: 80, networkIn: 390, networkOut: 250, diskRead: 15, diskWrite: 10 },
    { time: "15:00", cpu: 55, memory: 85, networkIn: 430, networkOut: 290, diskRead: 17, diskWrite: 12 },
    { time: "16:00", cpu: 62, memory: 92, networkIn: 500, networkOut: 340, diskRead: 21, diskWrite: 16 },
    { time: "17:00", cpu: 65, memory: 95, networkIn: 520, networkOut: 360, diskRead: 22, diskWrite: 18 },
    { time: "18:00", cpu: 58, memory: 88, networkIn: 470, networkOut: 310, diskRead: 19, diskWrite: 14 },
    { time: "19:00", cpu: 45, memory: 75, networkIn: 360, networkOut: 230, diskRead: 14, diskWrite: 9 },
    { time: "20:00", cpu: 35, memory: 65, networkIn: 280, networkOut: 180, diskRead: 11, diskWrite: 7 },
    { time: "21:00", cpu: 25, memory: 55, networkIn: 200, networkOut: 130, diskRead: 8, diskWrite: 5 },
    { time: "22:00", cpu: 18, memory: 48, networkIn: 150, networkOut: 100, diskRead: 6, diskWrite: 4 },
    { time: "23:00", cpu: 12, memory: 42, networkIn: 100, networkOut: 70, diskRead: 4, diskWrite: 3 },
  ];

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
            <div className="text-2xl font-bold">{workflowData.created_by}</div>
            <p className="text-xs text-muted-foreground">
              {workflowData.created_at}
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Resource Utilization</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
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

      {/* Docker Resource Charts */}
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
                <div className="text-2xl font-bold text-blue-500">{currentValues.cpu}%</div>
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
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
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
                <div className="text-2xl font-bold text-green-500">{currentValues.memory}%</div>
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
                <div className="text-lg font-bold text-orange-500">{currentValues.networkIn} KB/s</div>
                <div className="text-sm font-bold text-red-500">{currentValues.networkOut} KB/s</div>
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
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: '#f59e0b', strokeWidth: 2, fill: '#ffffff' }}
                />
                <Line
                  dataKey="networkOut"
                  type="monotone"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
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
                <div className="text-lg font-bold text-purple-500">{currentValues.diskRead} MB/s</div>
                <div className="text-sm font-bold text-cyan-500">{currentValues.diskWrite} MB/s</div>
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
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: '#8b5cf6', strokeWidth: 2, fill: '#ffffff' }}
                />
                <Line
                  dataKey="diskWrite"
                  type="monotone"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: '#06b6d4', strokeWidth: 2, fill: '#ffffff' }}
                />
              </LineChart>
            </ChartContainer>
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
