"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FormFieldProps } from "../types";

export function DropdownField({ field, value, onChange, error, disabled, className }: FormFieldProps) {
  const handleValueChange = (newValue: string) => {
    onChange(newValue);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={field.name} className="text-sm font-medium">
        {field.title}
        {field.isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      
      <Select
        value={value || ""}
        onValueChange={handleValueChange}
        disabled={disabled}
        required={field.isRequired}
      >
        <SelectTrigger className={error ? "border-red-500" : ""}>
          <SelectValue placeholder={field.placeholder || `Select ${field.title.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {field.choices?.map((choice) => (
            <SelectItem key={choice.value} value={choice.value}>
              {choice.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
