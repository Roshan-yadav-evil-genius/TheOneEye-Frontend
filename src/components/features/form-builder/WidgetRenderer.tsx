import React from 'react';
import { TWidgetConfig } from '@/types/forms';
import { Card } from '@/components/ui/card';
import WidgetHeader from './components/WidgetHeader';
import WidgetConfiguration from './components/WidgetConfiguration';
import WidgetActions from './components/WidgetActions';
import FieldPreview from './components/FieldPreview';

interface WidgetRendererProps {
  widget: TWidgetConfig;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<TWidgetConfig>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  dragHandleProps?: Record<string, unknown>;
  disabled?: boolean;
  existingNames?: string[];
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  dragHandleProps,
  disabled,
  existingNames = [],
}) => {
  return (
    <Card
      className={`
        p-4 transition-all duration-200 cursor-pointer
        ${isSelected 
          ? 'ring-2 ring-blue-500 bg-slate-700/50' 
          : 'hover:bg-slate-800/50 border-slate-600'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={disabled ? undefined : onSelect}
    >
      <div className="space-y-3">
        {/* Widget Header */}
        <div className="flex items-center justify-between">
          <WidgetHeader widget={widget} dragHandleProps={dragHandleProps} />
          
          {isSelected && (
            <WidgetActions onDuplicate={onDuplicate} onDelete={onDelete} disabled={disabled} />
          )}
        </div>

        {/* Widget Configuration */}
        {isSelected && (
          <WidgetConfiguration widget={widget} onUpdate={onUpdate} disabled={disabled} existingNames={existingNames} />
        )}

        {/* Widget Preview */}
        <FieldPreview widget={widget} />
      </div>
    </Card>
  );
};

export default WidgetRenderer;
