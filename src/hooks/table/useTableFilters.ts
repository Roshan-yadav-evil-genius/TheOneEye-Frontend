/**
 * useTableFilters Hook
 * 
 * Single responsibility: Managing table filter state.
 */
import { useState, useMemo, useCallback } from 'react';

interface FilterConfig<T> {
  key: keyof T;
  value: string;
  matchFn?: (itemValue: unknown, filterValue: string) => boolean;
}

interface UseTableFiltersProps<T> {
  items: T[];
  searchableFields: (keyof T)[];
  filterConfigs?: FilterConfig<T>[];
}

interface UseTableFiltersReturn<T> {
  searchTerm: string;
  filters: Record<string, string>;
  filteredItems: T[];
  setSearchTerm: (term: string) => void;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  getUniqueValues: (key: keyof T) => string[];
}

export function useTableFilters<T extends Record<string, unknown>>({
  items,
  searchableFields,
}: UseTableFiltersProps<T>): UseTableFiltersReturn<T> {
  const [searchTerm, setSearchTermState] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Get unique values for a field (useful for filter dropdowns)
  const getUniqueValues = useCallback((key: keyof T): string[] => {
    const values = new Set<string>();
    items.forEach((item) => {
      const value = item[key];
      if (value !== undefined && value !== null) {
        values.add(String(value));
      }
    });
    return Array.from(values).sort();
  }, [items]);

  // Filter items based on search term and filters
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Check search term against searchable fields
      const matchesSearch = searchTerm === '' || searchableFields.some((field) => {
        const value = item[field];
        if (value === undefined || value === null) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });

      // Check all active filters
      const matchesFilters = Object.entries(filters).every(([key, filterValue]) => {
        if (filterValue === 'all' || filterValue === '') return true;
        const itemValue = item[key as keyof T];
        return String(itemValue) === filterValue;
      });

      return matchesSearch && matchesFilters;
    });
  }, [items, searchTerm, searchableFields, filters]);

  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term);
  }, []);

  const setFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTermState('');
    setFilters({});
  }, []);

  return {
    searchTerm,
    filters,
    filteredItems,
    setSearchTerm,
    setFilter,
    clearFilters,
    getUniqueValues,
  };
}

