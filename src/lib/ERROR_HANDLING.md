# Error Handling System

This document describes the comprehensive error handling system implemented for the frontend application using Shadcn Sonner for toast notifications.

## Overview

The error handling system provides:
- **DRF Error Parsing**: Automatically extracts meaningful error messages from Django REST Framework responses
- **Toast Notifications**: User-friendly error messages using Sonner
- **Network Error Handling**: Graceful handling of network issues
- **Success Feedback**: Positive feedback for successful operations

## Components

### 1. Error Handler (`/src/lib/errorHandler.ts`)

Core utility functions for handling errors and showing toasts:

#### `extractErrorMessage(error: AxiosDRFError): string`
Extracts user-friendly error messages from DRF error responses:
- Handles validation errors (field-specific and non-field)
- Processes different HTTP status codes
- Provides fallback messages for unknown errors

#### `showErrorToast(error: AxiosDRFError, title?: string)`
Shows error toast with extracted message:
```typescript
showErrorToast(error, 'Save Failed')
```

#### `showSuccessToast(message: string, title?: string)`
Shows success toast:
```typescript
showSuccessToast('Node data saved successfully')
```

#### `showInfoToast(message: string, title?: string)`
Shows informational toast:
```typescript
showInfoToast('Operation in progress...')
```

### 2. API Client (`/src/lib/apiClient.ts`)

Enhanced Axios instance with:
- **Request Interceptors**: For adding auth tokens, etc.
- **Response Interceptors**: For handling common errors
- **Timeout Configuration**: 10-second timeout for requests
- **Error Transformation**: Converts network errors to user-friendly messages

### 3. Node Operations Hook (`/src/hooks/useNodeOperations.ts`)

Updated with comprehensive error handling:
- **Delete Operations**: Shows success/error toasts
- **Save Operations**: Handles file upload errors and validation errors
- **Clear Operations**: Provides feedback for data clearing

## Error Types Handled

### 1. Network Errors
- **No Internet Connection**: "Network error. Please check your connection."
- **Request Timeout**: "Request timeout. Please try again."
- **Server Unreachable**: "Network error. Please check your connection."

### 2. HTTP Status Codes
- **400 Bad Request**: "Bad request. Please check your input and try again."
- **401 Unauthorized**: "Unauthorized. Please log in and try again."
- **403 Forbidden**: "Forbidden. You do not have permission to perform this action."
- **404 Not Found**: "Resource not found. Please refresh and try again."
- **500 Server Error**: "Server error. Please try again later."

### 3. DRF Validation Errors
- **Field Errors**: "field_name: error message"
- **Non-field Errors**: "error message"
- **Multiple Errors**: Combined with semicolons

## Usage Examples

### Basic Error Handling
```typescript
import { showErrorToast, showSuccessToast } from '@/lib/errorHandler'

try {
  await someApiCall()
  showSuccessToast('Operation successful')
} catch (error) {
  showErrorToast(error, 'Operation Failed')
}
```

### In React Components
```typescript
const handleSubmit = async (data) => {
  try {
    await submitData(data)
    showSuccessToast('Data saved successfully')
  } catch (error) {
    showErrorToast(error, 'Save Failed')
  }
}
```

### With Custom Hook
```typescript
const { deleteNode, submitNodeData, clearNodeData } = useNodeOperations({
  workflowId,
  nodeId,
  nodeConfig,
  nodeTypeConfig
})

// All operations now include automatic error handling
await deleteNode() // Shows success/error toast automatically
```

## Toast Configuration

### Error Toasts
- **Duration**: 5 seconds
- **Type**: Error (red)
- **Content**: Title + Description

### Success Toasts
- **Duration**: 3 seconds
- **Type**: Success (green)
- **Content**: Title + Description

### Info Toasts
- **Duration**: 3 seconds
- **Type**: Info (blue)
- **Content**: Title + Description

## Testing

Use the `ErrorHandlingDemo` component to test different error scenarios:
- Network errors
- DRF validation errors
- Server errors
- Success messages
- Info messages

## Best Practices

1. **Always wrap async operations** in try-catch blocks
2. **Use specific error titles** for better user experience
3. **Provide context** in error messages when possible
4. **Show success feedback** for important operations
5. **Handle file upload errors** separately for better UX

## Integration

The error handling system is automatically integrated into:
- All node operations (delete, save, clear)
- File upload operations
- API client requests
- Form submissions

No additional setup is required - error handling works out of the box!
