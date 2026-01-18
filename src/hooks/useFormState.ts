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
 * Get choices from a field's widget
 * Handles both _choices (runtime) and choices (static)
 */
function getFieldChoices(field: { widget?: { _choices?: Array<[string, string]>; choices?: Array<[string, string]> } }): Array<[string, string]> {
  return field.widget?._choices || field.widget?.choices || [];
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
      // Use the field's value if available
      if (field.value !== undefined && field.value !== null && field.value !== '') {
        defaultValues[field.name] = String(field.value);
      } else {
        // Check for choices - if there's only one non-empty choice, it might be auto-selected
        const choices = getFieldChoices(field);
        const nonEmptyChoices = choices.filter(([value]) => value !== '');
        
        if (nonEmptyChoices.length === 1) {
          // Auto-select single choice
          defaultValues[field.name] = nonEmptyChoices[0][0];
        } else if (field.initial !== undefined && field.initial !== null) {
          // Use initial value
          defaultValues[field.name] = String(field.initial);
        } else {
          defaultValues[field.name] = '';
        }
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

  // Track previous initialFormValues to detect actual changes (not just reference changes)
  const prevInitialFormValuesRef = useRef<string>('');
  useEffect(() => {
    const currentKey = initialFormValues ? JSON.stringify(initialFormValues) : '';
    if (currentKey !== prevInitialFormValuesRef.current && initialFormValues && Object.keys(initialFormValues).length > 0) {
      prevInitialFormValuesRef.current = currentKey;
      // Update form values when initialFormValues actually changes
      const defaultValues = getDefaultValues();
      setFormValues({ ...defaultValues, ...initialFormValues });
    }
  }, [initialFormValues, getDefaultValues]);

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
