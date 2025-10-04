import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import BuilderCanvas from './BuilderCanvas';
import { TWidgetConfig } from '@/types/forms';

interface SortableBuilderCanvasProps {
  widgets: TWidgetConfig[];
  selectedWidget: string | null;
  onSelectWidget: (id: string | null) => void;
  onUpdateWidget: (id: string, updates: Partial<TWidgetConfig>) => void;
  onDeleteWidget: (id: string) => void;
  onDuplicateWidget: (id: string) => void;
  disabled?: boolean;
}

const SortableBuilderCanvas: React.FC<SortableBuilderCanvasProps> = (props) => {
  return (
    <SortableContext items={props.widgets.map(w => w.id)} strategy={verticalListSortingStrategy}>
      <BuilderCanvas {...props} />
    </SortableContext>
  );
};

export default SortableBuilderCanvas;
