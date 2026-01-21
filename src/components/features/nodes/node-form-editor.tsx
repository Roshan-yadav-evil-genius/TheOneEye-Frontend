"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { NodeFormField } from "./node-form-field";
import { TNodeMetadata, TNodeFormData } from "@/types";
import { IconPlayerPlay, IconLoader2, IconDeviceFloppy } from "@tabler/icons-react";
import { useFormLoader } from "@/hooks/useFormLoader";
import { useFieldDependencies } from "@/hooks/useFieldDependencies";
import { useFormState } from "@/hooks/useFormState";

interface NodeFormEditorProps {
  node: TNodeMetadata;
  onExecute: (formData: Record<string, string>) => void;
  isExecuting?: boolean;
  initialFormValues?: Record<string, string>;
  onFormValuesChange?: (formData: Record<string, string>) => void;
  /** When false, hides the Execute button from the bottom of the form */
  showExecuteButton?: boolean;
  /** When provided, shows a Save button at the bottom of the form */
  onSave?: () => void;
  /** Loading state for the Save button */
  isSaving?: boolean;
  /** Form state from execution errors (with validation errors) */
  executionFormState?: TNodeFormData | null;
}

export function NodeFormEditor({
  node,
  onExecute,
  isExecuting = false,
  initialFormValues,
  onFormValuesChange,
  showExecuteButton = true,
  onSave,
  isSaving = false,
  executionFormState,
}: NodeFormEditorProps) {
  // Track which fields are currently loading
  const [loadingFields, setLoadingFields] = useState<Set<string>>(new Set());

  // Load form schema
  const { 
    formState: loadedFormState, 
    setFormState,
    isLoading: isLoadingForm, 
    error: formError,
    updateForm,
    isUpdating,
  } = useFormLoader(node.identifier, node.has_form);

  // Manage form state with local state for updates
  const [formState, setLocalFormState] = useState(loadedFormState);

  // Update formState when loaded form changes
  useEffect(() => {
    if (loadedFormState) {
      setLocalFormState(loadedFormState);
    }
  }, [loadedFormState]);

  // Update formState when execution returns validation errors or clears them on success
  useEffect(() => {
    if (executionFormState) {
      // Execution returned validation errors - merge errors into existing state, preserve choices
      setLocalFormState(prev => {
        if (!prev) return executionFormState;
        
        return {
          ...prev,
          form_level_errors: executionFormState.form_level_errors || [],
          fields: prev.fields.map(existingField => {
            const errorField = executionFormState.fields?.find(f => f.name === existingField.name);
            return {
              ...existingField,
              // Update errors from response
              field_level_errors: errorField?.field_level_errors || [],
              // Update value if backend rendered it (e.g., Jinja templates)
              value: errorField?.value !== undefined ? errorField.value : existingField.value,
            };
          }),
        };
      });
    } else {
      // Execution succeeded or cleared - remove any previous errors from form state
      setLocalFormState(prev => {
        if (!prev) return prev;
        // Only update if there are actually errors to clear
        const hasErrors = prev.fields.some(f => f.field_level_errors?.length > 0) || 
                          (prev.form_level_errors?.length > 0);
        if (!hasErrors) return prev;
        
        return {
          ...prev,
          fields: prev.fields.map(field => ({
            ...field,
            field_level_errors: []
          })),
          form_level_errors: []
        };
      });
    }
  }, [executionFormState]);

  // Manage form state
  const { formValues, setFormValues, updateFieldValue, formValuesRef } = useFormState(formState, {
    initialFormValues,
    executionFormState,
    onFormValuesChange,
  });

  // Field dependencies
  const { getAllDependentFields, hasDependents, parentToChildren } = useFieldDependencies(formState);

  // Track if initial load with persisted values has been done (prevents infinite loops)
  const initialLoadDoneRef = useRef(false);

  // Reset initial load flag when node changes
  useEffect(() => {
    initialLoadDoneRef.current = false;
  }, [node.identifier]);

  // After form loads with persisted OR auto-selected values, load options for dependent fields
  useEffect(() => {
    const loadDependentFieldOptions = async () => {
      // Only run once per node
      if (initialLoadDoneRef.current) return;
      if (!formState?.dependencies_graph) return;

      // Use initialFormValues if provided, otherwise use current formValues (which may have auto-selected values)
      const allValues = (initialFormValues && Object.keys(initialFormValues).length > 0)
        ? initialFormValues
        : formValuesRef.current;

      // Categorize fields for cascading loads
      const dependentFields = new Set(Object.keys(formState.dependencies_graph));
      const parentFields = new Set(
        Object.values(formState.dependencies_graph).flat()
      );
      
      // Fields that have persisted values and are parents (need to trigger child loaders)
      const parentsWithValues = [...parentFields].filter(
        field => allValues[field] && allValues[field] !== ''
      );

      if (parentsWithValues.length === 0) return;

      initialLoadDoneRef.current = true;

      // TWO-CALL APPROACH for cascading dependencies:
      // Call 1: Send only ROOT parents (non-dependent) to load INTERMEDIATE choices
      // Call 2: Send all parents to load LEAF choices
      
      // Root parents = parent fields that are NOT dependents themselves
      const rootParentValues = Object.fromEntries(
        Object.entries(allValues).filter(([key]) => 
          parentFields.has(key) && !dependentFields.has(key) && allValues[key] && allValues[key] !== ''
        )
      );
      
      // All parent values (for second call)
      const allParentValues = Object.fromEntries(
        Object.entries(allValues).filter(([key]) => 
          parentFields.has(key) && allValues[key] && allValues[key] !== ''
        )
      );

      try {
        let latestForm = formState;
        
        // CALL 1: Load intermediate choices (e.g., spreadsheet choices from google_account)
        if (Object.keys(rootParentValues).length > 0) {
          const intermediateForm = await updateForm(rootParentValues, latestForm, {});
          if (intermediateForm) {
            latestForm = intermediateForm;
            setLocalFormState(intermediateForm);
          }
        }

        // CALL 2: Load leaf choices (e.g., sheet choices from google_account + spreadsheet)
        // Only if there are intermediate parent values (fields that are both dependent and parent)
        const intermediateParentValues = Object.fromEntries(
          Object.entries(allValues).filter(([key]) => 
            parentFields.has(key) && dependentFields.has(key) && allValues[key] && allValues[key] !== ''
          )
        );
        
        if (Object.keys(intermediateParentValues).length > 0) {
          const leafForm = await updateForm(allParentValues, latestForm, rootParentValues);
          if (leafForm) {
            setLocalFormState(leafForm);
          }
        }
      } catch (err) {
        console.error('[NodeFormEditor] Failed to load dependent field options:', err);
      }
    };

    if (!isLoadingForm && formState) {
      loadDependentFieldOptions();
    }
  }, [isLoadingForm, formState, updateForm, initialFormValues, formValuesRef]);

  // Handle field value change with dynamic field updates
  const handleFieldChange = useCallback(
    async (fieldName: string, value: string) => {
      // Update the field value locally immediately
      updateFieldValue(fieldName, value);

      // Clear all transitive dependent field values immediately
      const allDependents = getAllDependentFields(fieldName);
      if (allDependents.length > 0) {
        setFormValues((prev) => {
          const updated = { ...prev, [fieldName]: value };
          for (const dep of allDependents) {
            updated[dep] = "";
          }
          return updated;
        });
      }

      // Check if this field has dependents that need their options loaded
      if (hasDependents(fieldName)) {
        // Mark dependent fields as loading
        const directDependents = parentToChildren[fieldName] || [];
        setLoadingFields(prev => {
          const next = new Set(prev);
          directDependents.forEach(f => next.add(f));
          return next;
        });

        try {
          // Capture cached values BEFORE the update for dependency comparison
          const cachedValues = { ...formValuesRef.current };
          
          // Get current form values including the new value
          // FIX: Delete dependent field values so their loaders run (like lab/app)
          const currentFormValues = { ...formValuesRef.current, [fieldName]: value };
          for (const dep of allDependents) {
            delete currentFormValues[dep];
          }
          
          // Update form with current values to trigger loaders for dependent fields
          // Pass cached schema and values for smart choice preservation
          const updatedForm = await updateForm(
            currentFormValues,
            formState,     // cached schema
            cachedValues   // values before this change
          );
          if (updatedForm) {
            setLocalFormState(updatedForm);
          }
        } catch (err) {
          console.error('[NodeFormEditor] Failed to update dependent field options:', err);
        } finally {
          // Remove loading state for dependent fields
          setLoadingFields(prev => {
            const next = new Set(prev);
            directDependents.forEach(f => next.delete(f));
            return next;
          });
        }
      }
    },
    [hasDependents, parentToChildren, getAllDependentFields, updateFieldValue, setFormValues, updateForm, formValuesRef, formState]
  );

  const handleExecute = () => {
    onExecute(formValues);
  };

  // Loading state
  if (isLoadingForm) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <IconLoader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Loading form...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (formError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-sm">{formError}</p>
        </div>
      </div>
    );
  }

  // No form state
  if (!formState || !formState.fields) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-sm">No form available for this node</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Form Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 sidebar-scrollbar">
        {/* Form-level errors */}
        {formState.form_level_errors && formState.form_level_errors.length > 0 && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-md p-3">
            {formState.form_level_errors.map((error, index) => (
              <p key={index} className="text-red-400 text-sm">
                {error}
              </p>
            ))}
          </div>
        )}

        {/* Render form fields */}
        {formState.fields.map((field) => (
          <NodeFormField
            key={field.name}
            field={field}
            value={formValues[field.name] || ""}
            onChange={(value) => handleFieldChange(field.name, value)}
            isLoading={loadingFields.has(field.name) || isUpdating}
          />
        ))}
      </div>

      {/* Bottom Button Section - conditionally render Save or Execute */}
      {(showExecuteButton || onSave) && (
        <div className="border-t border-gray-700 p-4 flex-shrink-0">
          {onSave ? (
            <Button
              onClick={onSave}
              disabled={isSaving}
              variant="secondary"
              className="w-full"
            >
              {isSaving ? (
                <>
                  <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <IconDeviceFloppy className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          ) : showExecuteButton ? (
            <Button
              onClick={handleExecute}
              disabled={isExecuting}
              className="w-full"
            >
              {isExecuting ? (
                <>
                  <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <IconPlayerPlay className="h-4 w-4 mr-2" />
                  Execute Node
                </>
              )}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
