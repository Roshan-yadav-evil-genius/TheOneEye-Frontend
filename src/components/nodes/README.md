# Node Components

This directory contains reusable components for building workflow nodes. The components are designed to be modular and focused on specific responsibilities.

## Components

### NodeHeader
- **Purpose**: Displays the node's avatar, title, and action buttons (delete, drag handle)
- **Props**: `nodeType`, `selected`, `onDelete`, `className`
- **Reusable**: Yes - can be used in any node type

### FileField
- **Purpose**: Handles file input with upload status display
- **Props**: `value`, `onChange`, `required`, `existingFileId`, `className`
- **Reusable**: Yes - can be used anywhere file uploads are needed

### FormFieldRenderer
- **Purpose**: Renders form fields based on configuration, with support for different field types
- **Props**: `field`, `control`, `name`, `existingValue`, `className`
- **Supported Field Types**: 
  - `text`, `email`, `password`, `number` - Standard input fields
  - `textarea` - Multi-line text input
  - `select` - Dropdown selection with options
  - `file` - File upload with status display
- **Reusable**: Yes - can render any form field type based on configuration

### FormActions
- **Purpose**: Provides Clear and Save buttons with loading states
- **Props**: `isSubmitting`, `isClearing`, `onClear`, `onSave`, `hasFields`, `className`
- **Reusable**: Yes - can be used in any form that needs these actions

### NodeHandles
- **Purpose**: Renders input/output connection handles for React Flow
- **Props**: `hasInput`, `hasOutput`
- **Reusable**: Yes - can be used in any React Flow node

## Custom Hook

### useNodeOperations
- **Purpose**: Manages all node-related operations (delete, submit, clear)
- **Location**: `/src/hooks/useNodeOperations.ts`
- **Returns**: `{ deleteNode, submitNodeData, clearNodeData, isClearing }`
- **Reusable**: Yes - can be used in any node component

## Usage Example

```tsx
import { 
  NodeHeader, 
  FormFieldRenderer, 
  FormActions, 
  NodeHandles 
} from '@/components/nodes'
import { useNodeOperations } from '@/hooks/useNodeOperations'

const MyNode = (props) => {
  const { deleteNode, submitNodeData, clearNodeData, isClearing } = useNodeOperations({
    workflowId: props.workflowId,
    nodeId: props.id,
    nodeConfig: props.data.config,
    nodeTypeConfig: props.data.node_type.config
  })

  return (
    <section>
      <NodeHeader 
        nodeType={props.data.node_type}
        onDelete={deleteNode}
      />
      {/* Form content */}
      <FormActions
        isSubmitting={isSubmitting}
        isClearing={isClearing}
        onClear={clearNodeData}
        onSave={submitNodeData}
        hasFields={true}
      />
      <NodeHandles 
        hasInput={props.data.node_type.input}
        hasOutput={props.data.node_type.output}
      />
    </section>
  )
}
```

## Field Configuration Examples

### Select Field
```json
{
  "key": "country",
  "label": "Country",
  "type": "select",
  "required": true,
  "options": [
    { "label": "India", "value": "IN" },
    { "label": "USA", "value": "US" }
  ]
}
```

### Textarea Field
```json
{
  "key": "description",
  "label": "Description",
  "type": "textarea",
  "placeholder": "Enter your description here...",
  "required": false
}
```

### Number Field with Constraints
```json
{
  "key": "temperature",
  "label": "Temperature",
  "type": "number",
  "min": 0,
  "max": 2,
  "step": 0.1,
  "required": true
}
```

## Benefits

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be used across different node types
3. **Maintainability**: Easier to test and modify individual components
4. **Type Safety**: All components are fully typed with TypeScript
5. **Consistency**: Standardized UI patterns across all nodes
