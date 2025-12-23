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

export function NodeFormField({
  field,
  value,
  onChange,
  isLoading = false,
}: NodeFormFieldProps) {
  const hasError = field.errors && field.errors.length > 0;
  const errorMessage = hasError ? field.errors![0] : undefined;

  // Render select field
  if (field.tag === "select") {
    return (
      <div className="space-y-2">
        <Label htmlFor={field.name} className="text-sm font-medium text-gray-300">
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
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
            <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            {/* Clear/placeholder option */}
            <SelectItem
              value="__clear__"
              className="text-gray-400 focus:bg-gray-700"
            >
              {field.options?.find(o => o.value === "")?.text || `Select ${field.label}`}
            </SelectItem>
            {/* Actual options */}
            {field.options
              ?.filter((option) => option.value !== "")
              .map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-gray-200 focus:bg-gray-700"
                >
                  {option.text}
                </SelectItem>
              ))}
            {(!field.options || field.options.filter(o => o.value !== "").length === 0) && (
              <div className="px-2 py-1.5 text-sm text-gray-400">
                {isLoading ? "Loading options..." : "No options available"}
              </div>
            )}
          </SelectContent>
        </Select>
        {errorMessage && (
          <p className="text-red-400 text-xs">{errorMessage}</p>
        )}
      </div>
    );
  }

  // Render checkbox field
  if (field.tag === "input" && field.type === "checkbox") {
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
          {field.required && <span className="text-red-400 ml-1">*</span>}
        </Label>
        {errorMessage && (
          <p className="text-red-400 text-xs ml-2">{errorMessage}</p>
        )}
      </div>
    );
  }

  // Render textarea field - supports drag-drop and JSON mode
  if (field.tag === "textarea") {
    return (
      <div className="space-y-2">
        <Label htmlFor={field.name} className="text-sm font-medium text-gray-300">
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
        </Label>
        <DroppableFormInput
          type="textarea"
          id={`form-field-${field.name}`}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder || `Enter ${field.label}`}
          rows={6}
          error={errorMessage}
          className="bg-gray-800 border-gray-600 text-gray-200"
          jsonMode={field.json_mode || false}
        />
      </div>
    );
  }

  // Render text input field - supports drag-drop
  return (
    <div className="space-y-2">
      <Label htmlFor={field.name} className="text-sm font-medium text-gray-300">
        {field.label}
        {field.required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      <DroppableFormInput
        type="text"
        id={`form-field-${field.name}`}
        value={value}
        onChange={onChange}
        placeholder={field.placeholder || `Enter ${field.label}`}
        error={errorMessage}
        className="bg-gray-800 border-gray-600 text-gray-200"
      />
    </div>
  );
}

