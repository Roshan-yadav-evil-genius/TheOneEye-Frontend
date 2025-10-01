// Example: How to integrate Zustand stores into existing components
// This file demonstrates best practices for using the stores in your application

import React, { useEffect } from 'react';
import { 
  useUserStore, 
  useNodesStore, 
  useWorkflowStore, 
  useFormStore,
  useUIStore, 
  uiHelpers,
  storeSelectors 
} from '@/stores';

// Example 1: Basic store usage in a component
export function ExampleComponent() {
  // Access store state and actions
  const { user, isAuthenticated, login } = useUserStore();
  const { nodes, loadNodes, createNode } = useNodesStore();
  const { workflows, loadWorkflows } = useWorkflowStore();
  const { notifications, addNotification } = useUIStore();

  // Load data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadNodes();
      loadWorkflows();
    }
  }, [isAuthenticated, loadNodes, loadWorkflows]);

  // Example action handler
  const handleCreateNode = async () => {
    try {
      const newNode = await createNode({
        name: 'New Node',
        type: 'action',
        category: 'system',
        description: 'Example node',
        version: '1.0.0',
        tags: ['example'],
        formConfiguration: {},
        isActive: true,
      });

      // Show success notification
      uiHelpers.showSuccess('Success!', 'Node created successfully');
    } catch (error) {
      uiHelpers.showError('Error', 'Failed to create node');
    }
  };

  return (
    <div>
      <h1>Welcome, {user?.name || 'Guest'}</h1>
      <p>Nodes: {nodes.length}</p>
      <p>Workflows: {workflows.length}</p>
      <button onClick={handleCreateNode}>Create Node</button>
    </div>
  );
}

// Example 2: Using store selectors
export function FilteredNodesList() {
  const { nodes, filters, setFilters } = useNodesStore();
  
  // Use selector to get filtered nodes
  const filteredNodes = storeSelectors.getFilteredNodes();
  
  return (
    <div>
      <input
        placeholder="Search nodes..."
        value={filters.search || ''}
        onChange={(e) => setFilters({ search: e.target.value })}
      />
      <ul>
        {filteredNodes.map((node) => (
          <li key={node.id}>{node.name}</li>
        ))}
      </ul>
    </div>
  );
}

// Example 3: Complex store interactions
export function WorkflowBuilder() {
  const { activeWorkflow, setActiveWorkflow, addNodeToWorkflow } = useWorkflowStore();
  const { selectedNode, selectNode } = useNodesStore();
  const { openModal, closeModal } = useUIStore();

  const handleAddNodeToWorkflow = async () => {
    if (!activeWorkflow || !selectedNode) return;

    try {
      await addNodeToWorkflow(activeWorkflow.id, selectedNode);
      uiHelpers.showSuccess('Success', 'Node added to workflow');
    } catch (error) {
      uiHelpers.showError('Error', 'Failed to add node to workflow');
    }
  };

  return (
    <div>
      <h2>Workflow Builder</h2>
      {activeWorkflow && (
        <div>
          <h3>{activeWorkflow.name}</h3>
          <p>Nodes: {activeWorkflow.nodes.length}</p>
          {selectedNode && (
            <button onClick={handleAddNodeToWorkflow}>
              Add {selectedNode.name} to Workflow
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Example 4: Custom hook for complex store logic
export function useWorkflowWithNodes(workflowId: string) {
  const { workflows } = useWorkflowStore();
  const { nodes } = useNodesStore();
  
  const workflow = workflows.find(w => w.id === workflowId);
  const workflowNodes = nodes.filter(node => 
    workflow?.nodes.some(workflowNode => workflowNode.id === node.id)
  );

  return {
    workflow,
    nodes: workflowNodes,
    isLoading: !workflow || !workflowNodes.length,
  };
}

// Example 5: Error boundary integration
export function StoreErrorBoundary({ children }: { children: React.ReactNode }) {
  const { error, clearError } = useNodesStore();
  const { error: workflowError, clearError: clearWorkflowError } = useWorkflowStore();

  useEffect(() => {
    if (error) {
      uiHelpers.showError('Nodes Error', error);
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    if (workflowError) {
      uiHelpers.showError('Workflow Error', workflowError);
      clearWorkflowError();
    }
  }, [workflowError, clearWorkflowError]);

  return <>{children}</>;
}

// Example 6: Form integration with stores
export function NodeForm() {
  const { createNode } = useNodesStore();
  const { createFormConfiguration } = useFormStore();
  const [formData, setFormData] = React.useState({
    name: '',
    type: 'action' as const,
    category: 'system' as const,
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create node first
      const node = await createNode({
        ...formData,
        version: '1.0.0',
        tags: [],
        formConfiguration: {},
        isActive: true,
      });

      // Create associated form configuration
      await createFormConfiguration({
        name: `${formData.name} Configuration`,
        description: `Form configuration for ${formData.name}`,
        json: {
          title: `${formData.name} Configuration`,
          elements: [],
        },
        nodeId: node.id,
      });

      uiHelpers.showSuccess('Success', 'Node and form created successfully');
      setFormData({ name: '', type: 'action', category: 'system', description: '' });
    } catch (error) {
      uiHelpers.showError('Error', 'Failed to create node');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Node name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        required
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
      />
      <button type="submit">Create Node</button>
    </form>
  );
}
