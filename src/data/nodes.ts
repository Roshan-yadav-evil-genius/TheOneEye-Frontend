// Node data and types for the application
import { Node } from '@/types';

// Helper function to format date strings
export const formatNodeDate = (dateString: string): string => {
  if (!dateString) return "Never";
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    return "Invalid Date";
  }
};

// Re-export constants from types
export { nodeTypes, nodeCategories } from '@/types';

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
