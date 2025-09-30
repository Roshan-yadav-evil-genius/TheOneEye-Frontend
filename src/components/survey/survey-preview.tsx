"use client";

import React, { useRef, useEffect, useState } from "react";
import { Survey } from "survey-react-ui";
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
  const surveyRef = useRef<Survey>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (surveyRef.current && json) {
      const survey = surveyRef.current;
      
      // Set the survey JSON
      survey.fromJSON(json);
      
      // Set read-only mode
      if (readOnly) {
        survey.mode = "display";
      }

      // Set up event handlers
      if (onComplete) {
        survey.onComplete.add((sender, options) => {
          onComplete(sender.data);
        });
      }

      if (onValueChanged) {
        survey.onValueChanged.add((sender, options) => {
          onValueChanged(sender.data);
        });
      }

      setIsLoaded(true);
    }
  }, [json, onComplete, onValueChanged, readOnly]);

  if (!json || !isLoaded) {
    return (
      <div className={`survey-preview-container ${className}`}>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <p>No form configuration available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`survey-preview-container ${className}`}>
      <Survey ref={surveyRef} />
    </div>
  );
}

export default SurveyPreview;
