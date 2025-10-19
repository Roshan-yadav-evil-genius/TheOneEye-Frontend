import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { TWorkflow } from '@/types';

// Column configuration interface
interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

// Table state for workflow table
interface WorkflowTableState {
  // Selection state
  selectedRows: string[];
  
  // Pagination state
  currentPage: number;
  rowsPerPage: number;
  
  // Search and filter state
  searchTerm: string;
  statusFilter: string;
  categoryFilter: string;
  
  // Column configuration
  columns: ColumnConfig[];
  
  // Sorting state
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Store state
interface WorkflowTableStoreState {
  // Table state
  tableState: WorkflowTableState;
  
  // Global settings
  defaultRowsPerPage: number;
  maxRowsPerPage: number;
}

interface WorkflowTableStoreActions {
  // Selection management
  setSelectedRows: (rows: string[]) => void;
  addSelectedRow: (rowId: string) => void;
  removeSelectedRow: (rowId: string) => void;
  toggleRowSelection: (rowId: string) => void;
  selectAllRows: (allRowIds: string[]) => void;
  clearSelection: () => void;
  
  // Pagination management
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  
  // Search and filtering
  setSearchTerm: (searchTerm: string) => void;
  setStatusFilter: (statusFilter: string) => void;
  setCategoryFilter: (categoryFilter: string) => void;
  clearFilters: () => void;
  
  // Column management
  setColumnVisibility: (columnId: string, visible: boolean) => void;
  toggleColumnVisibility: (columnId: string) => void;
  resetColumns: () => void;
  
  // Sorting
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  toggleSort: (columnId: string) => void;
  
  // Utility
  resetTable: () => void;
  setDefaults: (defaults: Partial<Pick<WorkflowTableStoreState, 'defaultRowsPerPage' | 'maxRowsPerPage'>>) => void;
}

type WorkflowTableStore = WorkflowTableStoreState & WorkflowTableStoreActions;

const defaultColumnConfigs: ColumnConfig[] = [
  { id: "name", label: "Name", visible: true },
  { id: "status", label: "Status", visible: true },
  { id: "category", label: "Category", visible: true },
  { id: "lastRun", label: "Last Run", visible: true },
  { id: "nextRun", label: "Next Run", visible: true },
  { id: "runsCount", label: "Runs Count", visible: true },
  { id: "successRate", label: "Success Rate", visible: true },
];

const defaultTableState: WorkflowTableState = {
  selectedRows: [],
  currentPage: 1,
  rowsPerPage: 10,
  searchTerm: "",
  statusFilter: "all",
  categoryFilter: "all",
  columns: defaultColumnConfigs,
  sortBy: "name",
  sortOrder: "asc",
};

const initialState: WorkflowTableStoreState = {
  tableState: defaultTableState,
  defaultRowsPerPage: 10,
  maxRowsPerPage: 100,
};

export const useWorkflowTableStore = create<WorkflowTableStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Selection management
        setSelectedRows: (rows: string[]) => {
          set((state) => {
            state.tableState.selectedRows = rows;
          });
        },

        addSelectedRow: (rowId: string) => {
          set((state) => {
            if (!state.tableState.selectedRows.includes(rowId)) {
              state.tableState.selectedRows.push(rowId);
            }
          });
        },

        removeSelectedRow: (rowId: string) => {
          set((state) => {
            state.tableState.selectedRows = state.tableState.selectedRows.filter(
              id => id !== rowId
            );
          });
        },

        toggleRowSelection: (rowId: string) => {
          set((state) => {
            const selectedRows = state.tableState.selectedRows;
            const index = selectedRows.indexOf(rowId);
            if (index > -1) {
              selectedRows.splice(index, 1);
            } else {
              selectedRows.push(rowId);
            }
          });
        },

        selectAllRows: (allRowIds: string[]) => {
          set((state) => {
            state.tableState.selectedRows = allRowIds;
          });
        },

        clearSelection: () => {
          set((state) => {
            state.tableState.selectedRows = [];
          });
        },

        // Pagination management
        setCurrentPage: (page: number) => {
          set((state) => {
            state.tableState.currentPage = page;
            // Clear selection when changing pages
            state.tableState.selectedRows = [];
          });
        },

