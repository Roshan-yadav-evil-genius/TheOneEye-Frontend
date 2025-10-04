import React from 'react';
import { Button } from '../../ui/button';
import { Copy, Trash2 } from 'lucide-react';

interface WidgetActionsProps {
  onDuplicate: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

const WidgetActions: React.FC<WidgetActionsProps> = ({ onDuplicate, onDelete, disabled }) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate();
        }}
        className="h-8 w-8 p-0 hover:bg-slate-600"
        disabled={disabled}
      >
        <Copy className="w-3 h-3" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="h-8 w-8 p-0 hover:bg-red-600/20 text-red-400"
        disabled={disabled}
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default WidgetActions;
