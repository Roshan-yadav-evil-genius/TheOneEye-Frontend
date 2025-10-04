# Codebase Health Check - Single Responsibility Principle

This document outlines the components and sections of the codebase that violate the Single Responsibility Principle (SRP). Each entry includes a description of the violation and the necessary changes to align the code with the SRP.

## 1. `src/components/FormBuilder/FormBuilder.tsx`

**Violation:** This component is responsible for:

1.  **State Management:** It uses the `useFormBuilder` hook, which manages the state of the form widgets.
2.  **Drag and Drop Logic:** It handles the drag and drop functionality for reordering widgets using `dnd-kit`.
3.  **Rendering Logic:** It conditionally renders either the `BuilderCanvas` or the `JsonEditor` based on the `isJsonMode` state.
4.  **Drag Overlay:** It renders the drag overlay for the widgets.

**Problem:** The component has multiple responsibilities, making it complex and difficult to maintain. The drag and drop logic is tightly coupled with the rendering logic, and the state management is also handled within the component.

**Recommendation:** To adhere to the Single Responsibility Principle, I recommend the following refactoring:

1.  **Extract Drag and Drop Logic:** Create a new component, `DraggableFormBuilder`, to handle the drag and drop functionality. This component will wrap the `FormBuilder` and provide the necessary drag and drop context.
2.  **Simplify FormBuilder:** The `FormBuilder` component should only be responsible for rendering the `BuilderCanvas` or the `JsonEditor` and passing the necessary props.
3.  **Isolate State Management:** The `useFormBuilder` hook is already doing a good job of isolating the state management logic, so no changes are needed there.

## 2. `src/components/workflow/workflow-canvas.tsx`

**Violation:** This component is responsible for:

1.  **State Management:** It manages the state of nodes and edges using `useNodesState` and `useEdgesState` from `reactflow`.
2.  **Drag and Drop Logic:** It handles drag and drop operations for adding new nodes to the canvas.
3.  **Node and Edge Logic:** It contains logic for connecting, deleting, and filtering nodes and edges.
4.  **Rendering Logic:** It renders the `ReactFlow` component, including the background, controls, and minimap.
5.  **Initial Data:** It defines the initial nodes and edges for the workflow.

**Problem:** This component is doing too much. It's a classic example of a "god component" that handles everything related to the workflow canvas. This makes it difficult to test, debug, and maintain.

**Recommendation:** To adhere to the Single Responsibility Principle, I recommend the following refactoring:

1.  **Extract Hooks:** Create custom hooks to manage the state and logic for nodes and edges. For example, `useWorkflowState` could encapsulate the `useNodesState` and `useEdgesState` hooks, as well as the logic for adding, deleting, and connecting nodes and edges.
2.  **Extract Data:** Move the initial nodes and edges to a separate file, for example, `src/data/workflow-initial-data.ts`.
3.  **Extract Components:** Create smaller components for different parts of the UI, such as the drag overlay.
4.  **Simplify WorkflowCanvas:** The `WorkflowCanvas` component should be a pure presentational component that receives the nodes, edges, and event handlers as props and renders the `ReactFlow` component.

## 3. `src/components/pages/nodes-page.tsx`

**Violation:** This component is responsible for:

1.  **State Management:** It manages the state of the nodes using `useNodesStore` and the UI state using `useUIStore`.
2.  **Data Fetching:** It loads the nodes on component mount using `loadNodes`.
3.  **UI Logic:** It handles the logic for opening and closing the delete confirmation dialog.
4.  **Navigation:** It uses the `useRouter` hook to navigate to the edit page.
5.  **Rendering Logic:** It renders the `NodesList` component and the delete confirmation dialog.

**Problem:** This component has too many responsibilities. It's responsible for fetching data, managing state, handling user interactions, and rendering the UI. This makes the component complex and difficult to test and maintain.

**Recommendation:** To adhere to the Single Responsibility Principle, I recommend the following refactoring:

