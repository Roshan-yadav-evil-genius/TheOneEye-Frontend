import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { BackendNodeType } from '@/types/api/backend';

// Column configuration interface
interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

// Table state for nodes table
interface NodesTableState {
  // Selection state
  selectedRows: string[];
  
  // Pagination state
  currentPage: number;
  rowsPerPage: number;
  
  // Search and filter state
  searchTerm: string;
  typeFilter: string;
  nodeGroupFilter: string;
  
  // Column configuration
  columns: ColumnConfig[];
  
  // Sorting state
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Store state
interface NodesTableStoreState {
  // Table state
  tableState: NodesTableState;
  
  // Global settings
  defaultRowsPerPage: number;
  maxRowsPerPage: number;
}

interface NodesTableStoreActions {
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
  setTypeFilter: (typeFilter: string) => void;
  setNodeGroupFilter: (nodeGroupFilter: string) => void;
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
  setDefaults: (defaults: Partial<Pick<NodesTableStoreState, 'defaultRowsPerPage' | 'maxRowsPerPage'>>) => void;
}

type NodesTableStore = NodesTableStoreState & NodesTableStoreActions;

const defaultColumnConfigs: ColumnConfig[] = [
  { id: "name", label: "Name", visible: true },
  { id: "type", label: "Type", visible: true },
  { id: "nodeGroup", label: "Group", visible: true },
  { id: "description", label: "Description", visible: true },
  { id: "version", label: "Version", visible: true },
  { id: "updatedAt", label: "Updated", visible: true },
  { id: "tags", label: "Tags", visible: true },
];

const defaultTableState: NodesTableState = {
  selectedRows: [],
  currentPage: 1,
  rowsPerPage: 10,
  searchTerm: "",
  typeFilter: "all",
  nodeGroupFilter: "all",
  columns: defaultColumnConfigs,
  sortBy: "name",
  sortOrder: "asc",
};

const initialState: NodesTableStoreState = {
  tableState: defaultTableState,
  defaultRowsPerPage: 10,
  maxRowsPerPage: 100,
};

export const useNodesTableStore = create<NodesTableStore>()(
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

        setTypeFilter: (typeFilter: string) => {
          set((state) => {
            state.tableState.typeFilter = typeFilter;
            state.tableState.currentPage = 1; // Reset to first page
            state.tableState.selectedRows = []; // Clear selection
          });
        },

        setNodeGroupFilter: (nodeGroupFilter: string) => {
          set((state) => {
            state.tableState.nodeGroupFilter = nodeGroupFilter;
            state.tableState.currentPage = 1; // Reset to first page
            state.tableState.selectedRows = []; // Clear selection
          });
        },

        clearFilters: () => {
          set((state) => {
            state.tableState.searchTerm = "";
            state.tableState.typeFilter = "all";
            state.tableState.nodeGroupFilter = "all";
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
        name: 'nodes-table-store',
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
      name: 'nodes-table-store',
    }
  )
);

// Helper hook for nodes table management
export const useNodesTable = (nodes: BackendNodeType[]) => {
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
    setTypeFilter,
    setNodeGroupFilter,
    clearFilters,
    setColumnVisibility,
    toggleColumnVisibility,
    resetColumns,
    setSorting,
    toggleSort,
    resetTable,
  } = useNodesTableStore();

  // Get unique node groups from nodes
  const nodeGroups = Array.from(
    new Set(nodes.map(n => n.node_group?.name).filter((nodeGroupName): nodeGroupName is string => Boolean(nodeGroupName)))
  );

  // Filter nodes based on search and filters
  const filteredNodes = React.useMemo(() => {
    return nodes.filter(node => {
      const matchesSearch = node.name
        .toLowerCase()
        .includes(tableState.searchTerm.toLowerCase()) ||
        (node.description || '')
          .toLowerCase()
          .includes(tableState.searchTerm.toLowerCase());
      
      const matchesType = tableState.typeFilter === "all" || node.type === tableState.typeFilter;
      const matchesNodeGroup = tableState.nodeGroupFilter === "all" || node.node_group?.name === tableState.nodeGroupFilter;
      
      return matchesSearch && matchesType && matchesNodeGroup;
    });
  }, [nodes, tableState.searchTerm, tableState.typeFilter, tableState.nodeGroupFilter]);

  // Sort filtered nodes
  const sortedNodes = React.useMemo(() => {
    return [...filteredNodes].sort((a, b) => {
      const { sortBy, sortOrder } = tableState;
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'type':
          aValue = a.type.toLowerCase();
          bValue = b.type.toLowerCase();
          break;
        case 'nodeGroup':
          aValue = a.node_group?.name?.toLowerCase() || '';
          bValue = b.node_group?.name?.toLowerCase() || '';
          break;
        case 'description':
          aValue = (a.description || '').toLowerCase();
          bValue = (b.description || '').toLowerCase();
          break;
        case 'version':
          aValue = a.version || '';
          bValue = b.version || '';
          break;
        case 'updatedAt':
          aValue = new Date(a.updated_at || a.created_at);
          bValue = new Date(b.updated_at || b.created_at);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredNodes, tableState.sortBy, tableState.sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedNodes.length / tableState.rowsPerPage);
  const startIndex = (tableState.currentPage - 1) * tableState.rowsPerPage;
  const endIndex = startIndex + tableState.rowsPerPage;
  const currentNodes = sortedNodes.slice(startIndex, endIndex);

  // Selection helpers
  const isAllSelected = currentNodes.length > 0 && tableState.selectedRows.length === currentNodes.length;
  const isIndeterminate = tableState.selectedRows.length > 0 && tableState.selectedRows.length < currentNodes.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      selectAllRows(currentNodes.map((node) => node.id));
    } else {
      clearSelection();
    }
  };

  const handleSelectRow = (nodeId: string, checked: boolean) => {
    if (checked) {
      addSelectedRow(nodeId);
    } else {
      removeSelectedRow(nodeId);
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
    typeFilter: tableState.typeFilter,
    nodeGroupFilter: tableState.nodeGroupFilter,
    columns: tableState.columns,
    nodeGroups,
    filteredNodes,
    currentNodes,
    totalPages,
    isAllSelected,
    isIndeterminate,
    sortBy: tableState.sortBy,
    sortOrder: tableState.sortOrder,
    
    // Actions
    setSearchTerm,
    setTypeFilter,
    setNodeGroupFilter,
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
