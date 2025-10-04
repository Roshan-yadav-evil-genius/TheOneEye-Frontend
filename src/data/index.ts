// Dummy data exports - centralized location for all mock/test data
// This file provides a single entry point for all dummy data used in the application

// Node data
export { mockNodes } from './nodes/mock-nodes';

// Workflow data
export { mockWorkflows } from './workflows/mock-workflows';

// Form data
export { sampleInputData } from './forms/sample-data';
export { 
  sampleFormConfigurations, 
  getSampleConfiguration, 
  getAllSampleConfigurations 
} from './forms/sample-form-configurations';

// Store-specific data
export { mockProjects } from './stores/mock-projects';
export { mockNodesStore } from './stores/mock-nodes-store';
export { mockWorkflowsStore } from './stores/mock-workflows-store';

// Dashboard data
export { default as dashboardData } from './dashboard/data.json';
