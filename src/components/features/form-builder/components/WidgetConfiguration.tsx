"use client";
import React, { useState } from 'react';
import { TWidgetConfig } from '@/types/forms';
import { Plus, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface WidgetConfigurationProps {
  widget: TWidgetConfig;
  onUpdate: (updates: Partial<TWidgetConfig>) => void;
  disabled?: boolean;
  existingNames?: string[];
}

const WidgetConfiguration: React.FC<WidgetConfigurationProps> = ({ widget, onUpdate, disabled, existingNames = [] }) => {
  const [newOption, setNewOption] = useState('');

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ label: e.target.value });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow lowercase letters and digits
    if (/^[a-z0-9]*$/.test(value)) {
      onUpdate({ name: value });
    }
  };

  const handleRequiredChange = (checked: boolean) => {
    onUpdate({ required: checked });
  };

  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ placeholder: e.target.value });
  };

  const handleAddOption = () => {
    if (newOption.trim() && widget.options) {
      const updatedOptions = [...widget.options, newOption.trim()];
      onUpdate({ options: updatedOptions });
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    if (widget.options) {
      const updatedOptions = widget.options.filter((_, i) => i !== index);
      onUpdate({ options: updatedOptions });
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    if (widget.options) {
      const updatedOptions = [...widget.options];
      updatedOptions[index] = value;
      onUpdate({ options: updatedOptions });
    }
  };

  const needsOptions = ['select', 'radio', 'checkbox'].includes(widget.type);
  
  // Check for duplicate names
  const isDuplicate = existingNames.filter(n => n !== widget.name).includes(widget.name || '');
  
  // Check for missing required fields
  const isNameEmpty = !widget.name || widget.name.trim() === '';
  const isLabelEmpty = !widget.label || widget.label.trim() === '';

  return (
    <div className="space-y-3 pt-2 border-t border-slate-600">
      <div>
        <Label className="text-xs text-slate-400 mb-1 block">Label *</Label>
        <Input
          value={widget.label || ''}
          onChange={handleLabelChange}
          className={`bg-slate-700 text-sm ${
            isLabelEmpty ? 'border-red-500' : 'border-slate-600'
          }`}
          placeholder="Field label"
          disabled={disabled}
        />
        {isLabelEmpty && (
          <p className="text-xs text-red-400 mt-1">
            Label is required
          </p>
        )}
      </div>
      
      <div>
        <Label className="text-xs text-slate-400 mb-1 block">Field Name *</Label>
        <Input
          value={widget.name || ''}
          onChange={handleNameChange}
          className={`bg-slate-700 text-sm font-mono ${
            isNameEmpty ? 'border-red-500' : 'border-slate-600'
          }`}
          placeholder="e.g., user_email"
          disabled={disabled}
        />
        <p className="text-xs text-slate-500 mt-1">
          Only lowercase letters (a-z) and digits (0-9) allowed. Used to reference this field.
        </p>
        {isNameEmpty && (
          <p className="text-xs text-red-400 mt-1">
            Field name is required
          </p>
        )}
        {isDuplicate && (
          <p className="text-xs text-red-400 mt-1">
            This name is already used by another field
          </p>
        )}
      </div>
      
      {widget.placeholder !== undefined && (
        <div>
          <Label className="text-xs text-slate-400 mb-1 block">Placeholder</Label>
          <Input
            value={widget.placeholder || ''}
            onChange={handlePlaceholderChange}
            className="bg-slate-700 border-slate-600 text-sm"
            placeholder="Placeholder text"
            disabled={disabled}
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id={`required-${widget.id}`}
          checked={widget.required || false}
          onCheckedChange={handleRequiredChange}
          disabled={disabled}
        />
        <Label htmlFor={`required-${widget.id}`} className="text-xs text-slate-400">
          Required field
        </Label>
      </div>

      {/* Options Management */}
      {needsOptions && (
        <div>
          <Label className="text-xs text-slate-400 mb-2 block">Options</Label>
          <div className="space-y-2">
            {widget.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="bg-slate-700 border-slate-600 text-sm flex-1"
                  placeholder="Option text"
                  disabled={disabled}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveOption(index)}
                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <div className="flex items-center gap-2">
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                className="bg-slate-700 border-slate-600 text-sm flex-1"
                placeholder="Add new option..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddOption();
                  }
                }}
                disabled={disabled}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddOption}
                disabled={!newOption.trim() || disabled}
                className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-900/20"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WidgetConfiguration;
