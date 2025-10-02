"use client";

import { useState, useCallback, useEffect } from "react";
import { FormField, FormData, FormState, FormValidationError } from "./types";
import { validateFormData, getFieldError as getFieldErrorFromValidation } from "./form-validation";
import { getFieldDefaultValue } from "./form-field-renderer";

interface UseFormStateOptions {
  fields: FormField[];
  initialData?: FormData;
  onDataChange?: (data: FormData) => void;
  onValidationChange?: (isValid: boolean, errors: FormValidationError[]) => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function useFormState({
  fields,
  initialData = {},
  onDataChange,
  onValidationChange,
  validateOnChange = true,
  validateOnBlur = true,
}: UseFormStateOptions) {
  // Initialize form data with default values
  const initializeFormData = useCallback((): FormData => {
    const data: FormData = { ...initialData };
    
    fields.forEach(field => {
      if (data[field.name] === undefined) {
        data[field.name] = getFieldDefaultValue(field);
      }
    });
    
    return data;
  }, [fields, initialData]);

  const [formState, setFormState] = useState<FormState>(() => {
    const data = initializeFormData();
    const validation = validateFormData(fields, data);
    
    return {
      data,
      errors: validation.errors,
      isValid: validation.isValid,
      isDirty: false,
      isSubmitting: false,
    };
  });

  // Update form data
  const updateField = useCallback((fieldName: string, value: any) => {
    setFormState(prevState => {
      const newData = { ...prevState.data, [fieldName]: value };
      
      let newErrors = prevState.errors;
      let newIsValid = prevState.isValid;

      if (validateOnChange) {
        const validation = validateFormData(fields, newData);
        newErrors = validation.errors;
        newIsValid = validation.isValid;
      }

      const newState = {
        ...prevState,
        data: newData,
        errors: newErrors,
        isValid: newIsValid,
        isDirty: true,
      };

      // Call external callbacks
      onDataChange?.(newData);
      onValidationChange?.(newIsValid, newErrors);

      return newState;
    });
  }, [fields, validateOnChange, onDataChange, onValidationChange]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const validation = validateFormData(fields, formState.data);
    
    setFormState(prevState => ({
      ...prevState,
      errors: validation.errors,
      isValid: validation.isValid,
    }));

    onValidationChange?.(validation.isValid, validation.errors);
    
    return validation;
  }, [fields, formState.data, onValidationChange]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    const data = initializeFormData();
    const validation = validateFormData(fields, data);
    
    setFormState({
      data,
      errors: validation.errors,
      isValid: validation.isValid,
      isDirty: false,
      isSubmitting: false,
    });

    onDataChange?.(data);
    onValidationChange?.(validation.isValid, validation.errors);
  }, [fields, initializeFormData, onDataChange, onValidationChange]);

  // Set form as submitting
  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setFormState(prevState => ({
      ...prevState,
      isSubmitting,
    }));
  }, []);

  // Get error for a specific field
  const getFieldError = useCallback((fieldName: string): string | null => {
    return getFieldErrorFromValidation(fieldName, formState.errors);
  }, [formState.errors]);

  // Check if a field has an error
  const hasFieldError = useCallback((fieldName: string): boolean => {
    return formState.errors.some(error => error.field === fieldName);
  }, [formState.errors]);

  // Set external data (useful for loading saved data)
  const setFormData = useCallback((data: FormData) => {
    const validation = validateFormData(fields, data);
    
    setFormState(prevState => ({
      ...prevState,
      data,
      errors: validation.errors,
      isValid: validation.isValid,
      isDirty: false,
    }));

    onDataChange?.(data);
    onValidationChange?.(validation.isValid, validation.errors);
  }, [fields, onDataChange, onValidationChange]);

  // Update validation options
  useEffect(() => {
    if (validateOnChange) {
      const validation = validateFormData(fields, formState.data);
      if (validation.errors.length !== formState.errors.length || 
          validation.isValid !== formState.isValid) {
        setFormState(prevState => ({
          ...prevState,
          errors: validation.errors,
          isValid: validation.isValid,
        }));
        onValidationChange?.(validation.isValid, validation.errors);
      }
    }
  }, [fields, formState.data, validateOnChange, formState.errors.length, formState.isValid, onValidationChange]);

  return {
    // State
    data: formState.data,
    errors: formState.errors,
    isValid: formState.isValid,
    isDirty: formState.isDirty,
    isSubmitting: formState.isSubmitting,
    
    // Actions
    updateField,
    validateForm,
    resetForm,
    setSubmitting,
    setFormData,
    
    // Utilities
    getFieldError,
    hasFieldError,
  };
}
