"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DroppableFormInput } from "@/components/features/workflow/droppable-form-input";
import { cn } from "@/lib/utils";
import { TNodeFormField } from "@/types";

interface NodeFormFieldProps {
  field: TNodeFormField;
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

/**
 * Get choices from a field's widget
 * Handles both _choices (runtime) and choices (static)
 */
function getFieldChoices(field: TNodeFormField): Array<[string, string]> {
  return field.widget?._choices || field.widget?.choices || [];
}

/**
 * Check if field should render as a select (has choices)
 */
function isSelectField(field: TNodeFormField): boolean {
  const choices = getFieldChoices(field);
  return choices.length > 0;
}

/**
 * Check if field should render as a checkbox
 */
function isCheckboxField(field: TNodeFormField): boolean {
  return field.widget?.input_type === "checkbox";
}

/**
 * Check if field should render as a textarea
 */
function isTextareaField(field: TNodeFormField): boolean {
  // Textarea widgets have input_type as null
  return field.widget?.input_type === null && !isSelectField(field);
}

/**
 * Check if field is in JSON mode (using JSONTextareaWidget)
 */
function isJsonMode(field: TNodeFormField): boolean {
  const attrs = field.widget?.attrs as Record<string, unknown> | undefined;
  return attrs?.['data-json-mode'] === 'true' || attrs?.['data-json-mode'] === true;
}

/**
 * Check if field is required
 */
function isRequired(field: TNodeFormField): boolean {
  return field.widget?.is_required === true;
}

export function NodeFormField({
  field,
  value,
  onChange,
  isLoading = false,
}: NodeFormFieldProps) {
  const hasError = field.field_level_errors && field.field_level_errors.length > 0;
  const errorMessage = hasError ? field.field_level_errors[0] : undefined;
  const required = isRequired(field);

  // Render select field
  if (isSelectField(field)) {
    const choices = getFieldChoices(field);
    const nonEmptyChoices = choices.filter(([val]) => val !== "");
    const placeholderChoice = choices.find(([val]) => val === "");
    const placeholderText = placeholderChoice ? placeholderChoice[1] : `Select ${field.label}`;

    return (
      <div className="space-y-2">
        <Label htmlFor={field.name} className="text-sm font-medium text-gray-300">
          {field.label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </Label>
        <Select
          value={value || "__clear__"}
          onValueChange={(val) => onChange(val === "__clear__" ? "" : val)}
          disabled={field.disabled || isLoading}
        >
          <SelectTrigger
            id={field.name}
            className={cn(
              "w-full bg-gray-800 border-gray-600 text-gray-200",
              hasError && "border-red-500",
              isLoading && "opacity-50"
            )}
          >
            <SelectValue placeholder={placeholderText} />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {/* Clear/placeholder option */}
            <SelectItem
              value="__clear__"
              className="text-gray-400 focus:bg-gray-700"
            >
              {placeholderText}
            </SelectItem>
            {/* Actual options */}
            {nonEmptyChoices.map(([optValue, optLabel]) => (
              <SelectItem
                key={optValue}
                value={optValue}
                className="text-gray-200 focus:bg-gray-700"
              >
                {optLabel}
              </SelectItem>
            ))}
            {nonEmptyChoices.length === 0 && (
              <div className="px-2 py-1.5 text-sm text-gray-400">
                {isLoading ? "Loading options..." : "No options available"}
              </div>
            )}
          </SelectContent>
        </Select>
        {field.help_text && (
          <p className="text-gray-400 text-xs">{field.help_text}</p>
        )}
        {errorMessage && (
          <p className="text-red-400 text-xs">{errorMessage}</p>
        )}
      </div>
    );
  }

  // Render checkbox field
  if (isCheckboxField(field)) {
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          id={field.name}
          checked={value === "true" || value === "on"}
          onCheckedChange={(checked) => onChange(checked ? "true" : "false")}
          disabled={field.disabled}
          className={cn(hasError && "border-red-500")}
        />
        <Label
          htmlFor={field.name}
          className="text-sm font-medium text-gray-300 cursor-pointer"
        >
          {field.label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </Label>
        {errorMessage && (
          <p className="text-red-400 text-xs ml-2">{errorMessage}</p>
        )}
      </div>
    );
  }

  // Render textarea field - supports drag-drop and JSON mode
  if (isTextareaField(field)) {
    const rows = (field.widget?.attrs as Record<string, unknown>)?.rows as number || 6;
    
    return (
      <div className="space-y-2">
        <Label htmlFor={field.name} className="text-sm font-medium text-gray-300">
          {field.label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </Label>
        <DroppableFormInput
          type="textarea"
          id={`form-field-${field.name}`}
          value={value}
          onChange={onChange}
          placeholder={`Enter ${field.label}`}
          rows={rows}
          error={errorMessage}
          className="bg-gray-800 border-gray-600 text-gray-200"
          jsonMode={isJsonMode(field)}
        />
        {field.help_text && (
          <p className="text-gray-400 text-xs">{field.help_text}</p>
        )}
      </div>
    );
  }

  // Render text input field - supports drag-drop
  return (
    <div className="space-y-2">
      <Label htmlFor={field.name} className="text-sm font-medium text-gray-300">
        {field.label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      <DroppableFormInput
        type={field.widget?.input_type || "text"}
        id={`form-field-${field.name}`}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${field.label}`}
        error={errorMessage}
        className="bg-gray-800 border-gray-600 text-gray-200"
      />
      {field.help_text && (
        <p className="text-gray-400 text-xs">{field.help_text}</p>
      )}
    </div>
  );
}
