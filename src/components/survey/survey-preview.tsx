"use client";

import React, { useMemo } from "react";
import { Survey } from "survey-react-ui";
import { Model } from "survey-core";
import "survey-core/survey-core.css";

interface SurveyPreviewProps {
  json: any;
  onComplete?: (results: any) => void;
  onValueChanged?: (results: any) => void;
  className?: string;
  readOnly?: boolean;
}

export function SurveyPreview({
  json,
  onComplete,
  onValueChanged,
  className = "",
  readOnly = false,
}: SurveyPreviewProps) {
  // Create survey model from JSON
  const surveyModel = useMemo(() => {
    if (!json || Object.keys(json).length === 0) {
      return null;
    }

    try {
      const model = new Model(json);
      
      // Set read-only mode
      if (readOnly) {
        model.mode = "display";
      }

      // Set up event handlers
      if (onComplete) {
        model.onComplete.add((sender, options) => {
          onComplete(sender.data);
        });
      }

      if (onValueChanged) {
        model.onValueChanged.add((sender, options) => {
          onValueChanged(sender.data);
        });
      }

      return model;
    } catch (error) {
      console.error('Error creating survey model:', error);
      return null;
    }
  }, [json, onComplete, onValueChanged, readOnly]);

  if (!surveyModel) {
    return (
      <div className={`survey-preview-container ${className}`}>
        <div className="flex items-center justify-center h-96 text-muted-foreground">
          <p>
            {!json || Object.keys(json).length === 0 
              ? "No form configuration available" 
              : "Invalid form configuration"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`survey-preview-container ${className}`} style={{ height: '100%' }}>
      <div style={{ height: '100%' }}>
        <Survey model={surveyModel} />
      </div>
    </div>
  );
}

export default SurveyPreview;
