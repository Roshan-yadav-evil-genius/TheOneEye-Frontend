// Test file to verify store integration
import { 
  useUserStore, 
  useNodesStore, 
  useWorkflowStore, 
  useFormStore, 
  useProjectsStore, 
  useUIStore,
  initializeStores,
  resetAllStores,
  syncStores,
  storeSelectors,
  storeActions
} from './index';

// Test store initialization
export const testStoreInitialization = async () => {
  console.log('Testing store initialization...');
  
  try {
    await initializeStores();
    console.log('✅ Store initialization successful');
    
    // Test each store
    const userState = useUserStore.getState();
    const nodesState = useNodesStore.getState();
    const workflowState = useWorkflowStore.getState();
    const formState = useFormStore.getState();
    const projectsState = useProjectsStore.getState();
    const uiState = useUIStore.getState();
    
    console.log('User store state:', userState);
    console.log('Nodes store state:', nodesState);
    console.log('Workflow store state:', workflowState);
    console.log('Form store state:', formState);
    console.log('Projects store state:', projectsState);
    console.log('UI store state:', uiState);
    
    return true;
  } catch (error) {
    console.error('❌ Store initialization failed:', error);
    return false;
  }
};

// Test store actions
export const testStoreActions = async () => {
  console.log('Testing store actions...');
  
  try {
    // Test node creation
    const { createNode } = useNodesStore.getState();
    const newNode = await createNode({
      name: 'Test Node',
      type: 'action',
      category: 'system',
      description: 'Test node for integration testing',
      version: '1.0.0',
      tags: ['test'],
      formConfiguration: {},
      isActive: true,
    });
    
    console.log('✅ Node creation successful:', newNode);
    
    // Test workflow creation
    const { createWorkflow } = useWorkflowStore.getState();
    const newWorkflow = await createWorkflow({
      name: 'Test Workflow',
      description: 'Test workflow for integration testing',
      nodes: [newNode],
      connections: [],
      status: 'draft',
      createdBy: 'test-user',
    });
    
    console.log('✅ Workflow creation successful:', newWorkflow);
    
    // Test form configuration creation
    const { createFormConfiguration } = useFormStore.getState();
    const newFormConfig = await createFormConfiguration({
      name: 'Test Form Configuration',
      description: 'Test form configuration for integration testing',
      json: {
        title: 'Test Form',
        elements: [
          {
            type: 'text',
            name: 'testField',
            title: 'Test Field',
            isRequired: true,
          },
        ],
      },
      nodeId: newNode.id,
    });
    
    console.log('✅ Form configuration creation successful:', newFormConfig);
    
    // Test project creation
    const { createProject } = useProjectsStore.getState();
    const newProject = await createProject({
      name: 'Test Project',
      description: 'Test project for integration testing',
      status: 'planning',
      workflows: [newWorkflow.id],
      team: ['test-user'],
      createdBy: 'test-user',
    });
    
    console.log('✅ Project creation successful:', newProject);
    
    return true;
  } catch (error) {
    console.error('❌ Store actions test failed:', error);
    return false;
  }
};

// Test store selectors
export const testStoreSelectors = () => {
  console.log('Testing store selectors...');
  
  try {
    const currentUser = storeSelectors.getCurrentUser();
    const isAuthenticated = storeSelectors.isAuthenticated();
    const filteredNodes = storeSelectors.getFilteredNodes();
    const activeWorkflow = storeSelectors.getActiveWorkflow();
    const activeProject = storeSelectors.getActiveProject();
    const unreadNotifications = storeSelectors.getUnreadNotifications();
    const openModals = storeSelectors.getOpenModals();
    
    console.log('✅ Store selectors test successful');
    console.log('Current user:', currentUser);
    console.log('Is authenticated:', isAuthenticated);
    console.log('Filtered nodes:', filteredNodes);
    console.log('Active workflow:', activeWorkflow);
    console.log('Active project:', activeProject);
    console.log('Unread notifications:', unreadNotifications);
    console.log('Open modals:', openModals);
    
    return true;
  } catch (error) {
    console.error('❌ Store selectors test failed:', error);
    return false;
  }
};

// Test store synchronization
export const testStoreSynchronization = () => {
  console.log('Testing store synchronization...');
  
  try {
    syncStores();
    console.log('✅ Store synchronization successful');
    return true;
  } catch (error) {
    console.error('❌ Store synchronization test failed:', error);
    return false;
  }
};

// Test store reset
export const testStoreReset = () => {
  console.log('Testing store reset...');
  
  try {
    resetAllStores();
    console.log('✅ Store reset successful');
    return true;
  } catch (error) {
    console.error('❌ Store reset test failed:', error);
    return false;
  }
};

// Run all tests
export const runAllStoreTests = async () => {
  console.log('🧪 Running all store integration tests...');
  
  const results = {
    initialization: await testStoreInitialization(),
    actions: await testStoreActions(),
    selectors: testStoreSelectors(),
    synchronization: testStoreSynchronization(),
    reset: testStoreReset(),
  };
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);
  console.log('Results:', results);
  
  return results;
};
