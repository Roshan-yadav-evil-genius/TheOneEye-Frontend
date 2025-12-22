"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStore } from "@/stores/dashboard-store";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, isLoading }) => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
      <h3 className="tracking-tight text-sm font-medium">{title}</h3>
    </div>
    <div>
      <div className="text-2xl font-bold">
        {isLoading ? (
          <span className="text-muted-foreground">...</span>
        ) : (
          value
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {isLoading ? "Loading..." : change}
      </p>
    </div>
  </div>
);

export function DashboardMetrics() {
  const { metrics, isLoading, error, loadMetrics } = useDashboardStore();

  // Load metrics on mount
  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  // Show error state if there's an error and no metrics
  if (error && !metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Metrics</CardTitle>
          <CardDescription>Failed to load metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Use metrics from store or fallback to default values
  const displayMetrics = [
    {
      title: "Total Workflows",
      value: metrics?.workflowCount.toString() || "0",
      change: metrics?.workflowCountChange || "+0 from last month",
    },
    {
      title: "Available Nodes",
      value: metrics?.nodesCount.toString() || "0",
      change: metrics?.nodesCountChange || "+0 from last month",
    },
    {
      title: "Success Rate",
      value: metrics?.successRate ? `${metrics.successRate}%` : "0%",
      change: metrics?.successRateChange || "+0% from last month",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {displayMetrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
