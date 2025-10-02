"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormFieldProps } from "../types";

export function CheckboxField({ field, value, onChange, error, disabled, className }: FormFieldProps) {
  const handleCheckedChange = (checked: boolean) => {
    onChange(checked);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={field.name}
          checked={value || false}
          onCheckedChange={handleCheckedChange}
          disabled={disabled}
          required={field.isRequired}
        />
        <Label htmlFor={field.name} className="text-sm font-medium">
          {field.title}
          {field.isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
      </div>
      
      {field.description && (
        <p className="text-sm text-muted-foreground ml-6">{field.description}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-500 ml-6">{error}</p>
      )}
    </div>
  );
}
