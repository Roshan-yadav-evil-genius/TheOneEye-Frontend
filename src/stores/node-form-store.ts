import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { BackendNodeType } from '@/types/api/backend';

// Form state for a single node form (create or edit)
interface NodeFormState {
  // Form data
  formData: Partial<BackendNodeType>;
  logoFile: File | null;
  logoPreview: string | null;
  isPreviewOpen: boolean;
  formConfigHasErrors: boolean;
  
  // UI state
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  
  // Draft management
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
}

// Store state - maps form keys to their state
interface NodeFormStoreState {
  // Map of formKey -> form state
  forms: Record<string, NodeFormState>;
  
  // Global settings
  autoSaveInterval: number; // milliseconds
  maxDraftAge: number; // milliseconds - how long to keep drafts
}

interface NodeFormStoreActions {
  // Form management
  initializeForm: (formKey: string, initialData?: Partial<BackendNodeType>) => void;
  updateFormData: (formKey: string, updates: Partial<BackendNodeType>) => void;
  updateLogo: (formKey: string, file: File | null, preview: string | null) => void;
  setPreviewOpen: (formKey: string, isOpen: boolean) => void;
  setFormConfigErrors: (formKey: string, hasErrors: boolean) => void;
  
  // Draft management
  saveDraft: (formKey: string) => Promise<void>;
  loadDraft: (formKey: string) => NodeFormState | null;
  clearDraft: (formKey: string) => void;
  clearAllDrafts: () => void;
  
  // Auto-save
  enableAutoSave: (formKey: string, enabled: boolean) => void;
  setAutoSaveInterval: (interval: number) => void;
  
  // Validation
  validateForm: (formKey: string) => { isValid: boolean; errors: string[] };
  
  // Utility
  getFormState: (formKey: string) => NodeFormState | null;
  hasUnsavedChanges: (formKey: string) => boolean;
  cleanupOldDrafts: () => void;
}

type NodeFormStore = NodeFormStoreState & NodeFormStoreActions;

const defaultFormState: NodeFormState = {
  formData: {
    name: "",
    type: "action",
    node_group: undefined,
    description: "",
    version: "1.0.0",
    tags: [],
    form_configuration: {},
  },
  logoFile: null,
  logoPreview: null,
  isPreviewOpen: false,
  formConfigHasErrors: false,
  isLoading: false,
  isSaving: false,
  error: null,
  hasUnsavedChanges: false,
  lastSaved: null,
  autoSaveEnabled: true,
};

