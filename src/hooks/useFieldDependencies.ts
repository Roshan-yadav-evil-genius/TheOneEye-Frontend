/**
 * useFieldDependencies Hook
 * 
 * Single Responsibility: Manages field dependency resolution and cascading.
 */

import { useCallback } from 'react';
import { TNodeFormData } from '@/types';

/**
 * Hook for managing field dependencies
 */
export function useFieldDependencies(formState: TNodeFormData | null) {
  // Get all transitive dependent fields (recursive)
  const getAllDependentFields = useCallback(
    (fieldName: string, visited = new Set<string>()): string[] => {
      if (!formState?.dependencies || visited.has(fieldName)) return [];
      visited.add(fieldName);

      const directDependents = formState.dependencies[fieldName] || [];
      const allDependents: string[] = [...directDependents];

      for (const dependent of directDependents) {
        allDependents.push(...getAllDependentFields(dependent, visited));
      }

      return allDependents;
    },
    [formState?.dependencies]
  );

  // Get direct dependent fields for a given field
  const getDirectDependentFields = useCallback(
    (fieldName: string): string[] => {
      if (!formState?.dependencies) return [];
      return formState.dependencies[fieldName] || [];
    },
    [formState?.dependencies]
  );

  // Check if a field has dependencies
  const hasDependencies = useCallback(
    (fieldName: string): boolean => {
      if (!formState?.dependencies) return false;
      return fieldName in formState.dependencies;
    },
    [formState?.dependencies]
  );

  return {
    getAllDependentFields,
    getDirectDependentFields,
    hasDependencies,
  };
}

