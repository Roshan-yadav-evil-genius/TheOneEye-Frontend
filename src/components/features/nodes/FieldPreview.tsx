"use client";

import React, { useState } from "react";
import { TWidgetConfig } from "@/components/features/form-builder/inputs";

interface FieldPreviewProps {
  widget: TWidgetConfig;
  value?: string | boolean | number;
  onChange?: (value: string | boolean | number) => void;
  error?: string;
}

export function FieldPreview({ widget, value, onChange, error }: FieldPreviewProps) {
  // Use controlled values if provided, otherwise fall back to local state
  const [localValue, setLocalValue] = useState("");
  const [localSelectedOption, setLocalSelectedOption] = useState("");
  const [localIsChecked, setLocalIsChecked] = useState(false);
  const [localRadioValue, setLocalRadioValue] = useState("");

  // Use controlled values if provided, otherwise use local state
  const currentValue = value !== undefined ? String(value) : localValue;
  const currentSelectedOption = value !== undefined ? String(value) : localSelectedOption;
  const currentIsChecked = value !== undefined ? Boolean(value) : localIsChecked;
  const currentRadioValue = value !== undefined ? String(value) : localRadioValue;

  const handleValueChange = (newValue: string | boolean | number) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setLocalValue(String(newValue));
    }
  };

  const handleSelectChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setLocalSelectedOption(newValue);
    }
  };

  const handleCheckboxChange = (newValue: boolean) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setLocalIsChecked(newValue);
    }
  };

  const handleRadioChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setLocalRadioValue(newValue);
    }
  };

  // Helper function to get error styling
  const getErrorStyling = (baseClasses: string) => {
    if (error) {
      return baseClasses.replace('border-input', 'border-red-500').replace('focus:border-primary/50', 'focus:border-red-500');
    }
    return baseClasses;
  };
  switch (widget.type) {
    case 'text':
    case 'email':
    case 'password':
      return (
        <div>
          <input
            type={widget.type}
            placeholder={widget.placeholder || `Enter ${widget.type}...`}
            value={currentValue}
            onChange={(e) => handleValueChange(e.target.value)}
            className={getErrorStyling("w-full h-10 bg-background border border-input rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50")}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
        </div>
      );
    case 'number':
      return (
        <div>
          <input
            type="number"
            placeholder={widget.placeholder || "Enter number..."}
            value={currentValue}
            onChange={(e) => handleValueChange(e.target.value)}
            className={getErrorStyling("w-full h-10 bg-background border border-input rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50")}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
        </div>
      );
    case 'textarea':
      return (
        <div>
          <textarea
            placeholder={widget.placeholder || "Enter text..."}
            value={currentValue}
            onChange={(e) => handleValueChange(e.target.value)}
            rows={3}
            className={getErrorStyling("w-full bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 resize-none")}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
        </div>
      );
    case 'select':
      return (
        <div>
          <div className="relative">
            <select
              value={currentSelectedOption}
              onChange={(e) => handleSelectChange(e.target.value)}
              className={getErrorStyling("w-full h-10 bg-background border border-input rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 appearance-none")}
            >
              <option value="">{widget.placeholder || "Select an option..."}</option>
              {widget.options?.filter(option => option && option.trim() !== '').slice(0, 3).map((option: string, idx: number) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
        </div>
      );
    case 'checkbox':
      return (
        <div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={currentIsChecked}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
              className={getErrorStyling("w-4 h-4 text-primary bg-background border border-input rounded focus:ring-primary/20 focus:ring-2")}
            />
            <span className="text-sm text-foreground">Checkbox option</span>
          </div>
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
        </div>
      );
    case 'radio':
      return (
        <div>
          <div className="space-y-2">
            {widget.options?.filter(option => option && option.trim() !== '').slice(0, 3).map((option: string, idx: number) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="radio"
                  name={`radio-${widget.id}`}
                  value={option}
                  checked={currentRadioValue === option}
                  onChange={(e) => handleRadioChange(e.target.value)}
                  className={getErrorStyling("w-4 h-4 text-primary bg-background border border-input focus:ring-primary/20 focus:ring-2")}
                />
                <span className="text-sm text-foreground">{option}</span>
              </div>
            ))}
            {widget.options && widget.options.length > 3 && (
              <div className="text-xs text-muted-foreground ml-7">
                +{widget.options.length - 3} more options
              </div>
            )}
          </div>
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
        </div>
      );
    case 'date':
      return (
        <div>
          <input
            type="date"
            value={currentValue}
            onChange={(e) => handleValueChange(e.target.value)}
            className={getErrorStyling("w-full h-10 bg-background border border-input rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50")}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
        </div>
      );
    case 'file':
      return (
        <div>
          <div className={`w-full h-20 bg-background border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer ${error ? 'border-red-500' : 'border-input'}`}>
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleValueChange(file.name);
                }
              }}
            />
            <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm">{currentValue || "Choose file..."}</span>
          </div>
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
        </div>
      );
    default:
      return (
        <div>
          <input
            type="text"
            placeholder={`${widget.type} field`}
            value={currentValue}
            onChange={(e) => handleValueChange(e.target.value)}
            className={getErrorStyling("w-full h-10 bg-background border border-input rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50")}
          />
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
        </div>
      );
  }
}
