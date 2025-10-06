import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change }) => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
      <h3 className="tracking-tight text-sm font-medium">{title}</h3>
    </div>
    <div>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">
        {change}
      </p>
    </div>
  </div>
);

export function DashboardMetrics() {
  const metrics = [
    {
      title: "Total Workflows",
      value: "12",
      change: "+2 from last month"
    },
    {
      title: "Active Nodes",
      value: "45",
      change: "+5 from last week"
    },
    {
      title: "Success Rate",
      value: "94.2%",
      change: "+0.5% from last month"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          change={metric.change}
        />
      ))}
    </div>
  );
}
