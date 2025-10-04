import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface CanvasHeaderProps {
  widgetCount: number;
  onPreviewForm?: () => void;
  disabled?: boolean;
}

const CanvasHeader: React.FC<CanvasHeaderProps> = ({ widgetCount, onPreviewForm, disabled }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-200">Form Builder</h2>
        <p className="text-sm text-slate-400">
          {widgetCount} field{widgetCount !== 1 ? 's' : ''} added
        </p>
      </div>
      
      {widgetCount > 0 && onPreviewForm && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPreviewForm}
          className="border-slate-600 text-slate-300 hover:bg-slate-800"
          disabled={disabled}
        >
          <FileText className="w-4 h-4 mr-2" />
          Preview Form
        </Button>
      )}
    </div>
  );
};

export default CanvasHeader;
