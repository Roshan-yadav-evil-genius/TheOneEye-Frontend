// Node data and types for the application

export interface Node {
  id: string;
  name: string;
  type: 'trigger' | 'action' | 'logic' | 'system';
  category: string;
  description: string;
  version: string;
  isActive: boolean;
  createdAt: string; // ISO string format from backend
  updatedAt: string; // ISO string format from backend
  createdBy: string; // Username of the creator
  formConfiguration: Record<string, unknown>; // SurveyJS form configuration JSON
  tags: string[];
}

// Helper function to format date strings
export const formatNodeDate = (dateString: string): string => {
  if (!dateString) return "Never";
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    return "Invalid Date";
  }
};

export const nodeTypes = ['trigger', 'action', 'logic', 'system'] as const;
export const nodeCategories = [
  'system',
  'email', 
  'database',
  'api',
  'logic',
  'control',
  'file'
] as const;

// Import mock data from dummy folder
import { mockNodes } from '@/dummy';

// Re-export mockNodes for backward compatibility
export { mockNodes };

// Helper functions for node operations
export const getNodeById = (id: string): Node | undefined => {
  return mockNodes.find(node => node.id === id);
};

export const getNodesByCategory = (category: string): Node[] => {
  return mockNodes.filter(node => node.category === category);
};

export const getNodesByType = (type: Node['type']): Node[] => {
  return mockNodes.filter(node => node.type === type);
};

export const searchNodes = (query: string): Node[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockNodes.filter(node => 
    node.name.toLowerCase().includes(lowercaseQuery) ||
    node.description.toLowerCase().includes(lowercaseQuery) ||
    node.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
