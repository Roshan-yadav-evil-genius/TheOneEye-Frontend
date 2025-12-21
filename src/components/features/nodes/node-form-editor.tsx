"use client";

import { useEffect, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { NodeFormField } from "./node-form-field";
import { TNodeMetadata } from "@/types";
import { IconPlayerPlay, IconLoader2, IconDeviceFloppy } from "@tabler/icons-react";
import { useFormLoader } from "@/hooks/useFormLoader";
import { useFieldDependencies } from "@/hooks/useFieldDependencies";
import { useDynamicFieldOptions } from "@/hooks/useDynamicFieldOptions";
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
  // Load form schema
  const { formState: loadedFormState, isLoading: isLoadingForm, error: formError } = useFormLoader(
    node.identifier,
    node.has_form
  );

  // Manage form state with local state for updates
  const [formState, setFormState] = useState(loadedFormState);

  // Update formState when loaded form changes
  // Only update if formState actually changed to avoid unnecessary re-renders
  useEffect(() => {
    if (loadedFormState) {
      setFormState(loadedFormState);
    }
  }, [loadedFormState]);

  // Update formState when execution returns validation errors
  useEffect(() => {
    if (executionFormState) {
      setFormState(executionFormState);
    }
  }, [executionFormState]);

  // Manage form state
  const { formValues, setFormValues, updateFieldValue, formValuesRef } = useFormState(formState, {
    initialFormValues,
    executionFormState,
    onFormValuesChange,
  });

  // Field dependencies
  const { getAllDependentFields } = useFieldDependencies(formState);

  // Dynamic field options
  const { loadingFields, updateFieldOptions } = useDynamicFieldOptions(formState, setFormState);

  // After form loads with persisted values, load options for dependent fields
  useEffect(() => {
    const loadDependentFieldOptions = async () => {
      if (!formState?.dependencies || !initialFormValues || Object.keys(initialFormValues).length === 0) {
        return;
      }

      // For each parent field that has a persisted value, load its dependent field options
      for (const parentField of Object.keys(formState.dependencies)) {
        const parentValue = initialFormValues[parentField];
        if (!parentValue) continue;

        const dependentFields = formState.dependencies[parentField];

        for (const dependentField of dependentFields) {
          await updateFieldOptions(
            node.identifier,
            parentField,
            parentValue,
            dependentField,
            initialFormValues
          );
        }
      }
    };

    if (!isLoadingForm && formState) {
      loadDependentFieldOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingForm, formState?.dependencies, node.identifier]);

  // Handle field value change with dynamic field updates
  const handleFieldChange = useCallback(
    async (fieldName: string, value: string) => {
      // Update the field value
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

      // Check if this field has dependents
      if (formState?.dependencies && formState.dependencies[fieldName]) {
        const dependentFields = formState.dependencies[fieldName];

        // Load options for each dependent field
        for (const dependentField of dependentFields) {
          // Use ref to get latest formValues (avoids stale closure)
          const currentFormValues = { ...formValuesRef.current, [fieldName]: value };
          await updateFieldOptions(
            node.identifier,
            fieldName,
            value,
            dependentField,
            currentFormValues
          );

          // Clear the dependent field's value
          setFormValues((prev) => ({ ...prev, [dependentField]: "" }));
        }
      }
    },
    [formState?.dependencies, node.identifier, getAllDependentFields, updateFieldValue, setFormValues, updateFieldOptions, formValuesRef]
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
        {/* Non-field errors */}
        {formState.non_field_errors && formState.non_field_errors.length > 0 && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-md p-3">
            {formState.non_field_errors.map((error, index) => (
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
            isLoading={loadingFields.has(field.name)}
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

