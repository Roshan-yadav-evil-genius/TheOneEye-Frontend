import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TWidgetConfig } from '@/types/forms';
import WidgetRenderer from '../WidgetRenderer';

interface WidgetsListProps {
  widgets: TWidgetConfig[];
  selectedWidget: string | null;
  onSelectWidget: (id: string) => void;
  onUpdateWidget: (id: string, updates: Partial<TWidgetConfig>) => void;
  onDeleteWidget: (id: string) => void;
  onDuplicateWidget: (id: string) => void;
  disabled?: boolean;
}

interface SortableWidgetProps {
  widget: TWidgetConfig;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<TWidgetConfig>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  disabled?: boolean;
}

const SortableWidget: React.FC<SortableWidgetProps> = ({
  widget,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  disabled,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: widget.id,
    data: {
      type: 'canvas-widget',
      widget,
      index,
    },
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <WidgetRenderer
        widget={widget}
        isSelected={isSelected}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        dragHandleProps={listeners}
        disabled={disabled}
      />
    </div>
  );
};

const WidgetsList: React.FC<WidgetsListProps> = ({
  widgets,
  selectedWidget,
  onSelectWidget,
  onUpdateWidget,
  onDeleteWidget,
  onDuplicateWidget,
  disabled,
}) => {
  return (
    <div className="space-y-4">
      {widgets.map((widget, index) => (
        <SortableWidget
          key={widget.id}
          widget={widget}
          index={index}
          isSelected={selectedWidget === widget.id}
          onSelect={() => onSelectWidget(widget.id)}
          onUpdate={(updates) => onUpdateWidget(widget.id, updates)}
          onDelete={() => onDeleteWidget(widget.id)}
          onDuplicate={() => onDuplicateWidget(widget.id)}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default WidgetsList;
