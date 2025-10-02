"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormFieldProps } from "../types";

export function TextField({ field, value, onChange, error, disabled, className }: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
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
        type={field.inputType || "text"}
        value={value || ""}
        onChange={handleChange}
        placeholder={field.placeholder}
        disabled={disabled}
        required={field.isRequired}
        min={field.min}
        max={field.max}
        step={field.step}
        minLength={field.minLength}
        maxLength={field.maxLength}
        pattern={field.pattern}
        className={error ? "border-red-500" : ""}
      />
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
