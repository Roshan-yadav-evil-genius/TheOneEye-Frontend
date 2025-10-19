import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { FormValues, FormValue } from '@/types/forms/form-values';
import { nodeFormValuesApi } from '@/lib/api/node-form-values';

// Form values state for a specific workflow/node/user combination
interface NodeFormValuesState {
  formValues: FormValues;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  autoSaveEnabled: boolean;
  lastAutoSave: Date | null;
}

// Store state - maps keys to form values state
interface NodeFormValuesStoreState {
  // Map of "workflowId:nodeId:userId" -> form values state
  formValues: Record<string, NodeFormValuesState>;
  
  // Global settings
  autoSaveInterval: number; // milliseconds
  autoSaveDelay: number; // milliseconds - delay before auto-save
  maxRetries: number;
}

interface NodeFormValuesStoreActions {
  // Form values management
  initializeFormValues: (workflowId: string, nodeId: string, userId?: string) => Promise<void>;
  updateFormValue: (workflowId: string, nodeId: string, fieldName: string, value: FormValue, userId?: string) => void;
  updateFormValues: (workflowId: string, nodeId: string, values: FormValues, userId?: string) => void;
  clearFormValues: (workflowId: string, nodeId: string, userId?: string) => Promise<void>;
  
  // Save operations
  saveFormValues: (workflowId: string, nodeId: string, userId?: string) => Promise<void>;
  saveAllPending: () => Promise<void>;
  
  // Auto-save management
  enableAutoSave: (workflowId: string, nodeId: string, enabled: boolean, userId?: string) => void;
  setAutoSaveInterval: (interval: number) => void;
  setAutoSaveDelay: (delay: number) => void;
  
  // State queries
  getFormValues: (workflowId: string, nodeId: string, userId?: string) => FormValues;
  getFormState: (workflowId: string, nodeId: string, userId?: string) => NodeFormValuesState | null;
  hasUnsavedChanges: (workflowId: string, nodeId: string, userId?: string) => boolean;
  hasAnyUnsavedChanges: () => boolean;
  getUnsavedForms: () => Array<{ workflowId: string; nodeId: string; userId: string; key: string }>;
  
  // Utility
  clearAllFormValues: () => void;
  retryFailedSaves: () => Promise<void>;
}

type NodeFormValuesStore = NodeFormValuesStoreState & NodeFormValuesStoreActions;

const defaultFormValuesState: NodeFormValuesState = {
  formValues: {},
  isLoading: false,
  isSaving: false,
  error: null,
  lastSaved: null,
  hasUnsavedChanges: false,
  autoSaveEnabled: true,
  lastAutoSave: null,
};

const initialState: NodeFormValuesStoreState = {
  formValues: {},
  autoSaveInterval: 2000, // 2 seconds
  autoSaveDelay: 1000, // 1 second delay before auto-save
  maxRetries: 3,
};

// Helper to create form key
const createFormKey = (workflowId: string, nodeId: string, userId: string = 'default'): string => {
  return `${workflowId}:${nodeId}:${userId}`;
};

