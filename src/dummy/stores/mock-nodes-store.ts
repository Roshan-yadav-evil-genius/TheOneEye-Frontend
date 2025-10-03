import { TNode } from "@/types";

export const mockNodesStore: TNode[] = [
  {
    id: 'node-1',
    name: 'Email Sender',
    type: 'action',
    category: 'system',
    description: 'Sends emails to specified recipients',
    version: '1.0.0',
    tags: ['email', 'communication'],
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
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isActive: true,
  },
  {
    id: 'node-2',
    name: 'Database Query',
    type: 'action',
    category: 'database',
    description: 'Executes SQL queries on connected databases',
    version: '1.0.0',
    tags: ['database', 'sql'],
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
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isActive: true,
  },
];
