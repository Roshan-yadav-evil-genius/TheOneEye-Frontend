import React from 'react';
import { FormBuilder } from '../../components/FormBuilder';

const FormBuilderPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-200 mb-2">Form Builder</h1>
          <p className="text-slate-400">
            Create dynamic forms by dragging and dropping form fields. 
            Customize each field and arrange them as needed.
          </p>
        </div>
        
        <FormBuilder />
      </div>
    </div>
  );
};

export default FormBuilderPage;
