"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IconForms, IconCheck, IconX } from "@tabler/icons-react";

interface FormConfigurationEditorProps {
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
  disabled?: boolean;
}

export function FormConfigurationEditor({ value, onChange, disabled = false }: FormConfigurationEditorProps) {
  const [jsonString, setJsonString] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize JSON string from value
  useEffect(() => {
    if (value && Object.keys(value).length > 0) {
      setJsonString(JSON.stringify(value, null, 2));
    } else {
      setJsonString("");
    }
  }, [value]);

  const handleJsonChange = (newValue: string) => {
    setJsonString(newValue);
    
    if (newValue.trim() === "") {
      setIsValid(true);
      setError(null);
      onChange({});
      return;
    }

    try {
      const parsed = JSON.parse(newValue);
      setIsValid(true);
      setError(null);
      onChange(parsed);
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const handleClear = () => {
    setJsonString("");
    setIsValid(true);
    setError(null);
    onChange({});
  };

  const handleFormat = () => {
    if (jsonString.trim() === "") return;
    
    try {
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonString(formatted);
      setIsValid(true);
      setError(null);
    } catch {
      // Don't format if invalid
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconForms className="h-5 w-5" />
          Form Configuration
        </CardTitle>
        <CardDescription>
          Define the form structure and validation rules for this node
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="form-config">JSON Configuration</Label>
          <Textarea
            id="form-config"
            value={jsonString}
            onChange={(e) => handleJsonChange(e.target.value)}
            placeholder='{"fields": [{"name": "input", "type": "text", "required": true}]}'
            rows={8}
            className={`font-mono text-sm ${!isValid ? "border-red-500" : ""}`}
            disabled={disabled}
          />
          {error && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <IconX className="h-4 w-4" />
              {error}
            </p>
          )}
          {isValid && jsonString.trim() !== "" && (
            <p className="text-sm text-green-500 flex items-center gap-1">
              <IconCheck className="h-4 w-4" />
              Valid JSON configuration
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleFormat}
            disabled={disabled || jsonString.trim() === ""}
          >
            Format JSON
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={disabled}
          >
            Clear
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Enter a valid JSON object to define form fields, validation rules, and other configuration options.</p>
          <p className="mt-1">
          </p>
        </div>
      </CardContent>
    </Card>
  );
}