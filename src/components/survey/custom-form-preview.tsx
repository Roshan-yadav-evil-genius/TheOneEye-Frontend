"use client";

import React, { useMemo } from "react";
import { FormConfiguration, FormData, FormValidationError } from "./types";
import { FormFieldRenderer } from "./form-field-renderer";
import { useFormState } from "./use-form-state";
import { convertSurveyJSJsonToCustomFormat } from "./survey-json-converter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CustomFormPreviewProps {
  configuration: FormConfiguration | any; // Allow SurveyJS format as well
  initialData?: FormData;
  onDataChange?: (data: FormData) => void;
  onValidationChange?: (isValid: boolean, errors: FormValidationError[]) => void;
  onSubmit?: (data: FormData) => void;
  readOnly?: boolean;
  className?: string;
  showSubmitButton?: boolean;
  submitButtonText?: string;
}

export function CustomFormPreview({
  configuration,
  initialData,
  onDataChange,
  onValidationChange,
  onSubmit,
  readOnly = false,
  className = "",
  showSubmitButton = true,
  submitButtonText = "Submit",
}: CustomFormPreviewProps) {
  // Convert SurveyJS format to custom format if needed
  const customConfiguration = useMemo(() => {
    if (!configuration) return null;
    
    // Check if it's already in custom format
    if (configuration.elements && Array.isArray(configuration.elements)) {
      return configuration as FormConfiguration;
    }
    
    // Check if it's SurveyJS format (has pages or questions)
    if (configuration.pages || configuration.questions || configuration.elements) {
      try {
        return convertSurveyJSJsonToCustomFormat(configuration);
      } catch (error) {
        console.error('Error converting SurveyJS format:', error);
        return null;
      }
    }
    
    return null;
  }, [configuration]);

  // Validate configuration
  const isValidConfiguration = useMemo(() => {
    return customConfiguration && 
           customConfiguration.elements && 
           Array.isArray(customConfiguration.elements) && 
           customConfiguration.elements.length > 0;
  }, [customConfiguration]);

  // Use form state management
  const {
    data,
    errors,
    isValid,
    isDirty,
    isSubmitting,
    updateField,
    validateForm,
    setSubmitting,
    getFieldError,
  } = useFormState({
    fields: customConfiguration?.elements || [],
    initialData,
    onDataChange,
    onValidationChange,
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (readOnly) return;

    const validation = validateForm();
    if (!validation.isValid) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit?.(data);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle field value changes
  const handleFieldChange = (fieldName: string, value: any) => {
    if (readOnly) return;
    updateField(fieldName, value);
  };

  if (!isValidConfiguration) {
    return (
      <div className={`flex items-center justify-center h-96 text-muted-foreground ${className}`}>
        <div className="text-center">
          <p className="text-lg font-medium mb-2">Invalid Form Configuration</p>
          <p className="text-sm">
            {!configuration 
              ? "No form configuration provided" 
              : !customConfiguration
              ? "Unable to convert form configuration"
              : "Form configuration is missing required elements"}
          </p>
          {configuration && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm">Configuration Details</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(configuration, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`custom-form-preview ${className}`}>
      <Card className="w-full">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {customConfiguration.elements.map((field, index) => (
              <div key={field.name || index}>
                <FormFieldRenderer
                  field={field}
                  value={data[field.name]}
                  onChange={(value) => handleFieldChange(field.name, value)}
                  error={getFieldError(field.name)}
                  disabled={readOnly || isSubmitting}
                />
                
                {index < customConfiguration.elements.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}

            {showSubmitButton && !readOnly && (
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Submitting..." : submitButtonText}
                </Button>
              </div>
            )}

            {readOnly && (
              <div className="pt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  This form is in read-only mode
                </p>
              </div>
            )}
          </form>

          {/* Form Status */}
          {isDirty && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Form has unsaved changes
              </p>
            </div>
          )}

          {/* Validation Summary */}
          {errors.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800 mb-2">
                Please fix the following errors:
              </p>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error.message}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CustomFormPreview;
