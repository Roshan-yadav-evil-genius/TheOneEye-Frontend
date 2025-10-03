# NodePreview Components

This folder contains the refactored NodePreview components, split into smaller, focused components for better maintainability and reusability.

## Component Structure

```
NodePreview/
├── index.ts                 # Exports all components
├── NodePreview.tsx          # Main container component
├── NodeHeader.tsx           # Node header with logo, name, info, tags, version
├── NodeMetadata.tsx         # Node type and category metadata
├── FormFieldsSection.tsx    # Form fields section container
├── FieldPreview.tsx         # Individual field preview rendering
└── README.md               # This documentation
```

## Components

### NodePreview.tsx
Main container component that orchestrates all sub-components. Handles the overall layout and structure.

**Props:**
- `nodeData: Partial<Node>` - Node data to display
- `logoPreview?: string | null` - Optional logo preview URL

### NodeHeader.tsx
Displays the node header section including:
- Logo (uploaded image or fallback with initial)
- Node name with info tooltip
- Tags as badges
- Version information

**Props:**
- `nodeData: Partial<Node>` - Node data
- `logoPreview?: string | null` - Optional logo preview URL

### NodeMetadata.tsx
Displays node metadata including:
- Type badge
- Category badge

**Props:**
- `nodeData: Partial<Node>` - Node data

### FormFieldsSection.tsx
Container for form fields section including:
- Section header with field count
- Individual field cards
- Field details and metadata

**Props:**
- `nodeData: Partial<Node>` - Node data

### FieldPreview.tsx
Renders individual form field previews based on field type:
- Text, email, password inputs
- Number inputs
- Textarea
- Select dropdowns
- Checkboxes
- Radio buttons
- Date pickers
- File upload areas

**Props:**
- `widget: WidgetConfig` - Individual widget configuration

## Usage

```tsx
import { NodePreview } from '@/components/NodePreview';

// In your component
<NodePreview 
  nodeData={formData} 
  logoPreview={logoPreview}
/>
```

## Benefits of This Structure

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be used independently
3. **Maintainability**: Easier to modify individual sections
4. **Testability**: Each component can be tested in isolation
5. **Readability**: Cleaner, more focused code
6. **Type Safety**: Proper TypeScript interfaces for each component
