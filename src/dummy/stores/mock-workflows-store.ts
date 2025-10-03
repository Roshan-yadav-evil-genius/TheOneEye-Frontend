import { Workflow } from "@/types";

export const mockWorkflowsStore: Workflow[] = [
  {
    id: 'workflow-1',
    name: 'Email Marketing Campaign',
    description: 'Automated email sequence for new user onboarding',
    nodes: [],
    connections: [],
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'user-1',
  },
  {
    id: 'workflow-2',
    name: 'Data Backup Process',
    description: 'Daily automated backup of critical systems',
    nodes: [],
    connections: [],
    status: 'active',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-16'),
    createdBy: 'user-1',
  },
  {
    id: 'workflow-3',
    name: 'Customer Support Routing',
    description: 'Intelligent routing of support tickets',
    nodes: [],
    connections: [],
    status: 'active',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-17'),
    createdBy: 'user-2',
  },
];
