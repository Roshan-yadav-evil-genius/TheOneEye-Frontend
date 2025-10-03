"use client";
import React, { useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import BuilderCanvas from './BuilderCanvas';
import FieldsMenuBar from './FieldsMenuBar';
import JsonEditor from './JsonEditor';
import { useFormBuilder } from './useFormBuilder';
import { WidgetType, WidgetConfig } from './inputs';
import { Card } from '../ui/card';

interface FormBuilderProps {
  onFormChange?: (widgets: WidgetConfig[]) => void;
  initialWidgets?: WidgetConfig[];
}

const FormBuilder: React.FC<FormBuilderProps> = ({ onFormChange, initialWidgets = [] }) => {
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

  const [activeId, setActiveId] = React.useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Handle reordering widgets in canvas
    if (active.data.current?.type === 'canvas-widget' && over.data.current?.type === 'canvas-widget') {
      const activeIndex = active.data.current.index;
      const overIndex = over.data.current.index;
      
      if (activeIndex !== overIndex) {
        moveWidget(activeIndex, overIndex);
      }
    }
  };

  const renderDragOverlay = () => {
    if (!activeId) return null;

    // Render widget from canvas
    const widget = widgets.find(w => w.id === activeId);
    if (widget) {
      return (
        <Card className="p-4 border-2 border-blue-500 bg-slate-700 shadow-lg opacity-90">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-sm font-medium">{widget.label}</span>
          </div>
        </Card>
      );
    }

    return null;
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <FieldsMenuBar 
          onAddWidget={addWidget}
          isJsonMode={isJsonMode}
          onToggleMode={toggleJsonMode}
        />
        
        {isJsonMode ? (
          <JsonEditor
            widgets={widgets}
            onWidgetsChange={updateWidgetsFromJson}
          />
        ) : (
          <SortableContext items={widgets.map(w => w.id)} strategy={verticalListSortingStrategy}>
            <BuilderCanvas
              widgets={widgets}
              selectedWidget={selectedWidget}
              onSelectWidget={selectWidget}
              onUpdateWidget={updateWidget}
              onDeleteWidget={removeWidget}
              onDuplicateWidget={duplicateWidget}
              onMoveWidget={moveWidget}
            />
          </SortableContext>
        )}

        <DragOverlay>
          {renderDragOverlay()}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default FormBuilder;