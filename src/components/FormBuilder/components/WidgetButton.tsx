import React from 'react';
import { WIDGET_DEFINITIONS, TWidgetType } from '../inputs';
import { Button } from '../../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
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

interface WidgetButtonProps {
  widgetType: TWidgetType;
  definition: typeof WIDGET_DEFINITIONS[0];
  onAddWidget: (type: TWidgetType) => void;
  disabled?: boolean;
}

const WidgetButton: React.FC<WidgetButtonProps> = ({ 
  widgetType, 
  definition,
  onAddWidget,
  disabled,
}) => {
  const IconComponent = iconMap[definition.icon as keyof typeof iconMap];

  const handleClick = () => {
    onAddWidget(widgetType);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            onClick={handleClick}
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 border-slate-600 hover:border-blue-500 hover:bg-slate-700/50 transition-all duration-200"
            disabled={disabled}
          >
            <IconComponent className="w-4 h-4 text-slate-300" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div className="text-center">
            <p className="font-medium">{definition.label}</p>
            <p className="text-xs text-slate-400">{definition.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WidgetButton;
