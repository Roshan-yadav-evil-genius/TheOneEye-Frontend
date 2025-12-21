/**
 * useDynamicFieldOptions Hook
 * 
 * Single Responsibility: Handles async field option loading for dependent fields.
 */

import { useState, useCallback } from 'react';
import { nodeApi } from '@/lib/api/services/node-api';
import { TNodeFormData } from '@/types';

export interface UseDynamicFieldOptionsResult {
  loadingFields: Set<string>;
  updateFieldOptions: (
    nodeIdentifier: string,
    parentField: string,
    parentValue: string,
    dependentField: string,
    formValues: Record<string, string>
  ) => Promise<void>;
}

/**
 * Hook for managing dynamic field options loading
 */
export function useDynamicFieldOptions(
  formState: TNodeFormData | null,
  setFormState: React.Dispatch<React.SetStateAction<TNodeFormData | null>>
): UseDynamicFieldOptionsResult {
  const [loadingFields, setLoadingFields] = useState<Set<string>>(new Set());

  const updateFieldOptions = useCallback(
    async (
      nodeIdentifier: string,
      parentField: string,
      parentValue: string,
      dependentField: string,
      formValues: Record<string, string>
    ) => {
      setLoadingFields((prev) => new Set(prev).add(dependentField));

      try {
        const response = await nodeApi.getNodeFieldOptions(nodeIdentifier, {
          parent_field: parentField,
          parent_value: parentValue,
          dependent_field: dependentField,
          form_values: formValues,
        });

        // Update the dependent field's options
        setFormState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            fields: prev.fields.map((field) => {
              if (field.name === dependentField) {
                return {
                  ...field,
                  options: response.options,
                };
              }
              return field;
            }),
          };
        });
      } catch (err) {
        console.error(`Failed to load options for ${dependentField}:`, err);
      } finally {
        setLoadingFields((prev) => {
          const next = new Set(prev);
          next.delete(dependentField);
          return next;
        });
      }
    },
    [setFormState]
  );

  return {
    loadingFields,
    updateFieldOptions,
  };
}

