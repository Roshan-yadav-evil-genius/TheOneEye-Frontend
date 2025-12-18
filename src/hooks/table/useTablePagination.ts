/**
 * useTablePagination Hook
 * 
 * Single responsibility: Managing table pagination state.
 */
import { useState, useMemo, useCallback } from 'react';

interface UseTablePaginationProps<T> {
  items: T[];
  initialPage?: number;
  initialRowsPerPage?: number;
}

interface UseTablePaginationReturn<T> {
  currentPage: number;
  rowsPerPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  currentItems: T[];
  handlePageChange: (page: number) => void;
  handleRowsPerPageChange: (value: string) => void;
  resetPagination: () => void;
}

export function useTablePagination<T>({
  items,
  initialPage = 1,
  initialRowsPerPage = 10,
}: UseTablePaginationProps<T>): UseTablePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  // Calculate pagination values
  const totalPages = Math.ceil(items.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  
  const currentItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleRowsPerPageChange = useCallback((value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  }, []);

  const resetPagination = useCallback(() => {
    setCurrentPage(initialPage);
    setRowsPerPage(initialRowsPerPage);
  }, [initialPage, initialRowsPerPage]);

  return {
    currentPage,
    rowsPerPage,
    totalPages,
    startIndex,
    endIndex,
    currentItems,
    handlePageChange,
    handleRowsPerPageChange,
    resetPagination,
  };
}

