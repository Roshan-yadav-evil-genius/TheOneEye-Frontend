# Custom Form System

This directory contains a custom form system built with Shadcn UI components that provides better control and flexibility compared to SurveyJS.

## Overview

The custom form system consists of:

- **Field Components**: Individual Shadcn UI-based form field components
- **Form Renderer**: Maps form JSON to appropriate field components
- **Validation System**: Comprehensive form validation with custom validators
- **State Management**: Custom hook for form state management
- **Form Preview**: Custom form preview component
- **JSON Converter**: Utilities to convert between SurveyJS and custom formats

## Components

### Field Components (`/fields/`)

- `TextField` - Text input with various input types (text, email, password, number, etc.)
- `TextareaField` - Multi-line text input
- `DropdownField` - Select dropdown with choices
- `CheckboxField` - Single checkbox (boolean)
- `RadioField` - Radio button group
- `DateField` - Date picker
- `TimeField` - Time picker
- `FileField` - File upload

### Core Components

- `FormFieldRenderer` - Renders appropriate field component based on field type
- `CustomFormPreview` - Main form preview component
- `FormPreviewDialog` - Dialog wrapper for form preview

### Utilities

- `useFormState` - Custom hook for form state management
- `form-validation.ts` - Validation utilities and custom validators
- `survey-json-converter.ts` - Convert between SurveyJS and custom formats

## Usage

### Basic Form Preview

```tsx
import { CustomFormPreview } from '@/components/survey';

const formConfig = {
  title: "Contact Form",
  description: "Please fill out the form below",
  elements: [
    {
      type: "text",
      name: "name",
      title: "Full Name",
      isRequired: true,
      placeholder: "Enter your name"
    },
    {
      type: "email",
      name: "email",
      title: "Email Address",
      isRequired: true,
      placeholder: "Enter your email"
    },
    {
      type: "comment",
      name: "message",
      title: "Message",
      isRequired: true,
      placeholder: "Enter your message"
    }
  ]
};

function MyForm() {
  const handleDataChange = (data) => {
    console.log('Form data changed:', data);
  };

  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <CustomFormPreview
      configuration={formConfig}
      onDataChange={handleDataChange}
      onSubmit={handleSubmit}
    />
  );
}
```

### Using Form State Hook

```tsx
import { useFormState } from '@/components/survey';

function MyForm() {
  const {
    data,
    errors,
    isValid,
    updateField,
    validateForm,
    getFieldError
  } = useFormState({
    fields: formConfig.elements,
    onDataChange: (data) => console.log(data),
    onValidationChange: (isValid, errors) => console.log(isValid, errors)
  });

  return (
    <form>
      {formConfig.elements.map(field => (
        <FormFieldRenderer
          key={field.name}
          field={field}
          value={data[field.name]}
          onChange={(value) => updateField(field.name, value)}
          error={getFieldError(field.name)}
        />
      ))}
    </form>
  );
}
```

## Field Types

### Text Fields
- `text` - Basic text input
- `email` - Email input with validation
- `password` - Password input
- `number` - Number input
- `tel` - Telephone input
- `url` - URL input

### Other Fields
- `comment` - Multi-line text (textarea)
- `dropdown` - Select dropdown
- `checkbox` - Single checkbox
- `boolean` - Boolean checkbox (alias for checkbox)
- `radio` - Radio button group
- `file` - File upload
- `date` - Date picker
- `time` - Time picker
- `datetime` - Date and time picker

## Field Configuration

Each field supports the following properties:

```typescript
interface FormField {
  type: FormFieldType;
  name: string;
  title: string;
  description?: string;
  placeholder?: string;
  isRequired?: boolean;
  defaultValue?: any;
  inputType?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  choices?: FormFieldChoice[]; // For dropdown/radio
  min?: number;
  max?: number;
  step?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  rows?: number; // For textarea
  validation?: {
    message?: string;
    custom?: string;
  };
  conditional?: {
    dependsOn: string;
    condition: string;
    value: any;
  };
}
```

## Validation

The system includes built-in validation for:

- Required fields
- Email format
- URL format
- Number ranges
- String length limits
- Pattern matching
- Custom validators

### Custom Validators

```typescript
import { customValidators } from '@/components/survey';

// Pattern validation
const isValid = customValidators.pattern(value, '^[A-Z]+$');

// Range validation
const isInRange = customValidators.range(value, 1, 100);

// Length validation
const isValidLength = customValidators.length(value, 5, 50);

// Choice validation
const isValidChoice = customValidators.oneOf(value, ['option1', 'option2']);

// Not empty validation
const isNotEmpty = customValidators.notEmpty(value);
```

## Migration from SurveyJS

To migrate from SurveyJS to the custom form system:

1. Use the converter utility:
```typescript
import { convertSurveyJSJsonToCustomFormat } from '@/components/survey';

const customConfig = convertSurveyJSJsonToCustomFormat(surveyJSJson);
```

2. Replace `SurveyPreview` with `CustomFormPreview`:
```tsx
// Before
<SurveyPreview json={surveyJSJson} onValueChanged={handleChange} />

// After
<CustomFormPreview configuration={customConfig} onDataChange={handleChange} />
```

## Benefits

- **Better Control**: Full control over styling and behavior
- **Consistent UI**: Uses Shadcn UI components for consistent design
- **Type Safety**: Full TypeScript support
- **Flexible Validation**: Custom validation system
- **Performance**: Lighter weight than SurveyJS
- **Extensibility**: Easy to add new field types
- **Accessibility**: Built-in accessibility features from Shadcn UI