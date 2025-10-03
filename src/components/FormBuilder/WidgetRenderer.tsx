import React from 'react';
import { WidgetConfig } from './inputs';
import { Card } from '../ui/card';
import WidgetHeader from './components/WidgetHeader';
import WidgetConfiguration from './components/WidgetConfiguration';
import WidgetActions from './components/WidgetActions';
import FieldPreview from './components/FieldPreview';

interface WidgetRendererProps {
  widget: WidgetConfig;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<WidgetConfig>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  dragHandleProps?: any;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  dragHandleProps,
}) => {
  return (
    <Card
      className={`
        p-4 transition-all duration-200 cursor-pointer
        ${isSelected 
          ? 'ring-2 ring-blue-500 bg-slate-700/50' 
          : 'hover:bg-slate-800/50 border-slate-600'
        }
      `}
      onClick={onSelect}
    >
      <div className="space-y-3">
        {/* Widget Header */}
        <div className="flex items-center justify-between">
          <WidgetHeader widget={widget} dragHandleProps={dragHandleProps} />
          
          {isSelected && (
            <WidgetActions onDuplicate={onDuplicate} onDelete={onDelete} />
          )}
        </div>

        {/* Widget Configuration */}
        {isSelected && (
          <WidgetConfiguration widget={widget} onUpdate={onUpdate} />
        )}

        {/* Widget Preview */}
        <FieldPreview widget={widget} />
      </div>
    </Card>
  );
};

export default WidgetRenderer;
