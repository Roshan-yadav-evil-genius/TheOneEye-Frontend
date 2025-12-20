"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { NodeFormField } from "./node-form-field";
import { ApiService } from "@/lib/api/api-service";
import { TNodeMetadata, TNodeFormData } from "@/types";
import { IconPlayerPlay, IconLoader2, IconDeviceFloppy } from "@tabler/icons-react";

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
}: NodeFormEditorProps) {
  const [formState, setFormState] = useState<TNodeFormData | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [loadingFields, setLoadingFields] = useState<Set<string>>(new Set());
  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Get all transitive dependent fields (recursive)
  const getAllDependentFields = useCallback(
    (fieldName: string, visited = new Set<string>()): string[] => {
      if (!formState?.dependencies || visited.has(fieldName)) return [];
      visited.add(fieldName);
      
      const directDependents = formState.dependencies[fieldName] || [];
      const allDependents: string[] = [...directDependents];
      
      for (const dependent of directDependents) {
        allDependents.push(...getAllDependentFields(dependent, visited));
      }
      
      return allDependents;
    },
    [formState?.dependencies]
  );

  // Load form schema from API
  useEffect(() => {
    const loadForm = async () => {
      setIsLoadingForm(true);
      setFormError(null);
      console.log("[NodeFormEditor] Loading form for:", node.identifier);
      console.log("[NodeFormEditor] Node has_form:", node.has_form);
      try {
        const response = await ApiService.getNodeForm(node.identifier);
        console.log("[NodeFormEditor] API Response:", response);
        console.log("[NodeFormEditor] response.form:", response.form);
        console.log("[NodeFormEditor] response.message:", response.message);
        
        if (response.form) {
          console.log("[NodeFormEditor] Form fields:", response.form.fields);
          console.log("[NodeFormEditor] Form dependencies:", response.form.dependencies);
          setFormState(response.form);
          
          // Initialize form values - prefer persisted values, fall back to defaults
          const defaultValues: Record<string, string> = {};
          response.form.fields?.forEach((field) => {
            if (field.value !== undefined && field.value !== null) {
              defaultValues[field.name] = String(field.value);
            } else if (field.options?.find((o) => o.selected)) {
              const selected = field.options.find((o) => o.selected);
              if (selected) {
                defaultValues[field.name] = selected.value;
              }
            } else {
              defaultValues[field.name] = "";
            }
          });
          
          // Merge persisted values with defaults (persisted takes precedence)
          const mergedValues = initialFormValues && Object.keys(initialFormValues).length > 0
            ? { ...defaultValues, ...initialFormValues }
            : defaultValues;
          
          console.log("[NodeFormEditor] Initial values:", mergedValues);
          setFormValues(mergedValues);
        } else {
          console.warn("[NodeFormEditor] No form in response, message:", response.message);
          setFormError(response.message || "This node does not have a form");
        }
      } catch (error) {
        console.error("[NodeFormEditor] Failed to load node form:", error);
        setFormError("Failed to load form");
      } finally {
        setIsLoadingForm(false);
      }
    };

    if (node.has_form) {
      console.log("[NodeFormEditor] Node has form, loading...");
      loadForm();
    } else {
      console.log("[NodeFormEditor] Node does not have form flag set");
      setIsLoadingForm(false);
      setFormError("This node does not have a form");
    }
  }, [node.identifier, node.has_form]);

  // Notify parent when form values change
  useEffect(() => {
    if (onFormValuesChange && Object.keys(formValues).length > 0) {
      onFormValuesChange(formValues);
    }
  }, [formValues, onFormValuesChange]);

  // Handle field value change with dynamic field updates
  const handleFieldChange = useCallback(
    async (fieldName: string, value: string) => {
      // Update the field value
      setFormValues((prev) => ({ ...prev, [fieldName]: value }));

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
          setLoadingFields((prev) => new Set(prev).add(dependentField));

          try {
            const response = await ApiService.getNodeFieldOptions(node.identifier, {
              parent_field: fieldName,
              parent_value: value,
              dependent_field: dependentField,
              form_values: { ...formValues, [fieldName]: value },
            });

            // Update the dependent field's options
            setFormState((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                fields: prev.fields.map((field) => {
                  if (field.name === dependentField) {
                    return {
                      ...field,
                      options: response.options,
                    };
                  }
                  return field;
                }),
              };
            });

            // Clear the dependent field's value
            setFormValues((prev) => ({ ...prev, [dependentField]: "" }));
          } catch (error) {
            console.error(`Failed to load options for ${dependentField}:`, error);
          } finally {
            setLoadingFields((prev) => {
              const next = new Set(prev);
              next.delete(dependentField);
              return next;
            });
          }
        }
      }
    },
    [formState?.dependencies, node.identifier, getAllDependentFields]
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