export const useNodeFormValuesStore = create<NodeFormValuesStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Form values management
        initializeFormValues: async (workflowId: string, nodeId: string, userId: string = 'default') => {
          const formKey = createFormKey(workflowId, nodeId, userId);
          
          // Don't reinitialize if already exists
          if (get().formValues[formKey]) {
            return;
          }

          set((state) => {
            state.formValues[formKey] = {
              ...defaultFormValuesState,
              isLoading: true,
            };
          });

          try {
            const response = await nodeFormValuesApi.getFormValues(workflowId, nodeId, userId);
            
            set((state) => {
              if (state.formValues[formKey]) {
                state.formValues[formKey].formValues = response.form_values;
                state.formValues[formKey].lastSaved = new Date(response.last_updated);
                state.formValues[formKey].isLoading = false;
                state.formValues[formKey].error = null;
              }
            });
          } catch (error) {
            set((state) => {
              if (state.formValues[formKey]) {
                state.formValues[formKey].error = error instanceof Error ? error.message : 'Failed to load form values';
                state.formValues[formKey].isLoading = false;
              }
            });
          }
        },

        updateFormValue: (workflowId: string, nodeId: string, fieldName: string, value: FormValue, userId: string = 'default') => {
          const formKey = createFormKey(workflowId, nodeId, userId);
          
          set((state) => {
            if (!state.formValues[formKey]) {
              state.formValues[formKey] = { ...defaultFormValuesState };
            }
            
            state.formValues[formKey].formValues = {
              ...state.formValues[formKey].formValues,
              [fieldName]: value,
            };
            state.formValues[formKey].hasUnsavedChanges = true;
            state.formValues[formKey].error = null;
          });
        },

        updateFormValues: (workflowId: string, nodeId: string, values: FormValues, userId: string = 'default') => {
          const formKey = createFormKey(workflowId, nodeId, userId);
          
          set((state) => {
            if (!state.formValues[formKey]) {
              state.formValues[formKey] = { ...defaultFormValuesState };
            }
            
            state.formValues[formKey].formValues = values;
            state.formValues[formKey].hasUnsavedChanges = true;
            state.formValues[formKey].error = null;
          });
        },

        clearFormValues: async (workflowId: string, nodeId: string, userId: string = 'default') => {
          const formKey = createFormKey(workflowId, nodeId, userId);
          
          set((state) => {
            if (state.formValues[formKey]) {
              state.formValues[formKey].isLoading = true;
              state.formValues[formKey].error = null;
            }
          });

          try {
            await nodeFormValuesApi.clearFormValues(workflowId, nodeId, userId);
            
            set((state) => {
              if (state.formValues[formKey]) {
                state.formValues[formKey].formValues = {};
                state.formValues[formKey].lastSaved = null;
                state.formValues[formKey].hasUnsavedChanges = false;
                state.formValues[formKey].isLoading = false;
              }
            });
          } catch (error) {
            set((state) => {
              if (state.formValues[formKey]) {
                state.formValues[formKey].error = error instanceof Error ? error.message : 'Failed to clear form values';
                state.formValues[formKey].isLoading = false;
              }
            });
          }
        },

        // Save operations
        saveFormValues: async (workflowId: string, nodeId: string, userId: string = 'default') => {
          const formKey = createFormKey(workflowId, nodeId, userId);
          const formState = get().formValues[formKey];
          
          if (!formState || !formState.hasUnsavedChanges || formState.isSaving) {
            return;
          }

          set((state) => {
            if (state.formValues[formKey]) {
              state.formValues[formKey].isSaving = true;
              state.formValues[formKey].error = null;
            }
          });

          try {
            const response = await nodeFormValuesApi.saveFormValues(workflowId, nodeId, {
              user_id: userId,
              form_values: formState.formValues,
            });
            
            set((state) => {
              if (state.formValues[formKey]) {
                state.formValues[formKey].lastSaved = new Date(response.last_updated);
                state.formValues[formKey].hasUnsavedChanges = false;
                state.formValues[formKey].isSaving = false;
                state.formValues[formKey].lastAutoSave = new Date();
              }
            });
          } catch (error) {
            set((state) => {
              if (state.formValues[formKey]) {
                state.formValues[formKey].error = error instanceof Error ? error.message : 'Failed to save form values';
                state.formValues[formKey].isSaving = false;
              }
            });
          }
        },

        saveAllPending: async () => {
          const unsavedForms = get().getUnsavedForms();
          
          // Save all forms in parallel
          await Promise.all(
            unsavedForms.map(({ workflowId, nodeId, userId }) =>
              get().saveFormValues(workflowId, nodeId, userId)
            )
          );
        },

        // Auto-save management
        enableAutoSave: (workflowId: string, nodeId: string, enabled: boolean, userId: string = 'default') => {
          const formKey = createFormKey(workflowId, nodeId, userId);
          
          set((state) => {
            if (state.formValues[formKey]) {
              state.formValues[formKey].autoSaveEnabled = enabled;
            }
          });
        },

        setAutoSaveInterval: (interval: number) => {
          set((state) => {
            state.autoSaveInterval = interval;
          });
        },

        setAutoSaveDelay: (delay: number) => {
          set((state) => {
            state.autoSaveDelay = delay;
          });
        },

        // State queries
        getFormValues: (workflowId: string, nodeId: string, userId: string = 'default') => {
          const formKey = createFormKey(workflowId, nodeId, userId);
          const formState = get().formValues[formKey];
          return formState?.formValues || {};
        },

        getFormState: (workflowId: string, nodeId: string, userId: string = 'default') => {
          const formKey = createFormKey(workflowId, nodeId, userId);
          return get().formValues[formKey] || null;
        },

        hasUnsavedChanges: (workflowId: string, nodeId: string, userId: string = 'default') => {
          const formState = get().getFormState(workflowId, nodeId, userId);
          return formState?.hasUnsavedChanges || false;
        },

        hasAnyUnsavedChanges: () => {
          return Object.values(get().formValues).some(state => state.hasUnsavedChanges);
        },

        getUnsavedForms: () => {
          const unsavedForms: Array<{ workflowId: string; nodeId: string; userId: string; key: string }> = [];
          
          Object.entries(get().formValues).forEach(([key, state]) => {
            if (state.hasUnsavedChanges) {
              const [workflowId, nodeId, userId] = key.split(':');
              unsavedForms.push({ workflowId, nodeId, userId, key });
            }
          });
          
          return unsavedForms;
        },

        // Utility
        clearAllFormValues: () => {
          set((state) => {
            state.formValues = {};
          });
        },

        retryFailedSaves: async () => {
          const failedForms = Object.entries(get().formValues)
            .filter(([, state]) => state.error && state.hasUnsavedChanges)
            .map(([key]) => {
              const [workflowId, nodeId, userId] = key.split(':');
              return { workflowId, nodeId, userId };
            });

          await Promise.all(
            failedForms.map(({ workflowId, nodeId, userId }) =>
              get().saveFormValues(workflowId, nodeId, userId)
            )
          );
        },
      })),
      {
        name: 'node-form-values-store',
        partialize: (state) => ({
          // Only persist the form values data, not the global settings
          formValues: state.formValues,
        }),
        version: 1,
        migrate: (persistedState: unknown, version: number) => {
          // Handle future migrations here
          return persistedState;
        },
      }
    ),
    {
      name: 'node-form-values-store',
    }
  )
);

