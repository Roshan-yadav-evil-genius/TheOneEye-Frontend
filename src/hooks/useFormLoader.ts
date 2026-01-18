/**
 * useFormLoader Hook
 * 
 * Single Responsibility: Handles form schema loading and updating from API.
 */

import { useState, useEffect, useCallback } from 'react';
import { nodeApi } from '@/lib/api/services/node-api';
import { TNodeFormData } from '@/types';

/**
 * Check if cached choices can be used for a field.
 * Returns true if all parent dependencies have the same values AND none were empty.
 * This ensures transitioning from empty -> value always fetches fresh data.
 */
function canUseCachedChoices(
  fieldName: string,
  dependenciesGraph: Record<string, string[]>,
  cachedValues: Record<string, unknown>,
  newValues: Record<string, unknown>
): boolean {
  const parentDeps = dependenciesGraph[fieldName] || [];
  
  // Don't use cache if any parent's cached value was empty
  // This ensures transitioning from empty -> value always fetches fresh data
  const anyParentWasEmpty = parentDeps.some(dep => {
    const cachedVal = cachedValues[dep];
    return cachedVal === '' || cachedVal === null || cachedVal === undefined;
  });
  
  if (anyParentWasEmpty) return false;
  
  return parentDeps.every(dep => cachedValues[dep] === newValues[dep]);
}

/**
 * Merge new schema with cached choices where appropriate.
 * Preserves cached choices if:
 * - Backend returned empty choices
 * - Parent dependencies haven't changed
 */
function mergeWithCachedChoices(
  newSchema: TNodeFormData,
  cachedSchema: TNodeFormData,
  newValues: Record<string, unknown>,
  cachedValues: Record<string, unknown>
): TNodeFormData {
  return {
    ...newSchema,
    fields: newSchema.fields.map(field => {
      const newChoices = field.widget._choices || field.widget.choices || [];
      
      // If backend returned choices, use them (fresh data)
      if (newChoices.length > 0) return field;
      
      // Backend returned empty - check if we can use cache
      const cachedField = cachedSchema.fields.find(f => f.name === field.name);
      const cachedChoices = cachedField?.widget._choices || cachedField?.widget.choices || [];
      
      // Only use cache if parent dependencies haven't changed
      if (
        cachedChoices.length > 0 && 
        canUseCachedChoices(field.name, newSchema.dependencies_graph, cachedValues, newValues)
      ) {
        return {
          ...field,
          widget: { ...field.widget, _choices: cachedChoices }
        };
      }
      
      return field;
    })
  };
}

export interface UseFormLoaderResult {
  formState: TNodeFormData | null;
  setFormState: React.Dispatch<React.SetStateAction<TNodeFormData | null>>;
  isLoading: boolean;
  error: string | null;
  updateForm: (
    fieldValues: Record<string, unknown>,
    cachedSchema?: TNodeFormData | null,
    cachedValues?: Record<string, unknown>
  ) => Promise<TNodeFormData | null>;
  isUpdating: boolean;
}

/**
 * Hook for loading and updating form schema from API
 */
export function useFormLoader(nodeIdentifier: string, hasForm: boolean): UseFormLoaderResult {
  const [formState, setFormState] = useState<TNodeFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadForm = async () => {
      if (!hasForm) {
        setIsLoading(false);
        setError('This node does not have a form');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await nodeApi.getNodeForm(nodeIdentifier);

        if (response.form) {
          setFormState(response.form);
        } else {
          console.warn('[useFormLoader] No form in response, message:', response.message);
          setError(response.message || 'This node does not have a form');
        }
      } catch (err) {
        console.error('[useFormLoader] Failed to load node form:', err);
        setError('Failed to load form');
      } finally {
        setIsLoading(false);
      }
    };

    loadForm();
  }, [nodeIdentifier, hasForm]);

  /**
   * Update form with new field values.
   * This calls the backend to re-calculate dependent field choices.
   * 
   * @param fieldValues - Current field values to send to backend
   * @param cachedSchema - Previous form schema for choice caching
   * @param cachedValues - Previous field values for dependency comparison
   */
  const updateForm = useCallback(async (
    fieldValues: Record<string, unknown>,
    cachedSchema?: TNodeFormData | null,
    cachedValues?: Record<string, unknown>
  ): Promise<TNodeFormData | null> => {
    if (!hasForm) return null;

    setIsUpdating(true);
    try {
      const response = await nodeApi.updateNodeForm(nodeIdentifier, fieldValues);
      
      // Merge with cached choices if previous state provided
      if (cachedSchema && response.form && cachedValues) {
        const merged = mergeWithCachedChoices(
          response.form,
          cachedSchema,
          fieldValues,
          cachedValues
        );
        setFormState(merged);
        return merged;
      }
      
      // Original behavior if no cache
      if (response.form) {
        setFormState(response.form);
        return response.form;
      }
      return null;
    } catch (err) {
      console.error('[useFormLoader] Failed to update form:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, [nodeIdentifier, hasForm]);

  return {
    formState,
    setFormState,
    isLoading,
    error,
    updateForm,
    isUpdating,
  };
}
