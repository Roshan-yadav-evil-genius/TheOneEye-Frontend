import { Project } from "@/stores/projects-store";

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Marketing Automation Platform',
    description: 'Comprehensive marketing automation solution with email campaigns, lead scoring, and analytics',
    status: 'active',
    workflows: ['workflow-1', 'workflow-2'],
    team: ['user-1', 'user-2', 'user-3'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'user-1',
  },
  {
    id: 'project-2',
    name: 'Data Processing Pipeline',
    description: 'Automated data processing and analysis workflow for business intelligence',
    status: 'planning',
    workflows: ['workflow-3'],
    team: ['user-1', 'user-4'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    createdBy: 'user-1',
  },
  {
    id: 'project-3',
    name: 'Customer Support Automation',
    description: 'Automated customer support workflows with ticket routing and response generation',
    status: 'completed',
    workflows: ['workflow-4', 'workflow-5'],
    team: ['user-2', 'user-3', 'user-5'],
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-31'),
    createdBy: 'user-2',
  },
];