// Auto-save hook for components to use
export const useAutoSaveFormValues = (workflowId: string, nodeId: string, userId: string = 'default') => {
  const { autoSaveInterval, autoSaveDelay, formValues } = useNodeFormValuesStore();
  const formKey = createFormKey(workflowId, nodeId, userId);
  const formState = formValues[formKey];

  // Set up auto-save with delay
  React.useEffect(() => {
    if (!formState?.autoSaveEnabled || !formState?.hasUnsavedChanges) {
      return;
    }

    const timeoutId = setTimeout(() => {
      useNodeFormValuesStore.getState().saveFormValues(workflowId, nodeId, userId);
    }, autoSaveDelay);

    return () => clearTimeout(timeoutId);
  }, [workflowId, nodeId, userId, autoSaveDelay, formState?.autoSaveEnabled, formState?.hasUnsavedChanges]);

  // Set up periodic auto-save
  React.useEffect(() => {
    if (!formState?.autoSaveEnabled) {
      return;
    }

    const interval = setInterval(() => {
      if (formState?.hasUnsavedChanges) {
        useNodeFormValuesStore.getState().saveFormValues(workflowId, nodeId, userId);
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [workflowId, nodeId, userId, autoSaveInterval, formState?.autoSaveEnabled]);
};

// Helper hook for form values management
export const useNodeFormValues = (
  workflowId: string, 
  nodeId: string, 
  userId: string = 'default',
  autoSave: boolean = true
) => {
  const {
    initializeFormValues,
    updateFormValue,
    updateFormValues,
    clearFormValues,
    saveFormValues,
    enableAutoSave,
    getFormValues,
    getFormState,
    hasUnsavedChanges,
  } = useNodeFormValuesStore();

  // Initialize form values on mount
  React.useEffect(() => {
    if (workflowId && nodeId) {
      initializeFormValues(workflowId, nodeId, userId);
    }
  }, [workflowId, nodeId, userId, initializeFormValues]);

  // Set up auto-save
  React.useEffect(() => {
    enableAutoSave(workflowId, nodeId, autoSave, userId);
  }, [workflowId, nodeId, userId, autoSave, enableAutoSave]);

  useAutoSaveFormValues(workflowId, nodeId, userId);

  const formState = getFormState(workflowId, nodeId, userId);
  const formValues = getFormValues(workflowId, nodeId, userId);

  return {
    // State
    formValues,
    isLoading: formState?.isLoading || false,
    isSaving: formState?.isSaving || false,
    error: formState?.error || null,
    lastSaved: formState?.lastSaved || null,
    hasUnsavedChanges: hasUnsavedChanges(workflowId, nodeId, userId),

    // Actions
    updateFormValue: (fieldName: string, value: FormValue) => 
      updateFormValue(workflowId, nodeId, fieldName, value, userId),
    updateFormValues: (values: FormValues) => 
      updateFormValues(workflowId, nodeId, values, userId),
    saveFormValues: () => saveFormValues(workflowId, nodeId, userId),
    clearFormValues: () => clearFormValues(workflowId, nodeId, userId),
  };
};

// Global hook to check for unsaved changes across all forms
export const useGlobalUnsavedChanges = () => {
  const { hasAnyUnsavedChanges, getUnsavedForms, saveAllPending } = useNodeFormValuesStore();
  
  return {
    hasUnsavedChanges: hasAnyUnsavedChanges(),
    unsavedForms: getUnsavedForms(),
    saveAllPending,
  };
};

// Import React for useEffect
import React from 'react';
