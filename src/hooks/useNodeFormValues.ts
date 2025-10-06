import { useState, useEffect, useCallback } from 'react';
import { nodeFormValuesApi } from '@/lib/api/node-form-values';
import { FormValues, FormValue } from '@/types/forms/form-values';

interface UseNodeFormValuesProps {
  workflowId: string;
  nodeId: string;
  userId?: string;
  autoSave?: boolean;
  autoSaveDelay?: number;
}

export const useNodeFormValues = ({
  workflowId,
  nodeId,
  userId = 'default',
  autoSave = true,
  autoSaveDelay = 2000
}: UseNodeFormValuesProps) => {
  const [formValues, setFormValues] = useState<FormValues>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load form values on mount
  useEffect(() => {
    const loadFormValues = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await nodeFormValuesApi.getFormValues(workflowId, nodeId, userId);
        setFormValues(response.form_values);
        setLastSaved(new Date(response.last_updated));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load form values');
      } finally {
        setIsLoading(false);
      }
    };

    if (workflowId && nodeId) {
      loadFormValues();
    }
  }, [workflowId, nodeId, userId]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !hasUnsavedChanges) return;

    const timeoutId = setTimeout(() => {
      saveFormValues();
    }, autoSaveDelay);

    return () => clearTimeout(timeoutId);
  }, [formValues, autoSave, autoSaveDelay, hasUnsavedChanges]);

  const saveFormValues = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await nodeFormValuesApi.saveFormValues(workflowId, nodeId, {
        user_id: userId,
        form_values: formValues
      });
      
      setLastSaved(new Date(response.last_updated));
      setHasUnsavedChanges(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save form values');
    } finally {
      setIsSaving(false);
    }
  }, [workflowId, nodeId, userId, formValues]);

  const updateFormValue = useCallback((fieldName: string, value: FormValue) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
    setHasUnsavedChanges(true);
  }, []);

  const clearFormValues = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await nodeFormValuesApi.clearFormValues(workflowId, nodeId, userId);
      setFormValues({});
      setLastSaved(null);
      setHasUnsavedChanges(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear form values');
    } finally {
      setIsLoading(false);
    }
  }, [workflowId, nodeId, userId]);

  return {
    formValues,
    isLoading,
    isSaving,
    error,
    lastSaved,
    hasUnsavedChanges,
    updateFormValue,
    saveFormValues,
    clearFormValues,
  };
};
