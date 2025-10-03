# Types Directory

This directory contains all type definitions for the application, organized by category for better maintainability and discoverability.

## Structure

```
types/
├── index.ts                 # Main export file - re-exports all types
├── api/                     # API-related types
│   ├── index.ts
│   ├── responses.ts         # API response types
│   ├── requests.ts          # API request types
│   └── errors.ts            # API error types
├── common/                  # Common types used across the app
│   ├── index.ts
│   ├── entities.ts          # Core entity types (Node, User, Workflow, etc.)
│   └── constants.ts         # Type constants and enums
├── ui/                      # UI-related types
│   ├── index.ts
│   ├── state.ts             # UI state and store types
│   └── components.ts        # Component-specific types
├── workflow/                # Workflow-specific types
│   ├── index.ts
│   └── workflow.ts          # Workflow canvas and node types
└── forms/                   # Form-related types
    ├── index.ts
    └── widgets.ts           # Form widget types
```

## Usage

Import types from the main index file:

```typescript
import { TNode, TUser, TWorkflow, TApiResponse, TUIState } from '@/types';
```

Or import from specific categories:

```typescript
import { TNode, TUser } from '@/types/common';
import { TApiResponse } from '@/types/api';
import { TUIState } from '@/types/ui';
```

## Migration Notes

This directory was created as part of a refactoring effort to centralize all type definitions. The following files were updated to use the new centralized types:

- `src/lib/api/types.ts` - Now re-exports from `@/types/api`
- `src/stores/types.ts` - Now re-exports from `@/types`
- `src/data/nodes.ts` - Updated to import from `@/types`
- `src/components/FormBuilder/inputs.ts` - Now re-exports from `@/types/forms`
- All component files - Updated to import from `@/types`

## Benefits

1. **Centralized Management**: All types are in one place
2. **Better Organization**: Types are categorized by purpose
3. **Easier Maintenance**: Changes to types only need to be made in one location
4. **Improved Discoverability**: Clear structure makes it easy to find relevant types
5. **Consistent Imports**: Standardized import patterns across the codebase
