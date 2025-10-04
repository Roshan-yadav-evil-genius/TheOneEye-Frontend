"use client";
import React from 'react';
import FieldsMenuBar from './FieldsMenuBar';
import JsonEditor from './JsonEditor';
import SortableBuilderCanvas from './SortableBuilderCanvas';
import DraggableFormBuilder from './DraggableFormBuilder';
import { useFormBuilder } from './useFormBuilder';
import { TWidgetConfig } from '@/types/forms';

interface FormBuilderProps {
  onFormChange?: (widgets: TWidgetConfig[]) => void;
  initialWidgets?: TWidgetConfig[];
  disabled?: boolean;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ onFormChange, initialWidgets = [], disabled }) => {
  const {
    widgets,
    selectedWidget,
    isJsonMode,
    addWidget,
    updateWidget,
    removeWidget,
    selectWidget,
    moveWidget,
    duplicateWidget,
    toggleJsonMode,
    updateWidgetsFromJson,
  } = useFormBuilder(initialWidgets, onFormChange);

  return (
    <DraggableFormBuilder
      widgets={widgets}
      onMoveWidget={moveWidget}
    >
      <FieldsMenuBar 
        onAddWidget={addWidget}
        isJsonMode={isJsonMode}
        onToggleMode={toggleJsonMode}
        disabled={disabled}
      />
      
      {isJsonMode ? (
        <JsonEditor
          widgets={widgets}
          onWidgetsChange={updateWidgetsFromJson}
          disabled={disabled}
        />
      ) : (
        <SortableBuilderCanvas
          widgets={widgets}
          selectedWidget={selectedWidget}
          onSelectWidget={selectWidget}
          onUpdateWidget={updateWidget}
          onDeleteWidget={removeWidget}
          onDuplicateWidget={duplicateWidget}
          disabled={disabled}
        />
      )}
    </DraggableFormBuilder>
  );
};

export default FormBuilder;