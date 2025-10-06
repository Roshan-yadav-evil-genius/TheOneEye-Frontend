import { TNode } from "@/types";

export const mockNodesStore: TNode[] = [
  {
    id: 'node-1',
    name: 'Email Sender',
    type: 'action',
    nodeGroup: 'group-1',
    nodeGroupName: 'Communication',
    description: 'Sends emails to specified recipients',
    version: '1.0.0',
    tags: ['email', 'communication'],
    createdBy: 'system',
    formConfiguration: {
      title: 'Email Configuration',
      elements: [
        {
          type: 'text',
          name: 'recipient',
          title: 'Recipient Email',
          isRequired: true,
        },
        {
          type: 'text',
          name: 'subject',
          title: 'Email Subject',
          isRequired: true,
        },
      ],
    },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    isActive: true,
  },
  {
    id: 'node-2',
    name: 'Database Query',
    type: 'action',
    nodeGroup: 'group-2',
    nodeGroupName: 'Database',
    description: 'Executes SQL queries on connected databases',
    version: '1.0.0',
    tags: ['database', 'sql'],
    createdBy: 'system',
    formConfiguration: {
      title: 'Database Configuration',
      elements: [
        {
          type: 'text',
          name: 'connectionString',
          title: 'Connection String',
          isRequired: true,
        },
        {
          type: 'comment',
          name: 'query',
          title: 'SQL Query',
          isRequired: true,
        },
      ],
    },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    isActive: true,
  },
];