        setRowsPerPage: (rowsPerPage: number) => {
          set((state) => {
            state.tableState.rowsPerPage = Math.min(rowsPerPage, get().maxRowsPerPage);
            state.tableState.currentPage = 1; // Reset to first page
            state.tableState.selectedRows = []; // Clear selection
          });
        },

        nextPage: () => {
          set((state) => {
            state.tableState.currentPage += 1;
            state.tableState.selectedRows = [];
          });
        },

        previousPage: () => {
          set((state) => {
            if (state.tableState.currentPage > 1) {
              state.tableState.currentPage -= 1;
              state.tableState.selectedRows = [];
            }
          });
        },

        // Search and filtering
        setSearchTerm: (searchTerm: string) => {
          set((state) => {
            state.tableState.searchTerm = searchTerm;
            state.tableState.currentPage = 1; // Reset to first page
            state.tableState.selectedRows = []; // Clear selection
          });
        },

        setStatusFilter: (statusFilter: string) => {
          set((state) => {
            state.tableState.statusFilter = statusFilter;
            state.tableState.currentPage = 1; // Reset to first page
            state.tableState.selectedRows = []; // Clear selection
          });
        },

        setCategoryFilter: (categoryFilter: string) => {
          set((state) => {
            state.tableState.categoryFilter = categoryFilter;
            state.tableState.currentPage = 1; // Reset to first page
            state.tableState.selectedRows = []; // Clear selection
          });
        },

        clearFilters: () => {
          set((state) => {
            state.tableState.searchTerm = "";
            state.tableState.statusFilter = "all";
            state.tableState.categoryFilter = "all";
            state.tableState.currentPage = 1;
            state.tableState.selectedRows = [];
          });
        },

        // Column management
        setColumnVisibility: (columnId: string, visible: boolean) => {
          set((state) => {
            const column = state.tableState.columns.find(col => col.id === columnId);
            if (column) {
              column.visible = visible;
            }
          });
        },

        toggleColumnVisibility: (columnId: string) => {
          set((state) => {
            const column = state.tableState.columns.find(col => col.id === columnId);
            if (column) {
              column.visible = !column.visible;
            }
          });
        },

        resetColumns: () => {
          set((state) => {
            state.tableState.columns = defaultColumnConfigs.map(col => ({ ...col }));
          });
        },

        // Sorting
        setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => {
          set((state) => {
            state.tableState.sortBy = sortBy;
            state.tableState.sortOrder = sortOrder;
            state.tableState.currentPage = 1; // Reset to first page
            state.tableState.selectedRows = []; // Clear selection
          });
        },

        toggleSort: (columnId: string) => {
          set((state) => {
            const { sortBy, sortOrder } = state.tableState;
            if (sortBy === columnId) {
              // Toggle order for same column
              state.tableState.sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
              // New column, default to ascending
              state.tableState.sortBy = columnId;
              state.tableState.sortOrder = 'asc';
            }
            state.tableState.currentPage = 1; // Reset to first page
            state.tableState.selectedRows = []; // Clear selection
          });
        },

        // Utility
        resetTable: () => {
          set((state) => {
            state.tableState = { ...defaultTableState };
          });
        },

        setDefaults: (defaults) => {
          set((state) => {
            if (defaults.defaultRowsPerPage !== undefined) {
              state.defaultRowsPerPage = defaults.defaultRowsPerPage;
            }
            if (defaults.maxRowsPerPage !== undefined) {
              state.maxRowsPerPage = defaults.maxRowsPerPage;
            }
          });
        },
      })),
      {
        name: 'workflow-table-store',
        partialize: (state) => ({
          // Persist table preferences but not temporary state
          tableState: {
            ...state.tableState,
            selectedRows: [], // Don't persist selection
            currentPage: 1, // Don't persist current page
          },
          defaultRowsPerPage: state.defaultRowsPerPage,
          maxRowsPerPage: state.maxRowsPerPage,
        }),
        version: 1,
        migrate: (persistedState: unknown, version: number) => {
          // Handle future migrations here
          return persistedState;
        },
      }
    ),
    {
      name: 'workflow-table-store',
    }
  )
);

