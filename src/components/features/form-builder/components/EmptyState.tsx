import React from 'react';
import { Card } from '../../ui/card';
import { Plus } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <Card className="border-2 border-dashed border-slate-600 bg-slate-800/50">
      <div className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
          <Plus className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-200 mb-2">
          Start Building Your Form
        </h3>
        <p className="text-slate-400 mb-4">
          Click on the field buttons above to add form fields
        </p>
        <div className="text-sm text-slate-500">
          Available fields: Text, Email, Password, Number, Textarea, Select, Checkbox, Radio, Date, File
        </div>
      </div>
    </Card>
  );
};

export default EmptyState;
