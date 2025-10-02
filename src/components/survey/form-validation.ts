// Form validation utilities

import { FormField, FormData, FormValidationError, ValidationResult } from "./types";
import { validateFieldValue } from "./form-field-renderer";

/**
 * Validates all fields in a form configuration against provided data
 */
export function validateFormData(
  fields: FormField[],
  data: FormData
): ValidationResult {
  const errors: FormValidationError[] = [];

  for (const field of fields) {
    const value = data[field.name];
    const error = validateFieldValue(field, value);

    if (error) {
      errors.push({
        field: field.name,
        message: error,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a single field
 */
export function validateSingleField(
  field: FormField,
  value: any
): string | null {
  return validateFieldValue(field, value);
}

/**
 * Gets all validation errors for a specific field
 */
export function getFieldErrors(
  fieldName: string,
  errors: FormValidationError[]
): string[] {
  return errors
    .filter(error => error.field === fieldName)
    .map(error => error.message);
}

/**
 * Checks if a field has any validation errors
 */
export function hasFieldError(
  fieldName: string,
  errors: FormValidationError[]
): boolean {
  return errors.some(error => error.field === fieldName);
}

/**
 * Gets the first error message for a field
 */
export function getFieldError(
  fieldName: string,
  errors: FormValidationError[]
): string | null {
  const fieldErrors = getFieldErrors(fieldName, errors);
  return fieldErrors.length > 0 ? fieldErrors[0] : null;
}

/**
 * Clears validation errors for a specific field
 */
export function clearFieldErrors(
  fieldName: string,
  errors: FormValidationError[]
): FormValidationError[] {
  return errors.filter(error => error.field !== fieldName);
}

/**
 * Adds or updates validation error for a field
 */
export function setFieldError(
  fieldName: string,
  message: string,
  errors: FormValidationError[]
): FormValidationError[] {
  // Remove existing errors for this field
  const filteredErrors = clearFieldErrors(fieldName, errors);
  
  // Add new error
  return [
    ...filteredErrors,
    { field: fieldName, message },
  ];
}

/**
 * Validates form data and returns only the errors for changed fields
 */
export function validateChangedFields(
  fields: FormField[],
  data: FormData,
  changedFields: Set<string>
): ValidationResult {
  const errors: FormValidationError[] = [];

  for (const field of fields) {
    if (changedFields.has(field.name)) {
      const value = data[field.name];
      const error = validateFieldValue(field, value);

      if (error) {
        errors.push({
          field: field.name,
          message: error,
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Custom validation functions
 */
export const customValidators = {
  /**
   * Validates that a value matches a regular expression
   */
  pattern: (value: string, pattern: string): boolean => {
    return new RegExp(pattern).test(value);
  },

  /**
   * Validates that a value is within a range
   */
  range: (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
  },

  /**
   * Validates that a string length is within bounds
   */
  length: (value: string, min: number, max: number): boolean => {
    return value.length >= min && value.length <= max;
  },

  /**
   * Validates that a value is one of the allowed choices
   */
  oneOf: (value: any, choices: any[]): boolean => {
    return choices.includes(value);
  },

  /**
   * Validates that a value is not empty (for strings, arrays, objects)
   */
  notEmpty: (value: any): boolean => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
    return value !== null && value !== undefined;
  },
};
