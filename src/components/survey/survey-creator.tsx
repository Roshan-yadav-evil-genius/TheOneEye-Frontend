"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import "survey-creator-core/survey-creator-core.css";
import "survey-core/survey-core.css";

interface SurveyCreatorWrapperProps {
  initialJson?: any;
  onJsonChanged?: (json: any) => void;
  onSurveySaved?: (json: any) => void;
  readOnly?: boolean;
  showDesignerTab?: boolean;
  showTestSurveyTab?: boolean;
  showEmbededSurveyTab?: boolean;
  showJSONEditorTab?: boolean;
  showTranslationTab?: boolean;
  showLogicTab?: boolean;
  className?: string;
}

export function SurveyCreatorWrapper({
  initialJson,
  onJsonChanged,
  onSurveySaved,
  readOnly = false,
  showDesignerTab = true,
  showTestSurveyTab = true,
  showEmbededSurveyTab = false,
  showJSONEditorTab = true,
  showTranslationTab = false,
  showLogicTab = true,
  className = "",
}: SurveyCreatorWrapperProps) {
  const creatorRef = useRef<SurveyCreator | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const callbacksRef = useRef({ onJsonChanged, onSurveySaved });

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = { onJsonChanged, onSurveySaved };
  }, [onJsonChanged, onSurveySaved]);

  // Create the creator instance only once
  useEffect(() => {
    console.log('Creating SurveyCreator instance...');
    
    // Create SurveyCreator instance
    const creator = new SurveyCreator({
      showDesignerTab,
      showTestSurveyTab,
      showEmbededSurveyTab,
      showJSONEditorTab,
      showTranslationTab,
      showLogicTab,
      isAutoSave: true,
      readOnly,
    });

    // Set initial JSON if provided
    if (initialJson) {
      creator.JSON = initialJson;
    }

    // Set up event handlers
    creator.onSurveyInstanceCreated.add((sender, options) => {
      // You can customize the survey instance here if needed
    });

    creator.onModified.add((sender, options) => {
      const { onJsonChanged } = callbacksRef.current;
      if (onJsonChanged) {
        onJsonChanged(creator.JSON);
      }
    });

    // Track state changes to detect when survey is saved
    creator.onStateChanged.add((sender, options) => {
      const { onSurveySaved } = callbacksRef.current;
      if (options.newState === "saved" && onSurveySaved) {
        onSurveySaved(creator.JSON);
      }
    });

    creatorRef.current = creator;
    setIsLoaded(true);
    console.log('SurveyCreator instance created and loaded');

    // Cleanup function
    return () => {
      console.log('Disposing SurveyCreator instance...');
      if (creatorRef.current) {
        creatorRef.current.dispose();
        creatorRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once

  // Update JSON when initialJson prop changes
  useEffect(() => {
    if (creatorRef.current && initialJson !== undefined) {
      creatorRef.current.JSON = initialJson;
    }
  }, [initialJson]);

  if (!isLoaded || !creatorRef.current) {
    return (
      <div className={`survey-creator-container ${className}`}>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <p>Loading form creator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`survey-creator-container ${className}`}>
      {creatorRef.current && (
        <SurveyCreatorComponent 
          key="survey-creator" 
          creator={creatorRef.current} 
        />
      )}
    </div>
  );
}

export default SurveyCreatorWrapper;
