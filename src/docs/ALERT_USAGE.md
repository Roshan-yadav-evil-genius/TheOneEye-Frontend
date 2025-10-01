# Global Alert Dialog Usage Guide

A global Alert Dialog system has been successfully integrated into your application! You can now request user confirmation from anywhere in your app using a consistent, accessible dialog interface.

## Quick Start

### Using the Custom Hook (Recommended)

```tsx
import { useAlert } from "@/hooks/use-alert";

function MyComponent() {
  const alert = useAlert();

  const handleDelete = async () => {
    const confirmed = await alert.confirmDelete("My File", async () => {
      // Your delete logic here
      await deleteFile();
    });
    
    if (confirmed) {
      console.log("User confirmed deletion");
    }
  };

  return <button onClick={handleDelete}>Delete File</button>;
}
```

## Available Methods

### 1. Basic Confirmation

```tsx
const confirmed = await alert.confirm({
  title: "Confirm Action",
  description: "Are you sure you want to proceed?",
  confirmText: "Yes",
  cancelText: "No",
  onConfirm: async () => {
    // Your action here
  },
  onCancel: () => {
    // Optional cancel action
  },
});
```

### 2. Delete Confirmation

```tsx
const confirmed = await alert.confirmDelete(
  "Item Name", 
  async () => {
    // Delete logic
    await deleteItem();
  }
);
```

### 3. Action Confirmation

```tsx
const confirmed = await alert.confirmAction(
  "Save Changes",
  "Are you sure you want to save these changes?",
  async () => {
    // Save logic
    await saveChanges();
  }
);
```

### 4. Confirmation with Toast Integration

```tsx
const confirmed = await alert.confirmWithToast(
  {
    title: "Publish Article",
    description: "This will make your article public.",
    onConfirm: async () => {
      await publishArticle();
    },
  },
  "Article published successfully!",
  "Failed to publish article"
);
```

### 5. Delete with Toast

```tsx
const confirmed = await alert.confirmDeleteWithToast(
  "User Profile",
  async () => {
    await deleteUser();
  },
  "User profile deleted successfully!"
);
```

### 6. Action with Toast

```tsx
const confirmed = await alert.confirmActionWithToast(
  "Archive Project",
  "This will move the project to archives.",
  async () => {
    await archiveProject();
  },
  "Project archived successfully!"
);
```

## Advanced Usage

### Destructive Actions

```tsx
const confirmed = await alert.confirm({
  title: "Permanent Deletion",
  description: "This action cannot be undone. Are you absolutely sure?",
  confirmText: "Delete Forever",
  cancelText: "Cancel",
  variant: "destructive",
  onConfirm: async () => {
    await permanentDelete();
  },
});
```

### Custom Button Text

```tsx
const confirmed = await alert.confirm({
  title: "Custom Confirmation",
  description: "Choose your action:",
  confirmText: "Proceed",
  cancelText: "Go Back",
  onConfirm: async () => {
    // Your logic
  },
});
```

### Error Handling

```tsx
const confirmed = await alert.confirmWithToast(
  {
    title: "Risky Operation",
    description: "This might fail. Continue?",
    onConfirm: async () => {
      // This might throw an error
      await riskyOperation();
    },
  },
  "Operation completed!",
  "Operation failed. Please try again."
);
```

## Common Use Cases

### Form Submission Confirmation

```tsx
const handleSubmit = async (data) => {
  const confirmed = await alert.confirm({
    title: "Submit Form",
    description: "Are you sure you want to submit this form?",
    onConfirm: async () => {
      await submitForm(data);
    },
  });
  
  if (confirmed) {
    // Handle success
  }
};
```

### File Upload Confirmation

```tsx
const handleFileUpload = async (file) => {
  const confirmed = await alert.confirmAction(
    "Upload File",
    `Upload "${file.name}"? This will replace any existing file.`,
    async () => {
      await uploadFile(file);
    }
  );
};
```

### Bulk Operations

```tsx
const handleBulkDelete = async (items) => {
  const confirmed = await alert.confirmDelete(
    `${items.length} selected items`,
    async () => {
      await Promise.all(items.map(item => deleteItem(item.id)));
    }
  );
};
```

### Navigation Confirmation

```tsx
const handleNavigation = async () => {
  const confirmed = await alert.confirm({
    title: "Unsaved Changes",
    description: "You have unsaved changes. Are you sure you want to leave?",
    confirmText: "Leave",
    cancelText: "Stay",
    variant: "destructive",
    onConfirm: () => {
      router.push("/other-page");
    },
  });
};
```

## Return Values

All alert methods return a `Promise<boolean>`:

- `true` - User clicked confirm
- `false` - User clicked cancel or closed the dialog

```tsx
const confirmed = await alert.confirm({...});

if (confirmed) {
  // User confirmed
  console.log("Action confirmed");
} else {
  // User cancelled
  console.log("Action cancelled");
}
```

## Integration with Toast Notifications

The alert system integrates seamlessly with the toast notification system:

```tsx
const confirmed = await alert.confirmDeleteWithToast(
  "Document",
  async () => {
    await deleteDocument();
  },
  "Document deleted successfully!" // Success toast
  // Error toast is automatically shown if deletion fails
);
```

## Best Practices

1. **Use appropriate methods** - Use `confirmDelete` for deletions, `confirmAction` for actions
2. **Provide clear descriptions** - Help users understand what will happen
3. **Use destructive variant** - For irreversible actions
4. **Handle errors gracefully** - Use toast integration for error feedback
5. **Keep titles concise** - Make them scannable
6. **Use async operations** - The system handles loading states automatically

## Configuration

The alert system is configured in `src/contexts/alert-context.tsx` and integrated in `src/app/layout.tsx`. The AlertProvider wraps your entire application, making alerts available everywhere.

## Testing

Visit `/dashboard` to see the alert demo component with examples of all alert types and features.

## Troubleshooting

If alerts aren't showing:
1. Make sure the `AlertProvider` is in your layout
2. Check that you're using the hook in a client component (`"use client"`)
3. Ensure you're awaiting the alert method
4. Verify the component is within the provider tree

## Accessibility

The alert dialogs are built with Radix UI and include:
- Proper ARIA attributes
- Keyboard navigation
- Focus management
- Screen reader support
- Escape key to cancel

Happy confirming! ✅
