import React from 'react';
import { WidgetConfig } from '../inputs';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { Upload } from 'lucide-react';

interface FieldPreviewProps {
  widget: WidgetConfig;
}

const FieldPreview: React.FC<FieldPreviewProps> = ({ widget }) => {
  const renderField = () => {
    const commonProps = {
      placeholder: widget.placeholder,
      disabled: true, // Disabled in builder mode
    };

    switch (widget.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <Input
            type={widget.type}
            {...commonProps}
            className="bg-slate-700 border-slate-600"
          />
        );

      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            className="bg-slate-700 border-slate-600"
            rows={3}
          />
        );

      case 'select':
        return (
          <Select disabled>
            <SelectTrigger className="bg-slate-700 border-slate-600">
              <SelectValue placeholder={widget.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {widget.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox disabled />
            <Label className="text-slate-300">Checkbox option</Label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {widget.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  disabled
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600"
                />
                <Label className="text-slate-300">{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'date':
        return (
          <Input
            type="date"
            {...commonProps}
            className="bg-slate-700 border-slate-600"
          />
        );

      case 'file':
        return (
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">Click to upload or drag and drop</p>
          </div>
        );

      default:
        return <div className="text-slate-400">Unknown field type</div>;
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm text-slate-200">
        {widget.label}
        {widget.required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      {renderField()}
    </div>
  );
};

export default FieldPreview;
