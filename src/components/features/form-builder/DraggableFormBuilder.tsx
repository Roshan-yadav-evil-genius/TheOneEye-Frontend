"use client";
import React from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Card } from '../ui/card';
import { TWidgetConfig } from './inputs';

interface DraggableFormBuilderProps {
  widgets: TWidgetConfig[];
  onMoveWidget: (fromIndex: number, toIndex: number) => void;
  children: React.ReactNode;
}

const DraggableFormBuilder: React.FC<DraggableFormBuilderProps> = ({ 
  widgets, 
  onMoveWidget, 
  children 
}) => {
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
        onMoveWidget(activeIndex, overIndex);
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
        {children}
        
        <DragOverlay>
          {renderDragOverlay()}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default DraggableFormBuilder;
