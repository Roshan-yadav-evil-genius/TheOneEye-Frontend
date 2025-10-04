"use client";
import React, { useState, useEffect, useRef } from 'react';
import { TWidgetConfig } from './inputs';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface JsonEditorProps {
  widgets: TWidgetConfig[];
  onWidgetsChange: (widgets: TWidgetConfig[]) => void;
  disabled?: boolean;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ widgets, onWidgetsChange, disabled }) => {
  const [jsonString, setJsonString] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Initialize JSON string when widgets change
  useEffect(() => {
    try {
      const json = JSON.stringify({ widgets }, null, 2);
      setJsonString(json);
      setError(null);
      setIsValid(true);
    } catch {
      setError('Failed to serialize widgets to JSON');
      setIsValid(false);
    }
  }, [widgets]);

  // Sync scroll between textarea and syntax highlighter
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

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
    } catch {
      setError('Failed to apply JSON changes');
    }
  };

  const handleReset = () => {
    try {
      const json = JSON.stringify({ widgets }, null, 2);
      setJsonString(json);
      setError(null);
      setIsValid(true);
    } catch {
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
              type="button"
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="border-slate-600 hover:border-blue-500"
              disabled={disabled}
            >
              Reset
            </Button>
            <Button
              type="button"
              onClick={handleApplyJson}
              disabled={!isValid || !!error || disabled}
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
          <div className="relative border border-slate-700 rounded-lg overflow-hidden">
            {/* Syntax highlighting background */}
            <div 
              ref={highlightRef}
              className="absolute inset-0 pointer-events-none overflow-auto"
              style={{ 
                background: '#0f172a',
                zIndex: 1,
                padding: '1rem',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word'
              }}
            >
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{
                  background: 'transparent',
                  margin: 0,
                  padding: 0,
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  lineHeight: 'inherit',
                }}
                showLineNumbers={false}
                wrapLines={true}
                wrapLongLines={true}
              >
                {jsonString || 'Enter your form configuration JSON here...'}
              </SyntaxHighlighter>
            </div>
            
            {/* Editable textarea */}
            <textarea
              ref={textareaRef}
              value={jsonString}
              onChange={(e) => handleJsonChange(e.target.value)}
              onScroll={handleScroll}
              className="relative w-full min-h-[400px] font-mono text-sm bg-transparent border-0 text-transparent caret-slate-200 placeholder:text-slate-500 focus:outline-none p-4 resize-none z-10"
              placeholder="Enter your form configuration JSON here..."
              spellCheck={false}
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word'
              }}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="text-xs text-slate-500 space-y-1">
          <p><strong>Structure:</strong> The JSON should contain a &quot;widgets&quot; array with widget objects.</p>
          <p><strong>Required fields:</strong> Each widget must have id, type, and label.</p>
          <p><strong>Example:</strong></p>
          <div className="bg-slate-900 p-2 rounded text-xs overflow-x-auto">
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              customStyle={{
                background: 'transparent',
                margin: 0,
                padding: 0,
                fontSize: '0.75rem',
                fontFamily: 'inherit',
              }}
              showLineNumbers={false}
            >
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
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonEditor;

