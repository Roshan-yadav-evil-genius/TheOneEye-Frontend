import { TWorkflow } from "@/types"

export const mockWorkflows: TWorkflow[] = [
  {
    id: "wf-001",
    name: "Email Marketing Campaign",
    description: "Automated email sequence for new user onboarding and product updates",
    status: "active",
    lastRun: "2 hours ago",
    nextRun: "Tomorrow at 9:00 AM",
    runsCount: 1247,
    successRate: 94.2,
    category: "Marketing",
    tags: ["email", "automation", "onboarding"]
  },
  {
    id: "wf-002", 
    name: "Data Backup Process",
    description: "Daily automated backup of critical database and file systems",
    status: "active",
    lastRun: "1 hour ago",
    nextRun: "Today at 11:59 PM",
    runsCount: 365,
    successRate: 99.7,
    category: "Infrastructure",
    tags: ["backup", "database", "security"]
  },
  {
    id: "wf-011",
    name: "Database Migration",
    description: "Automated migration of legacy database to new schema",
    status: "error",
    lastRun: "2 hours ago",
    runsCount: 3,
    successRate: 0,
    category: "Infrastructure",
    tags: ["migration", "database", "legacy"]
  },
  {
    id: "wf-003",
    name: "Customer Support Ticket Routing",
    description: "Intelligent routing of support tickets based on priority and category",
    status: "active", 
    lastRun: "5 minutes ago",
    nextRun: "Continuous",
    runsCount: 8923,
    successRate: 87.5,
    category: "Support",
    tags: ["routing", "ai", "support"]
  },
  {
    id: "wf-004",
    name: "Invoice Generation",
    description: "Monthly invoice creation and delivery for subscription customers",
    status: "inactive",
    lastRun: "1 week ago",
    runsCount: 12,
    successRate: 100,
    category: "Finance",
    tags: ["billing", "invoices", "subscription"]
  },
  {
    id: "wf-012",
    name: "API Rate Limiting",
    description: "Monitor and enforce API rate limits across all services",
    status: "error",
    lastRun: "1 hour ago",
    runsCount: 45,
    successRate: 22.2,
    category: "Security",
    tags: ["api", "rate-limiting", "monitoring"]
  },
  {
    id: "wf-005",
    name: "Social Media Posting",
    description: "Scheduled posting to multiple social media platforms with content optimization",
    status: "inactive",
    runsCount: 0,
    successRate: 0,
    category: "Marketing",
    tags: ["social", "content", "scheduling"]
  },
  {
    id: "wf-006",
    name: "Security Scan",
    description: "Automated vulnerability scanning and threat detection across all systems",
    status: "active",
    lastRun: "30 minutes ago", 
    nextRun: "Every 4 hours",
    runsCount: 1825,
    successRate: 96.8,
    category: "Security",
    tags: ["security", "scanning", "vulnerability"]
  },
  {
    id: "wf-007",
    name: "Performance Monitoring",
    description: "Real-time monitoring of application performance and alerting",
    status: "active",
    lastRun: "1 minute ago",
    nextRun: "Continuous",
    runsCount: 43800,
    successRate: 99.1,
    category: "Monitoring",
    tags: ["performance", "monitoring", "alerts"]
  },
  {
    id: "wf-008",
    name: "User Analytics Report",
    description: "Weekly generation of user behavior analytics and insights",
    status: "active",
    lastRun: "3 days ago",
    nextRun: "Monday at 8:00 AM",
    runsCount: 52,
    successRate: 98.1,
    category: "Analytics",
    tags: ["analytics", "reporting", "insights"]
  },
  {
    id: "wf-009",
    name: "Inventory Management",
    description: "Automated stock level monitoring and reorder point notifications",
    status: "inactive",
    lastRun: "2 weeks ago",
    runsCount: 156,
    successRate: 89.7,
    category: "Operations",
    tags: ["inventory", "stock", "notifications"]
  },
  {
    id: "wf-010",
    name: "Lead Scoring",
    description: "AI-powered lead scoring based on engagement and behavior patterns",
    status: "inactive",
    runsCount: 0,
    successRate: 0,
    category: "Sales",
    tags: ["leads", "scoring", "ai"]
  },
  {
    id: "wf-013",
    name: "Content Moderation",
    description: "AI-powered content moderation for user-generated content",
    status: "error",
    lastRun: "30 minutes ago",
    runsCount: 156,
    successRate: 15.4,
    category: "Content",
    tags: ["moderation", "ai", "content"]
  },
  {
    id: "22d8a0c1-e438-47fd-9c6f-cc56611ac4a8",
    name: "Sample Workflow Layout",
    description: "A sample workflow to demonstrate the workflow layout interface",
    status: "active",
    lastRun: "1 hour ago",
    nextRun: "Tomorrow at 10:00 AM",
    runsCount: 42,
    successRate: 95.2,
    category: "Demo",
    tags: ["sample", "demo", "layout"]
  }
]
