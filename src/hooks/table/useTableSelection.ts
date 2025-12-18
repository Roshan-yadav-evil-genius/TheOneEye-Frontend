/**
 * useTableSelection Hook
 * 
 * Single responsibility: Managing table row selection state.
 */
import { useState, useCallback } from 'react';

interface UseTableSelectionProps<T> {
  items: T[];
  getItemId: (item: T) => string;
}

interface UseTableSelectionReturn {
  selectedRows: string[];
  isAllSelected: boolean;
  isIndeterminate: boolean;
  handleSelectAll: (checked: boolean) => void;
  handleSelectRow: (id: string, checked: boolean) => void;
  clearSelection: () => void;
  isRowSelected: (id: string) => boolean;
}

export function useTableSelection<T>({
  items,
  getItemId,
}: UseTableSelectionProps<T>): UseTableSelectionReturn {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Calculate derived state
  const isAllSelected = items.length > 0 && selectedRows.length === items.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < items.length;

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedRows(items.map(getItemId));
    } else {
      setSelectedRows([]);
    }
  }, [items, getItemId]);

  const handleSelectRow = useCallback((id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, id]);
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const isRowSelected = useCallback((id: string) => {
    return selectedRows.includes(id);
  }, [selectedRows]);

  return {
    selectedRows,
    isAllSelected,
    isIndeterminate,
    handleSelectAll,
    handleSelectRow,
    clearSelection,
    isRowSelected,
  };
}

