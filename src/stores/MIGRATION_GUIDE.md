# Migration Guide: Integrating Zustand Stores

This guide helps you migrate your existing components to use the new Zustand store architecture.

## Step 1: Update Imports

### Before (using local state or context)
```typescript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
```

### After (using Zustand stores)
```typescript
import { useUserStore, useNodesStore, useUIStore, uiHelpers } from '@/stores';
```

## Step 2: Replace Local State with Store State

### Before (local state)
```typescript
function MyComponent() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const loadNodes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/nodes');
      const data = await response.json();
      setNodes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
}
```

### After (Zustand store)
```typescript
function MyComponent() {
  const { nodes, isLoading, error, loadNodes } = useNodesStore();
  
  useEffect(() => {
    loadNodes();
  }, [loadNodes]);
}
```

## Step 3: Replace Context with Store Hooks

### Before (React Context)
```typescript
import { useContext } from 'react';
import { UserContext } from '@/contexts/user-context';

function MyComponent() {
  const { user, login, logout } = useContext(UserContext);
}
```

### After (Zustand store)
```typescript
import { useUserStore } from '@/stores';

function MyComponent() {
  const { user, login, logout } = useUserStore();
}
```

## Step 4: Update Form Handling

### Before (local form state)
```typescript
function CreateNodeForm() {
  const [formData, setFormData] = useState({
    name: '',
    type: 'action',
    description: '',
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const newNode = await response.json();
      // Update local state or refetch
    } catch (error) {
      // Handle error
    }
  };
}
```

### After (store integration)
```typescript
function CreateNodeForm() {
  const { createNode } = useNodesStore();
  const [formData, setFormData] = useState({
    name: '',
    type: 'action',
    description: '',
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNode({
        ...formData,
        version: '1.0.0',
        tags: [],
        formConfiguration: {},
        isActive: true,
      });
      uiHelpers.showSuccess('Success', 'Node created successfully');
    } catch (error) {
      uiHelpers.showError('Error', 'Failed to create node');
    }
  };
}
```

## Step 5: Update Navigation and UI State

### Before (local UI state)
```typescript
function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('system');
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
}
```

### After (UI store)
```typescript
import { useUIStore } from '@/stores';

function Layout() {
  const { sidebarOpen, theme, toggleSidebar, setTheme } = useUIStore();
}
```

## Step 6: Update Data Fetching

### Before (useEffect with fetch)
```typescript
function NodesList() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await fetch('/api/nodes');
        const data = await response.json();
        setNodes(data);
      } catch (error) {
        console.error('Failed to fetch nodes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNodes();
  }, []);
}
```

### After (store integration)
```typescript
function NodesList() {
  const { nodes, isLoading, loadNodes } = useNodesStore();
  
  useEffect(() => {
    loadNodes();
  }, [loadNodes]);
}
```

## Step 7: Update Error Handling

### Before (local error state)
```typescript
function MyComponent() {
  const [error, setError] = useState(null);
  
  const handleAction = async () => {
    try {
      // Some action
    } catch (err) {
      setError(err.message);
    }
  };
  
  if (error) {
    return <div>Error: {error}</div>;
  }
}
```

### After (store error handling)
```typescript
function MyComponent() {
  const { error, clearError } = useNodesStore();
  
  const handleAction = async () => {
    try {
      // Some action
    } catch (err) {
      uiHelpers.showError('Error', err.message);
    }
  };
  
  if (error) {
    return (
      <div>
        Error: {error}
        <button onClick={clearError}>Dismiss</button>
      </div>
    );
  }
}
```

## Step 8: Update Modal Management

### Before (local modal state)
```typescript
function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
}
```

### After (UI store modals)
```typescript
import { useUIStore, uiHelpers } from '@/stores';

function MyComponent() {
  const { modals, openModal, closeModal } = useUIStore();
  
  const handleOpenModal = () => uiHelpers.openCreateNodeModal();
  const handleCloseModal = () => closeModal('createNode');
}
```

## Step 9: Update Breadcrumb Navigation

### Before (manual breadcrumb management)
```typescript
function MyComponent() {
  const [breadcrumbs, setBreadcrumbs] = useState([
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Current Page' },
  ]);
}
```

### After (UI store breadcrumbs)
```typescript
import { useUIStore, uiHelpers } from '@/stores';

function MyComponent() {
  const { breadcrumbs } = useUIStore();
  
  useEffect(() => {
    uiHelpers.setPageBreadcrumbs('Current Page');
  }, []);
}
```

## Step 10: Update Theme Management

### Before (manual theme handling)
```typescript
function ThemeToggle() {
  const [theme, setTheme] = useState('system');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };
}
```

### After (UI store theme)
```typescript
import { useUIStore } from '@/stores';

function ThemeToggle() {
  const { theme, toggleTheme } = useUIStore();
}
```

## Common Patterns

### 1. Loading States
```typescript
// All stores have isLoading state
const { isLoading } = useNodesStore();

if (isLoading) {
  return <LoadingSpinner />;
}
```

### 2. Error States
```typescript
// All stores have error state
const { error, clearError } = useNodesStore();

if (error) {
  return <ErrorMessage error={error} onDismiss={clearError} />;
}
```

### 3. Optimistic Updates
```typescript
// Stores handle optimistic updates automatically
const { createNode } = useNodesStore();

const handleCreate = async () => {
  try {
    await createNode(nodeData);
    // Node is immediately added to the store
  } catch (error) {
    // Error is handled and node is removed if creation failed
  }
};
```

### 4. Store Selectors
```typescript
// Use selectors for complex data filtering
import { storeSelectors } from '@/stores';

const filteredNodes = storeSelectors.getFilteredNodes();
const unreadNotifications = storeSelectors.getUnreadNotifications();
```

## Testing Store Integration

### 1. Mock Stores for Testing
```typescript
// In your test files
import { useNodesStore } from '@/stores';

// Mock the store
jest.mock('@/stores', () => ({
  useNodesStore: () => ({
    nodes: mockNodes,
    isLoading: false,
    error: null,
    loadNodes: jest.fn(),
    createNode: jest.fn(),
  }),
}));
```

### 2. Test Store Actions
```typescript
// Test store actions directly
import { useNodesStore } from '@/stores';

test('should create node', async () => {
  const { createNode } = useNodesStore.getState();
  const newNode = await createNode(mockNodeData);
  expect(newNode).toBeDefined();
});
```

## Benefits After Migration

1. **Centralized State**: All application state is managed in one place
2. **Consistent Data**: No more data synchronization issues between components
3. **Better Performance**: Selective subscriptions prevent unnecessary re-renders
4. **Easier Testing**: Stores can be easily mocked and tested
5. **Type Safety**: Full TypeScript support with proper typing
6. **Developer Experience**: Redux DevTools integration for debugging
7. **Persistence**: Automatic persistence of user preferences and authentication state

## Next Steps

1. Start with one component at a time
2. Test thoroughly after each migration
3. Update your existing context providers to use stores instead
4. Remove unused context files after migration
5. Update your tests to use store mocks
6. Consider using store selectors for complex data transformations
