/**
 * useTableColumns Hook
 * 
 * Single responsibility: Managing table column visibility.
 */
import { useState, useCallback } from 'react';

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

interface UseTableColumnsProps {
  initialColumns: ColumnConfig[];
}

interface UseTableColumnsReturn {
  columns: ColumnConfig[];
  visibleColumns: ColumnConfig[];
  toggleColumnVisibility: (columnId: string) => void;
  showColumn: (columnId: string) => void;
  hideColumn: (columnId: string) => void;
  showAllColumns: () => void;
  hideAllColumns: () => void;
  isColumnVisible: (columnId: string) => boolean;
  resetColumns: () => void;
}

export function useTableColumns({
  initialColumns,
}: UseTableColumnsProps): UseTableColumnsReturn {
  const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns);

  // Get only visible columns
  const visibleColumns = columns.filter((col) => col.visible);

  const toggleColumnVisibility = useCallback((columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  }, []);

  const showColumn = useCallback((columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, visible: true } : col
      )
    );
  }, []);

  const hideColumn = useCallback((columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, visible: false } : col
      )
    );
  }, []);

  const showAllColumns = useCallback(() => {
    setColumns((prev) => prev.map((col) => ({ ...col, visible: true })));
  }, []);

  const hideAllColumns = useCallback(() => {
    setColumns((prev) => prev.map((col) => ({ ...col, visible: false })));
  }, []);

  const isColumnVisible = useCallback((columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    return column?.visible ?? false;
  }, [columns]);

  const resetColumns = useCallback(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  return {
    columns,
    visibleColumns,
    toggleColumnVisibility,
    showColumn,
    hideColumn,
    showAllColumns,
    hideAllColumns,
    isColumnVisible,
    resetColumns,
  };
}