1.  **Extract Hooks:** Create a custom hook, `useNodesPage`, to encapsulate the logic for fetching nodes, deleting nodes, and managing the delete confirmation dialog. This hook will also handle the navigation logic.
2.  **Simplify NodesPage:** The `NodesPage` component should be a pure presentational component that receives the nodes, event handlers, and the state of the delete confirmation dialog as props and renders the UI.

## 4. `src/components/pages/workflow-page.tsx`

**Violation:** This component is responsible for:

1.  **Data Fetching:** It loads the workflows on component mount using `loadTWorkflows`.
2.  **State Management:** It manages the state of the workflows using `useWorkflowStore`.
3.  **Rendering Logic:** It renders the `WorkflowList` component.

**Problem:** This component is responsible for both fetching data and rendering the UI. This makes the component harder to test and reuse.

**Recommendation:** To adhere to the Single Responsibility Principle, I recommend the following refactoring:

1.  **Extract Data Fetching Logic:** Create a container component that is responsible for fetching the data and passing it to the `WorkflowPage` component.
2.  **Simplify WorkflowPage:** The `WorkflowPage` component should be a pure presentational component that receives the workflows as props and renders the `WorkflowList` component.

## 5. `src/components/nodes/nodes-table.tsx`

**Violation:** This component is responsible for:

1.  **State Management:** It manages the state of selected rows, current page, rows per page, search term, filters, and column visibility.
2.  **Data Filtering and Pagination:** It filters the nodes based on the search term and filters, and it paginates the data.
3.  **Rendering Logic:** It renders the table, including the header, body, and pagination controls. It also renders various UI elements like badges, icons, and dropdown menus.
4.  **UI Logic:** It handles user interactions like selecting rows, changing pages, and toggling column visibility.

**Problem:** This component is a classic example of a "god component" that does everything. It's responsible for state management, data manipulation, and rendering. This makes the component very large, complex, and difficult to test and maintain.

**Recommendation:** To adhere to the Single Responsibility Principle, I recommend the following refactoring:

1.  **Extract Hooks:** Create a custom hook, `useNodesTable`, to encapsulate the logic for managing the table state, including selection, pagination, searching, and filtering.
2.  **Extract Components:** Create smaller, reusable components for different parts of the table, such as the table header, row, and pagination controls. For example, a `NodesTableRow` component could be created to render a single row in the table.
3.  **Simplify NodesTable:** The `NodesTable` component should be a pure presentational component that receives the nodes and event handlers as props and renders the table.

## 6. `src/components/workflow/workflow-list.tsx`

**Violation:** This component is responsible for:

1.  **State Management:** It manages the state of the delete dialog, the workflow to delete, the edit dialog, and the workflow to edit.
2.  **UI Logic:** It handles the logic for opening and closing the create, edit, and delete dialogs.
3.  **Data Deletion:** It handles the deletion of workflows.
4.  **Navigation:** It uses the `useRouter` hook to navigate to the workflow edit and details pages.
5.  **Rendering Logic:** It renders the `WorkflowTable` component, the create, edit, and delete dialogs, and an empty state message.

**Problem:** This component has too many responsibilities. It's responsible for managing the state of multiple dialogs, handling user interactions, and rendering the UI. This makes the component complex and difficult to test and maintain.

**Recommendation:** To adhere to the Single Responsibility Principle, I recommend the following refactoring:

1.  **Extract Hooks:** Create a custom hook, `useWorkflowList`, to encapsulate the logic for managing the dialogs, deleting workflows, and handling navigation.
2.  **Simplify WorkflowList:** The `WorkflowList` component should be a pure presentational component that receives the workflows and event handlers as props and renders the UI.
3.  **Co-locate Dialogs:** The dialogs should be co-located with the components that use them. For example, the `CreateWorkflowDialog` could be moved to the `WorkflowTable` component.

