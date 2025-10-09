import React from 'react';
import { TWidgetConfig } from '@/types/forms';
import { GripVertical } from 'lucide-react';
import { 
  Type, 
  Mail, 
  Lock, 
  Hash, 
  AlignLeft, 
  ChevronDown, 
  CheckSquare, 
  Circle, 
  Calendar, 
  Upload 
} from 'lucide-react';

const iconMap = {
  Type,
  Mail,
  Lock,
  Hash,
  AlignLeft,
  ChevronDown,
  CheckSquare,
  Circle,
  Calendar,
  Upload,
};

interface WidgetHeaderProps {
  widget: TWidgetConfig;
  dragHandleProps?: Record<string, unknown>;
}

const WidgetHeader: React.FC<WidgetHeaderProps> = ({ widget, dragHandleProps }) => {
  const getWidgetIcon = () => {
    const definition = {
      text: 'Type',
      email: 'Mail',
      password: 'Lock',
      number: 'Hash',
      textarea: 'AlignLeft',
      select: 'ChevronDown',
      checkbox: 'CheckSquare',
      radio: 'Circle',
      date: 'Calendar',
      file: 'Upload',
    }[widget.type];

    const IconComponent = iconMap[definition as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-600 rounded"
        >
          <GripVertical className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          {getWidgetIcon()}
          <span className="text-sm font-medium">{widget.type}</span>
        </div>
      </div>
      {widget.name && (
        <div className="text-xs text-slate-500 font-mono bg-slate-800 px-2 py-1 rounded">
          {widget.name}
        </div>
      )}
    </div>
  );
};

export default WidgetHeader;
