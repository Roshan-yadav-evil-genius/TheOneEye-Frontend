/**
 * useFormState Hook
 * 
 * Single Responsibility: Manages form values and validation state.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { TNodeFormData } from '@/types';

export interface UseFormStateOptions {
  initialFormValues?: Record<string, string>;
  executionFormState?: TNodeFormData | null;
  onFormValuesChange?: (formData: Record<string, string>) => void;
}

export interface UseFormStateResult {
  formValues: Record<string, string>;
  setFormValues: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
  updateFieldValue: (fieldName: string, value: string) => void;
  formValuesRef: React.MutableRefObject<Record<string, string>>;
}

/**
 * Hook for managing form values and validation state
 */
export function useFormState(
  formState: TNodeFormData | null,
  options: UseFormStateOptions = {}
): UseFormStateResult {
  const { initialFormValues, executionFormState, onFormValuesChange } = options;

  // Initialize form values from form schema defaults
  const getDefaultValues = useCallback((): Record<string, string> => {
    if (!formState?.fields) return {};

    const defaultValues: Record<string, string> = {};
    formState.fields.forEach((field) => {
      if (field.value !== undefined && field.value !== null) {
        defaultValues[field.name] = String(field.value);
      } else if (field.options?.find((o) => o.selected)) {
        const selected = field.options.find((o) => o.selected);
        if (selected) {
          defaultValues[field.name] = selected.value;
        }
      } else {
        defaultValues[field.name] = '';
      }
    });

    return defaultValues;
  }, [formState]);

  // Initialize form values - prefer persisted values, fall back to defaults
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const defaultValues = getDefaultValues();
    return initialFormValues && Object.keys(initialFormValues).length > 0
      ? { ...defaultValues, ...initialFormValues }
      : defaultValues;
  });

  // Ref to always get the latest formValues (avoids stale closure in callbacks)
  const formValuesRef = useRef<Record<string, string>>(formValues);
  useEffect(() => {
    formValuesRef.current = formValues;
  }, [formValues]);

  // Update formState when execution returns validation errors
  useEffect(() => {
    if (executionFormState) {
      // Update form values with rendered values from backend
      const updatedValues: Record<string, string> = {};
      executionFormState.fields?.forEach((field) => {
        if (field.value !== undefined && field.value !== null) {
          updatedValues[field.name] = String(field.value);
        }
      });
      setFormValues(updatedValues);
    }
  }, [executionFormState]);

  // Notify parent when form values change
  // Use ref to avoid infinite loops when callback changes
  const onFormValuesChangeRef = useRef(onFormValuesChange);
  useEffect(() => {
    onFormValuesChangeRef.current = onFormValuesChange;
  }, [onFormValuesChange]);

  useEffect(() => {
    if (onFormValuesChangeRef.current && Object.keys(formValues).length > 0) {
      onFormValuesChangeRef.current(formValues);
    }
  }, [formValues]);

  // Update a single field value
  const updateFieldValue = useCallback(
    (fieldName: string, value: string) => {
      setFormValues((prev) => ({ ...prev, [fieldName]: value }));
    },
    []
  );

  return {
    formValues,
    setFormValues,
    updateFieldValue,
    formValuesRef,
  };
}

