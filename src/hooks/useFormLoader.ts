/**
 * useFormLoader Hook
 * 
 * Single Responsibility: Handles form schema loading from API.
 */

import { useState, useEffect } from 'react';
import { nodeApi } from '@/lib/api/services/node-api';
import { TNodeFormData } from '@/types';

export interface UseFormLoaderResult {
  formState: TNodeFormData | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for loading form schema from API
 */
export function useFormLoader(nodeIdentifier: string, hasForm: boolean): UseFormLoaderResult {
  const [formState, setFormState] = useState<TNodeFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  return {
    formState,
    isLoading,
    error,
  };
}

