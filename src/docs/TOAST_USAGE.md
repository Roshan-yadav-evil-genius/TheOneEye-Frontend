# Toast Notifications Usage Guide

Sonner has been successfully integrated into your application! You can now use toast notifications from anywhere in your app to inform users about status, errors, or events.

## Quick Start

### Using the Custom Hook (Recommended)

```tsx
import { useToast } from "@/hooks/use-toast";

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success("Operation completed!");
  };

  const handleError = () => {
    toast.error("Something went wrong!");
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}
```

### Using Direct Functions

```tsx
import { toastSuccess, toastError, toastWarning, toastInfo } from "@/hooks/use-toast";

// Direct usage without hook
toastSuccess("Data saved successfully!");
toastError("Failed to save data");
toastWarning("Please check your input");
toastInfo("New feature available!");
```

## Toast Types

### 1. Success Toast
```tsx
toast.success("Success message", {
  description: "Optional description",
  duration: 4000, // milliseconds
});
```

### 2. Error Toast
```tsx
toast.error("Error message", {
  description: "Error details",
  duration: 5000,
});
```

### 3. Warning Toast
```tsx
toast.warning("Warning message", {
  description: "Warning details",
});
```

### 4. Info Toast
```tsx
toast.info("Information message", {
  description: "Additional info",
});
```

### 5. Loading Toast
```tsx
const loadingToast = toast.loading("Processing...");

// Dismiss when done
setTimeout(() => {
  toast.dismiss(loadingToast);
  toast.success("Done!");
}, 3000);
```

### 6. Promise Toast
```tsx
const fetchData = async () => {
  const response = await fetch('/api/data');
  return response.json();
};

toast.promise(fetchData(), {
  loading: "Loading data...",
  success: "Data loaded successfully!",
  error: "Failed to load data",
});
```

### 7. Toast with Actions
```tsx
toast.success("File uploaded!", {
  description: "Your file is ready",
  action: {
    label: "View",
    onClick: () => console.log("View clicked"),
  },
  cancel: {
    label: "Dismiss",
    onClick: () => console.log("Dismissed"),
  },
});
```

## Advanced Usage

### Custom Toast Duration
```tsx
toast.info("This will show for 10 seconds", {
  duration: 10000,
});
```

### Dismissing Toasts
```tsx
const toastId = toast.loading("Processing...");

// Dismiss specific toast
toast.dismiss(toastId);

// Dismiss all toasts
toast.dismiss();
```

### Custom JSX Toast
```tsx
toast.custom(
  <div className="flex items-center gap-2">
    <span>Custom toast content</span>
    <button onClick={() => toast.dismiss()}>Close</button>
  </div>
);
```

## Common Use Cases

### Form Submission
```tsx
const handleSubmit = async (data) => {
  try {
    await submitForm(data);
    toast.success("Form submitted successfully!");
  } catch (error) {
    toast.error("Failed to submit form", {
      description: error.message,
    });
  }
};
```

### API Calls
```tsx
const handleApiCall = () => {
  toast.promise(
    fetch('/api/endpoint').then(res => res.json()),
    {
      loading: "Loading...",
      success: "Data loaded!",
      error: "Failed to load data",
    }
  );
};
```

### File Upload
```tsx
const handleFileUpload = (file) => {
  const loadingToast = toast.loading("Uploading file...");
  
  uploadFile(file)
    .then(() => {
      toast.dismiss(loadingToast);
      toast.success("File uploaded successfully!");
    })
    .catch((error) => {
      toast.dismiss(loadingToast);
      toast.error("Upload failed", {
        description: error.message,
      });
    });
};
```

## Configuration

The toast is configured in `src/app/layout.tsx` with the following settings:

- **Position**: Top-right
- **Expand**: true (toasts expand on hover)
- **Rich Colors**: true (automatic color theming)
- **Close Button**: true (users can manually close toasts)

## Best Practices

1. **Keep messages concise** - Users should understand the message at a glance
2. **Use appropriate types** - Success for positive actions, error for failures, etc.
3. **Include descriptions** - Add context when the main message isn't self-explanatory
4. **Don't overuse** - Too many toasts can be overwhelming
5. **Use loading toasts** - For operations that take time
6. **Provide actions** - When users can take immediate action

## Testing

Visit `/dashboard` to see the toast demo component with examples of all toast types and features.

## Troubleshooting

If toasts aren't showing:
1. Make sure the `<Toaster />` component is in your layout
2. Check that you're importing from the correct path
3. Ensure the component using toasts is client-side (use "use client" directive)

Happy toasting! 🍞
