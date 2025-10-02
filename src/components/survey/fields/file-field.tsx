"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormFieldProps } from "../types";

export function FileField({ field, value, onChange, error, disabled, className }: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onChange(file);
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
      
      <Input
        id={field.name}
        type="file"
        onChange={handleChange}
        disabled={disabled}
        required={field.isRequired}
        className={error ? "border-red-500" : ""}
      />
      
      {value && (
        <p className="text-sm text-muted-foreground">
          Selected: {value.name || value}
        </p>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
