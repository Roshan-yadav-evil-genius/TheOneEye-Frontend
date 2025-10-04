import React from 'react';
import { WidgetConfig } from './inputs';
import CanvasHeader from './components/CanvasHeader';
import EmptyState from './components/EmptyState';
import WidgetsList from './components/WidgetsList';

interface BuilderCanvasProps {
  widgets: WidgetConfig[];
  selectedWidget: string | null;
  onSelectWidget: (id: string | null) => void;
  onUpdateWidget: (id: string, updates: Partial<WidgetConfig>) => void;
  onDeleteWidget: (id: string) => void;
  onDuplicateWidget: (id: string) => void;
}

const BuilderCanvas: React.FC<BuilderCanvasProps> = ({
  widgets,
  selectedWidget,
  onSelectWidget,
  onUpdateWidget,
  onDeleteWidget,
  onDuplicateWidget,
}) => {
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectWidget(null);
    }
  };

  const handlePreviewForm = () => {
    // TODO: Implement form preview functionality
    console.log('Preview form with widgets:', widgets);
  };

  return (
    <div
      onClick={handleCanvasClick}
      className="bg-slate-950 rounded p-6"
    >
      <div className="max-w-2xl mx-auto space-y-4">
        <CanvasHeader 
          widgetCount={widgets.length} 
          onPreviewForm={widgets.length > 0 ? handlePreviewForm : undefined}
        />

        {widgets.length === 0 ? (
          <EmptyState />
        ) : (
          <WidgetsList
            widgets={widgets}
            selectedWidget={selectedWidget}
            onSelectWidget={onSelectWidget}
            onUpdateWidget={onUpdateWidget}
            onDeleteWidget={onDeleteWidget}
            onDuplicateWidget={onDuplicateWidget}
          />
        )}
      </div>
    </div>
  );
};

export default BuilderCanvas;