const initialState: NodeFormStoreState = {
  forms: {},
  autoSaveInterval: 30000, // 30 seconds
  maxDraftAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const useNodeFormStore = create<NodeFormStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Form management
        initializeForm: (formKey: string, initialData?: Partial<BackendNodeType>) => {
          set((state) => {
            if (!state.forms[formKey]) {
              state.forms[formKey] = {
                ...defaultFormState,
                formData: { ...defaultFormState.formData, ...initialData },
              };
            } else if (initialData) {
              // Merge with existing data
              state.forms[formKey].formData = {
                ...state.forms[formKey].formData,
                ...initialData,
              };
            }
          });
        },

        updateFormData: (formKey: string, updates: Partial<BackendNodeType>) => {
          set((state) => {
            if (state.forms[formKey]) {
              state.forms[formKey].formData = {
                ...state.forms[formKey].formData,
                ...updates,
              };
              state.forms[formKey].hasUnsavedChanges = true;
              state.forms[formKey].error = null;
            }
          });
        },

        updateLogo: (formKey: string, file: File | null, preview: string | null) => {
          set((state) => {
            if (state.forms[formKey]) {
              state.forms[formKey].logoFile = file;
              state.forms[formKey].logoPreview = preview;
              state.forms[formKey].hasUnsavedChanges = true;
            }
          });
        },

        setPreviewOpen: (formKey: string, isOpen: boolean) => {
          set((state) => {
            if (state.forms[formKey]) {
              state.forms[formKey].isPreviewOpen = isOpen;
            }
          });
        },

        setFormConfigErrors: (formKey: string, hasErrors: boolean) => {
          set((state) => {
            if (state.forms[formKey]) {
              state.forms[formKey].formConfigHasErrors = hasErrors;
            }
          });
        },

        // Draft management
        saveDraft: async (formKey: string) => {
          const formState = get().forms[formKey];
          if (!formState || !formState.hasUnsavedChanges) return;

          set((state) => {
            if (state.forms[formKey]) {
              state.forms[formKey].isSaving = true;
              state.forms[formKey].error = null;
            }
          });

          try {
            // In a real implementation, this would save to localStorage or backend
            // For now, we'll just update the timestamp
            set((state) => {
              if (state.forms[formKey]) {
                state.forms[formKey].lastSaved = new Date();
                state.forms[formKey].hasUnsavedChanges = false;
                state.forms[formKey].isSaving = false;
              }
            });
          } catch (error) {
            set((state) => {
              if (state.forms[formKey]) {
                state.forms[formKey].error = error instanceof Error ? error.message : 'Failed to save draft';
                state.forms[formKey].isSaving = false;
              }
            });
          }
        },

        loadDraft: (formKey: string) => {
          const formState = get().forms[formKey];
          if (!formState) return null;

          // Check if draft is too old
          if (formState.lastSaved) {
            const age = Date.now() - formState.lastSaved.getTime();
            if (age > get().maxDraftAge) {
              get().clearDraft(formKey);
              return null;
            }
          }

          return formState;
        },

        clearDraft: (formKey: string) => {
          set((state) => {
            delete state.forms[formKey];
          });
        },

        clearAllDrafts: () => {
          set((state) => {
            state.forms = {};
          });
        },

        // Auto-save
        enableAutoSave: (formKey: string, enabled: boolean) => {
          set((state) => {
            if (state.forms[formKey]) {
              state.forms[formKey].autoSaveEnabled = enabled;
            }
          });
        },

        setAutoSaveInterval: (interval: number) => {
          set((state) => {
            state.autoSaveInterval = interval;
          });
        },

        // Validation
        validateForm: (formKey: string) => {
          const formState = get().forms[formKey];
          if (!formState) {
            return { isValid: false, errors: ['Form not found'] };
          }

          const errors: string[] = [];
          const { formData, formConfigHasErrors } = formState;

          if (!formData.name || formData.name.trim() === '') {
            errors.push('Node name is required');
          }

          if (!formData.node_group) {
            errors.push('Node group is required');
          }

          if (formConfigHasErrors) {
            errors.push('Form configuration has errors');
          }

          return {
            isValid: errors.length === 0,
            errors,
          };
        },

        // Utility
        getFormState: (formKey: string) => {
          return get().forms[formKey] || null;
        },

        hasUnsavedChanges: (formKey: string) => {
          const formState = get().forms[formKey];
          return formState?.hasUnsavedChanges || false;
        },

        cleanupOldDrafts: () => {
          const now = Date.now();
          const maxAge = get().maxDraftAge;

          set((state) => {
            Object.keys(state.forms).forEach((formKey) => {
              const formState = state.forms[formKey];
              if (formState.lastSaved) {
                const age = now - formState.lastSaved.getTime();
                if (age > maxAge) {
                  delete state.forms[formKey];
                }
              }
            });
          });
        },
      })),
      {
        name: 'node-form-store',
        partialize: (state) => ({
          // Only persist the forms data, not the global settings
          forms: state.forms,
        }),
        version: 1,
        migrate: (persistedState: unknown, version: number) => {
          // Handle future migrations here
          return persistedState;
        },
      }
    ),
    {
      name: 'node-form-store',
    }
  )
);

// Auto-save hook for components to use
export const useAutoSave = (formKey: string) => {
  const { autoSaveInterval, forms } = useNodeFormStore();
  const formState = forms[formKey];

  // Set up auto-save interval
  React.useEffect(() => {
    if (!formState?.autoSaveEnabled || !formState?.hasUnsavedChanges) {
      return;
    }

    const interval = setInterval(() => {
      useNodeFormStore.getState().saveDraft(formKey);
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [formKey, autoSaveInterval, formState?.autoSaveEnabled, formState?.hasUnsavedChanges]);
};

// Helper hook for form management
export const useNodeForm = (formKey: string, initialData?: Partial<BackendNodeType>) => {
  const {
    initializeForm,
    updateFormData,
    updateLogo,
    setPreviewOpen,
    setFormConfigErrors,
    saveDraft,
    loadDraft,
    clearDraft,
    validateForm,
    getFormState,
    hasUnsavedChanges,
  } = useNodeFormStore();

  // Initialize form on mount
  React.useEffect(() => {
    initializeForm(formKey, initialData);
  }, [formKey, initializeForm]);

  // Set up auto-save
  useAutoSave(formKey);

  const formState = getFormState(formKey);
  const validation = validateForm(formKey);

  return {
    // State
    formData: formState?.formData || defaultFormState.formData,
    logoFile: formState?.logoFile || null,
    logoPreview: formState?.logoPreview || null,
    isPreviewOpen: formState?.isPreviewOpen || false,
    formConfigHasErrors: formState?.formConfigHasErrors || false,
    isLoading: formState?.isLoading || false,
    isSaving: formState?.isSaving || false,
    error: formState?.error || null,
    hasUnsavedChanges: hasUnsavedChanges(formKey),
    lastSaved: formState?.lastSaved || null,
    isValid: validation.isValid,
    validationErrors: validation.errors,

    // Actions
    updateFormData: (updates: Partial<BackendNodeType>) => updateFormData(formKey, updates),
    updateLogo: (file: File | null, preview: string | null) => updateLogo(formKey, file, preview),
    setPreviewOpen: (isOpen: boolean) => setPreviewOpen(formKey, isOpen),
    setFormConfigErrors: (hasErrors: boolean) => setFormConfigErrors(formKey, hasErrors),
    saveDraft: () => saveDraft(formKey),
    clearDraft: () => clearDraft(formKey),
  };
};

// Import React for useEffect
import React from 'react';
