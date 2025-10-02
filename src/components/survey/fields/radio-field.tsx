"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { FormFieldProps } from "../types";

export function RadioField({ field, value, onChange, error, disabled, className }: FormFieldProps) {
  const handleValueChange = (newValue: string) => {
    onChange(newValue);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium">
        {field.title}
        {field.isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      
      <div className="space-y-2">
        {field.choices?.map((choice) => (
          <div key={choice.value} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`${field.name}-${choice.value}`}
              name={field.name}
              value={choice.value}
              checked={value === choice.value}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={disabled}
              required={field.isRequired}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <Label htmlFor={`${field.name}-${choice.value}`} className="text-sm">
              {choice.text}
            </Label>
          </div>
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
