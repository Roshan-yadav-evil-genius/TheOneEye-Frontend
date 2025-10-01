# Zustand Store Architecture

This directory contains the centralized state management system using Zustand for TheOneEye application. The stores are organized to provide consistent data management across all components and pages.

## Store Structure

```
src/stores/
├── types.ts              # TypeScript interfaces and types
├── user-store.ts         # User authentication and profile management
├── nodes-store.ts        # Workflow node management and CRUD operations
├── workflow-store.ts     # Workflow management and execution
├── form-store.ts         # SurveyJS form configurations
├── ui-store.ts          # UI state (sidebar, theme, notifications, modals)
├── projects-store.ts     # Project management and analytics
├── index.ts             # Centralized exports and utilities
└── README.md            # This documentation
```

## Store Overview

### 1. User Store (`useUserStore`)
Manages user authentication, profile data, and permissions.

**Key Features:**
- User login/logout/registration
- Profile updates and refresh
- Authentication state persistence
- Role-based permissions

**Usage:**
```typescript
import { useUserStore } from '@/stores';

const { user, isAuthenticated, login, logout } = useUserStore();
```

### 2. Nodes Store (`useNodesStore`)
Handles workflow node management including CRUD operations and filtering.

**Key Features:**
- Create, update, delete nodes
- Bulk operations
- Node filtering and search
- Form configuration integration

**Usage:**
```typescript
import { useNodesStore } from '@/stores';

const { nodes, selectedNode, createNode, loadNodes } = useNodesStore();
```

### 3. Workflow Store (`useWorkflowStore`)
Manages workflow creation, editing, and execution.

**Key Features:**
- Workflow CRUD operations
- Node and connection management
- Workflow execution (start, pause, stop)
- Selection management

**Usage:**
```typescript
import { useWorkflowStore } from '@/stores';

const { workflows, activeWorkflow, createWorkflow, addNodeToWorkflow } = useWorkflowStore();
```

### 4. Form Store (`useFormStore`)
Manages SurveyJS form configurations and templates.

**Key Features:**
- Form configuration CRUD
- Template management
- Import/export functionality
- Form validation and testing

**Usage:**
```typescript
import { useFormStore } from '@/stores';

const { configurations, createFormConfiguration, validateConfiguration } = useFormStore();
```

### 5. UI Store (`useUIStore`)
Centralizes UI state management including sidebar, theme, and notifications.

**Key Features:**
- Sidebar toggle and state
- Theme management (light/dark/system)
- Breadcrumb navigation
- Notification system
- Modal management

**Usage:**
```typescript
import { useUIStore, uiHelpers } from '@/stores';

const { sidebarOpen, theme, notifications } = useUIStore();
uiHelpers.showSuccess('Success!', 'Operation completed');
```

### 6. Projects Store (`useProjectsStore`)
Handles project management, team collaboration, and analytics.

**Key Features:**
- Project CRUD operations
- Team member management
- Workflow association
- Project analytics and insights

**Usage:**
```typescript
import { useProjectsStore } from '@/stores';

const { projects, activeProject, createProject, getProjectAnalytics } = useProjectsStore();
```

## Store Utilities

### Initialization
```typescript
import { initializeStores } from '@/stores';

// Initialize all stores with default data
await initializeStores();
```

### Store Selectors
```typescript
import { storeSelectors } from '@/stores';

// Get filtered nodes
const filteredNodes = storeSelectors.getFilteredNodes();

// Get unread notifications
const unreadNotifications = storeSelectors.getUnreadNotifications();
```

### Store Actions
```typescript
import { storeActions } from '@/stores';

// Create node with associated form
const { node, formConfig } = await storeActions.createNodeWithForm(nodeData, formData);

// Create workflow with nodes
const { workflow, nodes } = await storeActions.createWorkflowWithNodes(workflowData, nodeIds);
```

## Best Practices

### 1. Store Usage
- Use stores in components with the `useStoreName()` hooks
- Access store state and actions through the hook
- Avoid direct store manipulation outside of components

### 2. Error Handling
- All async operations include error handling
- Errors are stored in each store's `error` state
- Use `clearError()` to reset error states

### 3. Loading States
- All async operations set loading states
- Use `isLoading` to show loading indicators
- Loading states are automatically managed

### 4. Data Persistence
- User store persists authentication state
- UI store persists theme and sidebar preferences
- Other stores are session-based (reset on page refresh)

### 5. Store Synchronization
- Use `syncStores()` to keep related data in sync
- Call after bulk operations or data imports
- Ensures data consistency across stores

## Integration with Backend

All stores are designed to easily integrate with backend APIs:

1. **Replace TODO comments** with actual API calls
2. **Update mock data** with real API responses
3. **Add proper error handling** for network failures
4. **Implement caching strategies** as needed

### Example API Integration:
```typescript
// Before (mock)
await new Promise(resolve => setTimeout(resolve, 1000));

// After (real API)
const response = await fetch('/api/nodes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(nodeData)
});
const result = await response.json();
```

## Type Safety

All stores are fully typed with TypeScript:
- Store state interfaces
- Action method signatures
- Return types for all operations
- Generic type parameters where applicable

## Development Tools

Stores include Zustand devtools integration for debugging:
- Redux DevTools support
- State inspection
- Action tracking
- Time-travel debugging

## Performance Considerations

- Stores use Zustand's built-in optimizations
- Selective subscriptions prevent unnecessary re-renders
- Bulk operations minimize state updates
- Persistence is selective to avoid large localStorage usage

## Future Enhancements

- Add middleware for API caching
- Implement optimistic updates
- Add real-time synchronization
- Create store composition utilities
- Add store testing utilities