## 7. `src/components/workflow/workflow-table.tsx`

**Violation:** This component is responsible for:

1.  **State Management:** It manages the state of selected rows, current page, rows per page, search term, filters, and column visibility.
2.  **Data Filtering and Pagination:** It filters the workflows based on the search term and filters, and it paginates the data.
3.  **Rendering Logic:** It renders the table, including the header, body, and pagination controls. It also renders various UI elements like badges, icons, and dropdown menus.
4.  **UI Logic:** It handles user interactions like selecting rows, changing pages, and toggling column visibility.

**Problem:** This component is a "god component" that handles everything related to the workflow table. It's responsible for state management, data manipulation, and rendering, making it large, complex, and difficult to test and maintain.

**Recommendation:** To adhere to the Single Responsibility Principle, I recommend the following refactoring:

1.  **Extract Hooks:** Create a custom hook, `useWorkflowTable`, to encapsulate the logic for managing the table state, including selection, pagination, searching, and filtering.
2.  **Extract Components:** Create smaller, reusable components for different parts of the table, such as the table header, row, and pagination controls. For example, a `WorkflowTableRow` component could be created to render a single row in the table.
3.  **Simplify WorkflowTable:** The `WorkflowTable` component should be a pure presentational component that receives the workflows and event handlers as props and renders the table.

## 8. `src/components/dashboard/dashboard-controls.tsx`

**Violation:** This component is responsible for:

1.  **Handling Alert Dialogs:** It contains the logic for displaying various types of alert dialogs.
2.  **Handling Toast Notifications:** It contains the logic for displaying various types of toast notifications.
3.  **Displaying Dashboard Metrics:** It renders the dashboard metrics.
4.  **Displaying Quick Actions:** It renders the quick actions buttons.

**Problem:** This component has too many responsibilities. It's a mix of a demo/testing component and a dashboard UI component. This makes it difficult to understand the component's primary purpose.

**Recommendation:** To adhere to the Single Responsibility Principle, I recommend the following refactoring:

1.  **Extract Demo Logic:** The logic for demonstrating alert dialogs and toast notifications should be moved to a separate storybook file or a dedicated demo page.
2.  **Create Separate Components:** The dashboard metrics and quick actions should be extracted into their own components, e.g., `DashboardMetrics` and `QuickActions`.
3.  **Simplify DashboardControls:** The `DashboardControls` component should be responsible for the layout of the dashboard controls, and it should render the `DashboardMetrics` and `QuickActions` components.

## 9. `src/components/global/NavBar.tsx`

**Violation:** This component is responsible for:

1.  **Rendering the Logo:** It renders the application logo.
2.  **Rendering the Desktop Navigation:** It renders the navigation links for desktop screens.
3.  **Rendering the Mobile Menu:** It renders the mobile menu, including the toggle button, overlay, header, and navigation links.
4.  **Managing Mobile Menu State:** It manages the open/closed state of the mobile menu.

**Problem:** This component has multiple responsibilities, making it large and complex. The logic for the desktop and mobile navigation is intertwined, and the state management for the mobile menu is handled within the component.

**Recommendation:** To adhere to the Single Responsibility Principle, I recommend the following refactoring:

1.  **Extract Components:** Create separate components for the `Logo`, `DesktopNav`, and `MobileMenu`. The `MobileMenu` component can be further broken down into smaller components for the toggle button, overlay, and header.
2.  **Isolate State Management:** The state of the mobile menu should be managed by a custom hook, e.g., `useMobileMenu`, or a state management library like Zustand.
3.  **Simplify NavBar:** The `NavBar` component should be a pure presentational component that renders the `Logo`, `DesktopNav`, and `MobileMenu` components.

## 10. `src/components/workflow/node-edit-dialog.tsx`

**Violation:** This component is responsible for:

