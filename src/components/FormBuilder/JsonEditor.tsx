import React, { useState, useEffect } from 'react';
import { WidgetConfig } from './inputs';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface JsonEditorProps {
  widgets: WidgetConfig[];
  onWidgetsChange: (widgets: WidgetConfig[]) => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ widgets, onWidgetsChange }) => {
  const [jsonString, setJsonString] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);

  // Initialize JSON string when widgets change
  useEffect(() => {
    try {
      const json = JSON.stringify({ widgets }, null, 2);
      setJsonString(json);
      setError(null);
      setIsValid(true);
    } catch (err) {
      setError('Failed to serialize widgets to JSON');
      setIsValid(false);
    }
  }, [widgets]);

  const handleJsonChange = (value: string) => {
    setJsonString(value);
    
    try {
      const parsed = JSON.parse(value);
      
      // Validate the structure
      if (!parsed.widgets || !Array.isArray(parsed.widgets)) {
        throw new Error('JSON must contain a "widgets" array');
      }

      // Validate each widget
      for (const widget of parsed.widgets) {
        if (!widget.id || !widget.type || !widget.label) {
          throw new Error('Each widget must have id, type, and label');
        }
      }

      setError(null);
      setIsValid(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
      setIsValid(false);
    }
  };

  const handleApplyJson = () => {
    if (!isValid || error) return;

    try {
      const parsed = JSON.parse(jsonString);
      onWidgetsChange(parsed.widgets);
    } catch (err) {
      setError('Failed to apply JSON changes');
    }
  };

  const handleReset = () => {
    try {
      const json = JSON.stringify({ widgets }, null, 2);
      setJsonString(json);
      setError(null);
      setIsValid(true);
    } catch (err) {
      setError('Failed to reset JSON');
    }
  };

  return (
    <div className="p-6 bg-slate-950 rounded">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-200">JSON Editor</h3>
          <div className="flex gap-2">
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="border-slate-600 hover:border-blue-500"
            >
              Reset
            </Button>
            <Button
              onClick={handleApplyJson}
              disabled={!isValid || !!error}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Apply Changes
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="border-red-500 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {isValid && !error && (
          <Alert className="border-green-500 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-400">
              JSON is valid and ready to apply
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">
            Form Configuration JSON
          </label>
          <Textarea
            value={jsonString}
            onChange={(e) => handleJsonChange(e.target.value)}
            className="min-h-[400px] font-mono text-sm bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
            placeholder="Enter your form configuration JSON here..."
          />
        </div>

        <div className="text-xs text-slate-500 space-y-1">
          <p><strong>Structure:</strong> The JSON should contain a "widgets" array with widget objects.</p>
          <p><strong>Required fields:</strong> Each widget must have id, type, and label.</p>
          <p><strong>Example:</strong></p>
          <pre className="bg-slate-900 p-2 rounded text-xs overflow-x-auto">
{`{
  "widgets": [
    {
      "id": "widget_123",
      "type": "text",
      "label": "Full Name",
      "placeholder": "Enter your name",
      "required": true
    }
  ]
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default JsonEditor;

