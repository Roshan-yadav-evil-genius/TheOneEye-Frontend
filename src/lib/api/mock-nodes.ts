import { TNode } from '@/types';
import { mockNodes } from '@/dummy/nodes/mock-nodes';
import { 
  TTNodeCreateData, 
  TTNodeUpdateData, 
  TTNodeFilters, 
  TTPaginatedResponse,
  TTNodeStats 
} from './types';

// Mock API implementation using dummy data
class MockNodesApiClient {
  private nodes: TNode[] = [...mockNodes];
  private nextId = 1000; // Start from a high number to avoid conflicts

  // Simulate network delay
  private async delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generate a new unique ID
  private generateId(): string {
    return `node-${this.nextId++}`;
  }

  // Format dates properly
  private formatNode(node: any): TNode {
    return {
      ...node,
      createdAt: typeof node.createdAt === 'string' ? node.createdAt : node.createdAt.toISOString(),
      updatedAt: typeof node.updatedAt === 'string' ? node.updatedAt : node.updatedAt.toISOString(),
      formConfiguration: node.formConfiguration || {},
      tags: node.tags || [],
    };
  }

  // CRUD Operations
  async getNodes(filters: TNodeFilters = {}): Promise<TPaginatedResponse<TNode>> {
    await this.delay();
    
    let filteredNodes = [...this.nodes];

    // Apply filters
    if (filters.type) {
      filteredNodes = filteredNodes.filter(node => node.type === filters.type);
    }
    if (filters.category) {
      filteredNodes = filteredNodes.filter(node => node.category === filters.category);
    }
    if (filters.is_active !== undefined) {
      filteredNodes = filteredNodes.filter(node => node.isActive === filters.is_active);
    }
    if (filters.tags && filters.tags.length > 0) {
      filteredNodes = filteredNodes.filter(node => 
        filters.tags!.some(tag => node.tags.includes(tag))
      );
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredNodes = filteredNodes.filter(node => 
        node.name.toLowerCase().includes(searchLower) ||
        node.description.toLowerCase().includes(searchLower) ||
        node.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply ordering
    if (filters.ordering) {
      const [field, direction] = filters.ordering.startsWith('-') 
        ? [filters.ordering.slice(1), 'desc'] 
        : [filters.ordering, 'asc'];
      
      filteredNodes.sort((a, b) => {
        const aVal = (a as any)[field];
        const bVal = (b as any)[field];
        
        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply pagination
    const page = filters.page || 1;
    const pageSize = filters.page_size || 20;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const results = filteredNodes.slice(startIndex, endIndex);
    const totalCount = filteredNodes.length;
    const hasNext = endIndex < totalCount;
    const hasPrevious = page > 1;

    return {
      count: totalCount,
      next: hasNext ? `?page=${page + 1}&page_size=${pageSize}` : null,
      previous: hasPrevious ? `?page=${page - 1}&page_size=${pageSize}` : null,
      results: results.map(node => this.formatNode(node)),
    };
  }

  async getNode(id: string): Promise<TNode> {
    await this.delay();
    
    const node = this.nodes.find(n => n.id === id);
    if (!node) {
      throw new Error(`Node with ID "${id}" not found`);
    }
    
    return this.formatNode(node);
  }

  async createNode(nodeData: TNodeCreateData): Promise<TNode> {
    await this.delay();
    
    const newNode: TNode = {
      id: this.generateId(),
      name: nodeData.name,
      type: nodeData.type,
      category: nodeData.category,
      description: nodeData.description || '',
      version: nodeData.version || '1.0.0',
      isActive: nodeData.isActive !== undefined ? nodeData.isActive : true,
      formConfiguration: nodeData.formConfiguration || {},
      tags: nodeData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user', // Mock user
    };

    this.nodes.push(newNode);
    return this.formatNode(newNode);
  }

  async updateNode(id: string, nodeData: TNodeUpdateData): Promise<TNode> {
    await this.delay();
    
    const nodeIndex = this.nodes.findIndex(n => n.id === id);
    if (nodeIndex === -1) {
      throw new Error(`Node with ID "${id}" not found`);
    }

    const existingNode = this.nodes[nodeIndex];
    const updatedNode: TNode = {
      ...existingNode,
      ...nodeData,
      id: existingNode.id, // Don't allow ID changes
      updatedAt: new Date().toISOString(),
    };

    this.nodes[nodeIndex] = updatedNode;
    return this.formatNode(updatedNode);
  }

  async deleteNode(id: string): Promise<void> {
    await this.delay();
    
    const nodeIndex = this.nodes.findIndex(n => n.id === id);
    if (nodeIndex === -1) {
      throw new Error(`Node with ID "${id}" not found`);
    }

    this.nodes.splice(nodeIndex, 1);
  }

  // Bulk Operations
  async bulkCreateNodes(nodesData: TNodeCreateData[]): Promise<Node[]> {
    await this.delay();
    
    const newNodes: TNode[] = nodesData.map(nodeData => ({
      id: this.generateId(),
      name: nodeData.name,
      type: nodeData.type,
      category: nodeData.category,
      description: nodeData.description || '',
      version: nodeData.version || '1.0.0',
      isActive: nodeData.isActive !== undefined ? nodeData.isActive : true,
      formConfiguration: nodeData.formConfiguration || {},
      tags: nodeData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
    }));

    this.nodes.push(...newNodes);
    return newNodes.map(node => this.formatNode(node));
  }

  async bulkDeleteNodes(ids: string[]): Promise<{ message: string; deleted_count: number }> {
    await this.delay();
    
    const initialCount = this.nodes.length;
    this.nodes = this.nodes.filter(node => !ids.includes(node.id));
    const deletedCount = initialCount - this.nodes.length;

    return {
      message: `Successfully deleted ${deletedCount} nodes`,
      deleted_count: deletedCount,
    };
  }

  // Utility Endpoints
  async getNodeTypes(): Promise<{ types: Array<{ value: string; label: string }> }> {
    await this.delay(100);
    
    const types = Array.from(new Set(this.nodes.map(node => node.type)));
    return {
      types: types.map(type => ({
        value: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
      })),
    };
  }

  async getNodeCategories(): Promise<{ categories: Array<{ value: string; label: string }> }> {
    await this.delay(100);
    
    const categories = Array.from(new Set(this.nodes.map(node => node.category)));
    return {
      categories: categories.map(category => ({
        value: category,
        label: category.charAt(0).toUpperCase() + category.slice(1),
      })),
    };
  }

  async getNodeTags(): Promise<{ tags: string[] }> {
    await this.delay(100);
    
    const allTags = this.nodes.flatMap(node => node.tags);
    const uniqueTags = Array.from(new Set(allTags));
    
    return {
      tags: uniqueTags.sort(),
    };
  }

  async getTNodeStats(): Promise<TNodeStats> {
    await this.delay(100);
    
    const totalNodes = this.nodes.length;
    const activeNodes = this.nodes.filter(node => node.isActive).length;
    const inactiveNodes = totalNodes - activeNodes;

    const byType: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    this.nodes.forEach(node => {
      byType[node.type] = (byType[node.type] || 0) + 1;
      byCategory[node.category] = (byCategory[node.category] || 0) + 1;
    });

    // Count recent nodes (created in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentCreated = this.nodes.filter(node => 
      new Date(node.createdAt) > sevenDaysAgo
    ).length;

    return {
      total_nodes: totalNodes,
      active_nodes: activeNodes,
      inactive_nodes: inactiveNodes,
      by_type: byType,
      by_category: byCategory,
      recent_created: recentCreated,
    };
  }

  async searchNodes(query: string, filters: Omit<TNodeFilters, 'search'> = {}): Promise<TPaginatedResponse<TNode>> {
    return this.getNodes({ ...filters, search: query });
  }
}

// Create and export a singleton instance
export const mockNodesApi = new MockNodesApiClient();

// Export the class for testing or custom instances
export { MockNodesApiClient };