1.  **Managing Dialog State:** It manages the open/closed state of the dialog.
2.  **Managing Node Data:** It manages the state of the node data being edited.
3.  **Managing Tabs:** It manages the active tab in the dialog.
4.  **Rendering Layout:** It renders the layout of the dialog, including the resizable panels.
5.  **Rendering Child Components:** It renders the `InputSection`, `OutputSection`, and `NodeEditor` components.

**Problem:** This component is a large and complex component that has too many responsibilities. It's responsible for managing the state of the dialog, the node data, and the tabs, as well as rendering the layout and child components.

**Recommendation:** To adhere to the Single Responsibility Principle, I recommend the following refactoring:

1.  **Extract Hooks:** Create a custom hook, `useNodeEditDialog`, to encapsulate the logic for managing the dialog state, the node data, and the tabs.
2.  **Extract Components:** Create smaller, reusable components for the different sections of the dialog, such as the header and the resizable panels.
3.  **Simplify NodeEditDialog:** The `NodeEditDialog` component should be a pure presentational component that receives the state and event handlers as props and renders the UI.

## 11. `src/components/workflow/workflow-layout.tsx`

**Violation:** This component is responsible for:

1.  **Managing Layout State:** It manages the state of the sidebar, selected nodes, search term, filters, line type, and minimap visibility.
2.  **Handling User Interactions:** It handles user interactions like running/stopping the workflow, selecting nodes, and changing the line type.
3.  **Rendering Layout:** It renders the layout of the workflow page, including the sidebar, stats header, and canvas.

**Problem:** This component has too many responsibilities. It's responsible for managing the state of the layout, handling user interactions, and rendering the UI.

**Recommendation:** To adhere to the Single Responsibility Principle, I recommend the following refactoring:

1.  **Extract Hooks:** Create a custom hook, `useWorkflowLayout`, to encapsulate the logic for managing the layout state and handling user interactions.
2.  **Simplify WorkflowLayout:** The `WorkflowLayout` component should be a pure presentational component that receives the state and event handlers as props and renders the UI.

## 12. `src/components/pages/create-node-page.tsx`

**Violation:** This component is responsible for:

1.  **Managing Form State:** It uses `react-hook-form` to manage the form state.
2.  **Handling Form Submission:** It handles the submission of the form, including creating the node and the form configuration.
3.  **Managing UI State:** It manages the state of the logo preview and the preview dialog.
4.  **Rendering UI:** It renders the form, the form configuration editor, and the preview dialog.

**Problem:** This component has too many responsibilities. It's responsible for managing the form state, handling form submission, managing UI state, and rendering the UI.

**Recommendation:** To adhere to the Single Responsibility Principle, I recommend the following refactoring:

1.  **Extract Hooks:** Create a custom hook, `useCreateNodePage`, to encapsulate the logic for managing the form state, handling form submission, and managing the UI state.
2.  **Simplify CreateNodePage:** The `CreateNodePage` component should be a pure presentational component that receives the state and event handlers as props and renders the UI.

## 13. `src/components/pages/edit-node-page.tsx`

**Violation:** This component is responsible for:

1.  **Fetching Data:** It fetches the node data when the component mounts.
2.  **Managing Form State:** It manages the state of the form data.
3.  **Handling Form Submission:** It handles the submission of the form, including updating the node and the form configuration.
4.  **Managing UI State:** It manages the state of the logo preview and the loading/error states.
5.  **Rendering UI:** It renders the form and the form configuration editor.

**Problem:** This component has too many responsibilities. It's responsible for fetching data, managing form state, handling form submission, managing UI state, and rendering the UI.

**Recommendation:** To adhere to the Single Responsibility Principle, I recommend the following refactoring:

1.  **Extract Hooks:** Create a custom hook, `useEditNodePage`, to encapsulate the logic for fetching data, managing form state, handling form submission, and managing the UI state.
2.  **Simplify EditNodePage:** The `EditNodePage` component should be a pure presentational component that receives the state and event handlers as props and renders the UI.