// Helper hook for workflow table management
export const useWorkflowTable = (workflows: TWorkflow[]) => {
  const {
    tableState,
    setSelectedRows,
    addSelectedRow,
    removeSelectedRow,
    toggleRowSelection,
    selectAllRows,
    clearSelection,
    setCurrentPage,
    setRowsPerPage,
    setSearchTerm,
    setStatusFilter,
    setCategoryFilter,
    clearFilters,
    setColumnVisibility,
    toggleColumnVisibility,
    resetColumns,
    setSorting,
    toggleSort,
    resetTable,
  } = useWorkflowTableStore();

  // Get unique categories from workflows
  const categories = Array.from(
    new Set(workflows.map(w => w.category).filter((category): category is string => Boolean(category)))
  );

  // Filter workflows based on search and filters
  const filteredWorkflows = React.useMemo(() => {
    return workflows.filter(workflow => {
      const matchesSearch = workflow.name
        .toLowerCase()
        .includes(tableState.searchTerm.toLowerCase()) ||
        (workflow.description || '')
          .toLowerCase()
          .includes(tableState.searchTerm.toLowerCase());
      
      const matchesStatus = tableState.statusFilter === "all" || workflow.status === tableState.statusFilter;
      const matchesCategory = tableState.categoryFilter === "all" || workflow.category === tableState.categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [workflows, tableState.searchTerm, tableState.statusFilter, tableState.categoryFilter]);

  // Sort filtered workflows
  const sortedWorkflows = React.useMemo(() => {
    return [...filteredWorkflows].sort((a, b) => {
      const { sortBy, sortOrder } = tableState;
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'status':
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        case 'category':
          aValue = (a.category || '').toLowerCase();
          bValue = (b.category || '').toLowerCase();
          break;
        case 'lastRun':
          aValue = a.lastRun ? new Date(a.lastRun) : new Date(0);
          bValue = b.lastRun ? new Date(b.lastRun) : new Date(0);
          break;
        case 'nextRun':
          aValue = a.nextRun ? new Date(a.nextRun) : new Date(0);
          bValue = b.nextRun ? new Date(b.nextRun) : new Date(0);
          break;
        case 'runsCount':
          aValue = a.runsCount || 0;
          bValue = b.runsCount || 0;
          break;
        case 'successRate':
          aValue = a.successRate || 0;
          bValue = b.successRate || 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredWorkflows, tableState.sortBy, tableState.sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedWorkflows.length / tableState.rowsPerPage);
  const startIndex = (tableState.currentPage - 1) * tableState.rowsPerPage;
  const endIndex = startIndex + tableState.rowsPerPage;
  const currentWorkflows = sortedWorkflows.slice(startIndex, endIndex);

  // Selection helpers
  const isAllSelected = currentWorkflows.length > 0 && tableState.selectedRows.length === currentWorkflows.length;
  const isIndeterminate = tableState.selectedRows.length > 0 && tableState.selectedRows.length < currentWorkflows.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      selectAllRows(currentWorkflows.map((workflow) => workflow.id));
    } else {
      clearSelection();
    }
  };

  const handleSelectRow = (workflowId: string, checked: boolean) => {
    if (checked) {
      addSelectedRow(workflowId);
    } else {
      removeSelectedRow(workflowId);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
  };

  return {
    // State
    selectedRows: tableState.selectedRows,
    currentPage: tableState.currentPage,
    rowsPerPage: tableState.rowsPerPage,
    searchTerm: tableState.searchTerm,
    statusFilter: tableState.statusFilter,
    categoryFilter: tableState.categoryFilter,
    columns: tableState.columns,
    categories,
    filteredWorkflows,
    currentWorkflows,
    totalPages,
    isAllSelected,
    isIndeterminate,
    sortBy: tableState.sortBy,
    sortOrder: tableState.sortOrder,
    
    // Actions
    setSearchTerm,
    setStatusFilter,
    setCategoryFilter,
    clearFilters,
    handleSelectAll,
    handleSelectRow,
    handlePageChange,
    handleRowsPerPageChange,
    toggleColumnVisibility,
    resetColumns,
    setSorting,
    toggleSort,
    resetTable,
  };
};

// Import React for useMemo
import React from 'react';
