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
    </div>
  );
};

export default CanvasHeader;
