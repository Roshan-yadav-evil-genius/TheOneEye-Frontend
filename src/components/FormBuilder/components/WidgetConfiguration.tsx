import React, { useState } from 'react';
import { WidgetConfig } from '../inputs';
import { Input } from '../../ui/input';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Plus, X } from 'lucide-react';

interface WidgetConfigurationProps {
  widget: WidgetConfig;
  onUpdate: (updates: Partial<WidgetConfig>) => void;
}

const WidgetConfiguration: React.FC<WidgetConfigurationProps> = ({ widget, onUpdate }) => {
  const [newOption, setNewOption] = useState('');

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ label: e.target.value });
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

  return (
    <div className="space-y-3 pt-2 border-t border-slate-600">
      <div>
        <Label className="text-xs text-slate-400 mb-1 block">Label</Label>
        <Input
          value={widget.label}
          onChange={handleLabelChange}
          className="bg-slate-700 border-slate-600 text-sm"
          placeholder="Field label"
        />
      </div>
      
      {widget.placeholder !== undefined && (
        <div>
          <Label className="text-xs text-slate-400 mb-1 block">Placeholder</Label>
          <Input
            value={widget.placeholder || ''}
            onChange={handlePlaceholderChange}
            className="bg-slate-700 border-slate-600 text-sm"
            placeholder="Placeholder text"
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id={`required-${widget.id}`}
          checked={widget.required || false}
          onCheckedChange={handleRequiredChange}
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
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveOption(index)}
                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
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
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddOption}
                disabled={!newOption.trim()}
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
