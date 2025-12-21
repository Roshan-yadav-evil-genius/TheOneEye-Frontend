/**
 * useNodesTable Hook
 * 
 * Composed hook that combines table selection, pagination, filters, and columns
 * for the nodes table. This provides a simplified API while internally using
 * the smaller, focused hooks.
 */
import { useMemo, useCallback } from 'react';
import { TNodeMetadata } from '@/types';
import { useTableSelection } from './table/useTableSelection';
import { useTablePagination } from './table/useTablePagination';
import { useTableFilters } from './table/useTableFilters';
import { useTableColumns, ColumnConfig } from './table/useTableColumns';

interface UseNodesTableProps {
  nodes: TNodeMetadata[];
}

const defaultColumns: ColumnConfig[] = [
  { id: 'name', label: 'Name', visible: true },
  { id: 'type', label: 'Type', visible: true },
  { id: 'category', label: 'Category', visible: true },
  { id: 'hasForm', label: 'Has Form', visible: true },
  { id: 'description', label: 'Description', visible: false },
];

const searchableFields: (keyof TNodeMetadata)[] = [
  'name',
  'identifier',
  'label',
  'description',
];

export const useNodesTable = ({ nodes }: UseNodesTableProps) => {
  // Use the filters hook
  const {
    searchTerm,
    filters,
    filteredItems: filteredBySearch,
    setSearchTerm: setSearchTermBase,
    setFilter,
    getUniqueValues,
  } = useTableFilters<TNodeMetadata>({
    items: nodes,
    searchableFields,
  });

  // Extract type and category filters
  const typeFilter = filters.type || 'all';
  const categoryFilter = filters.category || 'all';

  // Apply type and category filters, then sort by category
  const filteredNodes = useMemo(() => {
    const filtered = filteredBySearch.filter((node) => {
      const matchesType = typeFilter === 'all' || node.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || node.category === categoryFilter;
      return matchesType && matchesCategory;
    });
    
    // Sort by category alphabetically, then by name within each category
    return filtered.sort((a, b) => {
      const categoryA = (a.category || 'Uncategorized').toLowerCase();
      const categoryB = (b.category || 'Uncategorized').toLowerCase();
      
      if (categoryA !== categoryB) {
        return categoryA.localeCompare(categoryB);
      }
      
      // Within the same category, sort by name
      const nameA = (a.label || a.name || '').toLowerCase();
      const nameB = (b.label || b.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [filteredBySearch, typeFilter, categoryFilter]);

  // Use the pagination hook with filtered nodes
  const {
    currentPage,
    rowsPerPage,
    totalPages,
    currentItems: currentNodes,
    handlePageChange: handlePageChangeBase,
    handleRowsPerPageChange: handleRowsPerPageChangeBase,
  } = useTablePagination({
    items: filteredNodes,
    initialPage: 1,
    initialRowsPerPage: 10,
  });

  // Use the selection hook with current page items
  const {
    selectedRows,
    isAllSelected,
    isIndeterminate,
    handleSelectAll,
    handleSelectRow,
    clearSelection,
  } = useTableSelection({
    items: currentNodes,
    getItemId: (node) => node.identifier,
  });

  // Use the columns hook
  const {
    columns,
    toggleColumnVisibility,
  } = useTableColumns({
    initialColumns: defaultColumns,
  });

  // Get unique types and categories for filter dropdowns
  const types = useMemo(() => getUniqueValues('type'), [getUniqueValues]);
  const categories = useMemo(() => getUniqueValues('category'), [getUniqueValues]);

  // Wrap handlers to clear selection when filters/pagination change
  const setSearchTerm = useCallback((term: string) => {
    setSearchTermBase(term);
    clearSelection();
  }, [setSearchTermBase, clearSelection]);

  const setTypeFilter = useCallback((value: string) => {
    setFilter('type', value);
    clearSelection();
  }, [setFilter, clearSelection]);

  const setCategoryFilter = useCallback((value: string) => {
    setFilter('category', value);
    clearSelection();
  }, [setFilter, clearSelection]);

  const handlePageChange = useCallback((page: number) => {
    handlePageChangeBase(page);
    clearSelection();
  }, [handlePageChangeBase, clearSelection]);

  const handleRowsPerPageChange = useCallback((value: string) => {
    handleRowsPerPageChangeBase(value);
    clearSelection();
  }, [handleRowsPerPageChangeBase, clearSelection]);

  return {
    // State
    selectedRows,
    currentPage,
    rowsPerPage,
    searchTerm,
    typeFilter,
    categoryFilter,
    columns,
    types,
    categories,
    filteredNodes,
    currentNodes,
    totalPages,
    isAllSelected,
    isIndeterminate,

    // Actions
    setSearchTerm,
    setTypeFilter,
    setCategoryFilter,
    handleSelectAll,
    handleSelectRow,
    handlePageChange,
    handleRowsPerPageChange,
    toggleColumnVisibility,
  };
};
