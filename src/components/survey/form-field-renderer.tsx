"use client";

import React from "react";
import { FormField, FormFieldType, FormFieldProps } from "./types";
import {
  TextField,
  TextareaField,
  DropdownField,
  CheckboxField,
  RadioField,
  DateField,
  TimeField,
  FileField,
} from "./fields";

// Map field types to their corresponding components
const fieldComponentMap: Record<FormFieldType, React.ComponentType<FormFieldProps>> = {
  text: TextField,
  email: TextField,
  password: TextField,
  number: TextField,
  tel: TextField,
  url: TextField,
  comment: TextareaField,
  dropdown: DropdownField,
  checkbox: CheckboxField,
  boolean: CheckboxField,
  radio: RadioField,
  file: FileField,
  date: DateField,
  time: TimeField,
  datetime: DateField, // Using DateField for datetime as well
};

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function FormFieldRenderer({
  field,
  value,
  onChange,
  error,
  disabled,
  className,
}: FormFieldRendererProps) {
  // Get the appropriate component for this field type
  const FieldComponent = fieldComponentMap[field.type];

  if (!FieldComponent) {
    console.warn(`No component found for field type: ${field.type}`);
    return (
      <div className={`p-4 border border-yellow-500 rounded-lg bg-yellow-50 ${className}`}>
        <p className="text-yellow-800">
          Unsupported field type: {field.type}
        </p>
      </div>
    );
  }

  // Handle conditional fields
  if (field.conditional) {
    // For now, we'll render all fields
    // TODO: Implement conditional logic based on field.conditional
  }

  return (
    <FieldComponent
      field={field}
      value={value}
      onChange={onChange}
      error={error}
      disabled={disabled}
      className={className}
    />
  );
}

// Utility function to get the default value for a field
export function getFieldDefaultValue(field: FormField): any {
  if (field.defaultValue !== undefined) {
    return field.defaultValue;
  }

  switch (field.type) {
    case 'checkbox':
    case 'boolean':
      return false;
    case 'number':
      return field.min || 0;
    case 'comment':
      return '';
    case 'dropdown':
    case 'radio':
      return field.choices?.[0]?.value || '';
    default:
      return '';
  }
}

// Utility function to validate a field value
export function validateFieldValue(field: FormField, value: any): string | null {
  // Required field validation
  if (field.isRequired && (value === null || value === undefined || value === '')) {
    return field.validation?.message || `${field.title} is required`;
  }

  // Type-specific validation
  switch (field.type) {
    case 'email':
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address';
      }
      break;
    
    case 'url':
      if (value && !/^https?:\/\/.+/.test(value)) {
        return 'Please enter a valid URL';
      }
      break;
    
    case 'number':
      if (value && isNaN(Number(value))) {
        return 'Please enter a valid number';
      }
      if (field.min !== undefined && Number(value) < field.min) {
        return `Value must be at least ${field.min}`;
      }
      if (field.max !== undefined && Number(value) > field.max) {
        return `Value must be at most ${field.max}`;
      }
      break;
    
    case 'text':
    case 'comment':
      if (field.minLength && value && value.length < field.minLength) {
        return `Must be at least ${field.minLength} characters`;
      }
      if (field.maxLength && value && value.length > field.maxLength) {
        return `Must be at most ${field.maxLength} characters`;
      }
      if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
        return 'Invalid format';
      }
      break;
  }

  return null;
}
