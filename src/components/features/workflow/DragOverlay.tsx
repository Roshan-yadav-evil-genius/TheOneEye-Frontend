import React from 'react';

interface DragOverlayProps {
  isVisible: boolean;
}

const DragOverlay: React.FC<DragOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center pointer-events-none z-10">
      <div className="bg-background/90 backdrop-blur-sm border border-primary/20 rounded-lg px-6 py-4 shadow-lg">
        <div className="flex items-center gap-3 text-primary">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="font-medium">Drop node here to add to workflow</span>
        </div>
      </div>
    </div>
  );
};

export default DragOverlay;
