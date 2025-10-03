import React from 'react';
import { WIDGET_DEFINITIONS, WidgetType } from './inputs';
import WidgetButton from './components/WidgetButton';

interface FieldsMenuBarProps {
  onAddWidget: (type: WidgetType) => void;
}

const FieldsMenuBar: React.FC<FieldsMenuBarProps> = ({ onAddWidget }) => {
  return (
    <div className="p-3 bg-slate-800 border-b border-slate-700">
      <div className="flex items-center gap-1 flex-wrap justify-center">
        {WIDGET_DEFINITIONS.map((definition) => (
          <WidgetButton
            key={definition.type}
            widgetType={definition.type}
            definition={definition}
            onAddWidget={onAddWidget}
          />
        ))}
      </div>
    </div>
  );
};

export default FieldsMenuBar;