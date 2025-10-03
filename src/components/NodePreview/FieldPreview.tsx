"use client";

import React, { useState } from "react";
import { WidgetConfig } from "@/components/FormBuilder/inputs";

interface FieldPreviewProps {
  widget: WidgetConfig;
}

export function FieldPreview({ widget }: FieldPreviewProps) {
  const [value, setValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [radioValue, setRadioValue] = useState("");
  switch (widget.type) {
    case 'text':
    case 'email':
    case 'password':
      return (
        <input
          type={widget.type}
          placeholder={widget.placeholder || `Enter ${widget.type}...`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full h-10 bg-background border border-input rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
        />
      );
    case 'number':
      return (
        <input
          type="number"
          placeholder={widget.placeholder || "Enter number..."}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full h-10 bg-background border border-input rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
        />
      );
    case 'textarea':
      return (
        <textarea
          placeholder={widget.placeholder || "Enter text..."}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 resize-none"
        />
      );
    case 'select':
      return (
        <div className="relative">
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="w-full h-10 bg-background border border-input rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 appearance-none"
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
      );
    case 'checkbox':
      return (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="w-4 h-4 text-primary bg-background border border-input rounded focus:ring-primary/20 focus:ring-2"
          />
          <span className="text-sm text-foreground">Checkbox option</span>
        </div>
      );
    case 'radio':
      return (
        <div className="space-y-2">
          {widget.options?.filter(option => option && option.trim() !== '').slice(0, 3).map((option: string, idx: number) => (
            <div key={idx} className="flex items-center gap-3">
              <input
                type="radio"
                name={`radio-${widget.id}`}
                value={option}
                checked={radioValue === option}
                onChange={(e) => setRadioValue(e.target.value)}
                className="w-4 h-4 text-primary bg-background border border-input focus:ring-primary/20 focus:ring-2"
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
      );
    case 'date':
      return (
        <input
          type="date"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full h-10 bg-background border border-input rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
        />
      );
    case 'file':
      return (
        <div className="w-full h-20 bg-background border-2 border-dashed border-input rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setValue(file.name);
              }
            }}
          />
          <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-sm">{value || "Choose file..."}</span>
        </div>
      );
    default:
      return (
        <input
          type="text"
          placeholder={`${widget.type} field`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full h-10 bg-background border border-input rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
        />
      );
  }
}
