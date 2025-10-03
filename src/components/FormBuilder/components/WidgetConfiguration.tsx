import React from 'react';
import { WidgetConfig } from '../inputs';
import { Input } from '../../ui/input';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';

interface WidgetConfigurationProps {
  widget: WidgetConfig;
  onUpdate: (updates: Partial<WidgetConfig>) => void;
}

const WidgetConfiguration: React.FC<WidgetConfigurationProps> = ({ widget, onUpdate }) => {
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ label: e.target.value });
  };

  const handleRequiredChange = (checked: boolean) => {
    onUpdate({ required: checked });
  };

  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ placeholder: e.target.value });
  };

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
    </div>
  );
};

export default WidgetConfiguration;
