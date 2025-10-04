import React from 'react';
import { WIDGET_DEFINITIONS, TWidgetType } from './inputs';
import WidgetButton from './components/WidgetButton';
import { Toggle } from '../ui/toggle';
import { Code, Palette } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface FieldsMenuBarProps {
  onAddWidget: (type: TWidgetType) => void;
  isJsonMode: boolean;
  onToggleMode: (isJsonMode: boolean) => void;
  disabled?: boolean;
}

const FieldsMenuBar: React.FC<FieldsMenuBarProps> = ({ onAddWidget, isJsonMode, onToggleMode, disabled }) => {
  return (
    <div className="p-3 bg-slate-800 border-b border-slate-700">
      <div className="flex items-center justify-between">
        {/* Toggle Button */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  type="button"
                  pressed={isJsonMode}
                  onPressedChange={onToggleMode}
                  className="border-slate-600 hover:border-blue-500 hover:bg-slate-700/50 data-[state=on]:bg-blue-600 data-[state=on]:border-blue-500"
                  disabled={disabled}
                >
                  {isJsonMode ? (
                    <Code className="w-4 h-4 text-slate-300" />
                  ) : (
                    <Palette className="w-4 h-4 text-slate-300" />
                  )}
                </Toggle>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{isJsonMode ? 'Switch to UI Builder' : 'Switch to JSON Editor'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="text-sm text-slate-400 font-medium">
            {isJsonMode ? 'JSON Editor' : 'UI Builder'}
          </span>
        </div>

        {/* Widget Buttons - Only show in UI mode */}
        {!isJsonMode && (
          <div className="flex items-center gap-1 flex-wrap">
            {WIDGET_DEFINITIONS.map((definition) => (
              <WidgetButton
                key={definition.type}
                widgetType={definition.type}
                definition={definition}
                onAddWidget={onAddWidget}
                disabled={disabled}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldsMenuBar;