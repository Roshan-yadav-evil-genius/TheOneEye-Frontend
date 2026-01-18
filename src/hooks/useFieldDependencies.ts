/**
 * useFieldDependencies Hook
 * 
 * Single Responsibility: Manages field dependency resolution and cascading.
 * 
 * Note: dependencies_graph maps child -> [parents], but we often need parent -> [children]
 * for cascading updates. This hook provides utilities for both directions.
 */

import { useCallback, useMemo } from 'react';
import { TNodeFormData } from '@/types';

/**
 * Hook for managing field dependencies
 */
export function useFieldDependencies(formState: TNodeFormData | null) {
  // Build a reverse map: parent -> [children] for efficient lookups
  const parentToChildren = useMemo(() => {
    if (!formState?.dependencies_graph) return {};
    
    const result: Record<string, string[]> = {};
    
    for (const [child, parents] of Object.entries(formState.dependencies_graph)) {
      for (const parent of parents) {
        if (!result[parent]) {
          result[parent] = [];
        }
        result[parent].push(child);
      }
    }
    
    return result;
  }, [formState?.dependencies_graph]);

  // Get direct children of a parent field (fields that depend on this field)
  const getDirectDependentFields = useCallback(
    (fieldName: string): string[] => {
      return parentToChildren[fieldName] || [];
    },
    [parentToChildren]
  );

  // Get all transitive dependent fields (recursive) - all children and grandchildren
  const getAllDependentFields = useCallback(
    (fieldName: string, visited = new Set<string>()): string[] => {
      if (visited.has(fieldName)) return [];
      visited.add(fieldName);

      const directDependents = parentToChildren[fieldName] || [];
      const allDependents: string[] = [...directDependents];

      for (const dependent of directDependents) {
        allDependents.push(...getAllDependentFields(dependent, visited));
      }

      return allDependents;
    },
    [parentToChildren]
  );

  // Check if a field has children that depend on it
  const hasDependents = useCallback(
    (fieldName: string): boolean => {
      return fieldName in parentToChildren;
    },
    [parentToChildren]
  );

  // Get parent fields that this field depends on
  const getParentFields = useCallback(
    (fieldName: string): string[] => {
      if (!formState?.dependencies_graph) return [];
      return formState.dependencies_graph[fieldName] || [];
    },
    [formState?.dependencies_graph]
  );

  // Check if a field has parents (is a dependent field)
  const hasDependencies = useCallback(
    (fieldName: string): boolean => {
      if (!formState?.dependencies_graph) return false;
      return fieldName in formState.dependencies_graph;
    },
    [formState?.dependencies_graph]
  );

  // Check if all parent dependencies are satisfied (have values)
  const areDependenciesSatisfied = useCallback(
    (fieldName: string, formValues: Record<string, string>): boolean => {
      const parents = getParentFields(fieldName);
      return parents.every(parent => !!formValues[parent]);
    },
    [getParentFields]
  );

  return {
    getAllDependentFields,
    getDirectDependentFields,
    hasDependents,
    getParentFields,
    hasDependencies,
    areDependenciesSatisfied,
    parentToChildren,
  };
}
