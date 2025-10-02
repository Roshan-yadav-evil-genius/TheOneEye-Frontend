"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormFieldProps } from "../types";

export function TextareaField({ field, value, onChange, error, disabled, className }: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      
      <Textarea
        id={field.name}
        value={value || ""}
        onChange={handleChange}
        placeholder={field.placeholder}
        disabled={disabled}
        required={field.isRequired}
        minLength={field.minLength}
        maxLength={field.maxLength}
        rows={field.rows || 4}
        className={error ? "border-red-500" : ""}
      />
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
