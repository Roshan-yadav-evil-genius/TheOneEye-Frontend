"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import "survey-creator-core/survey-creator-core.css";
import "survey-core/survey-core.css";

// Custom styles to ensure SurveyJS Creator takes full height
const customStyles = `
  .survey-creator-container .svc-creator {
    height: 100% !important;
  }
  .survey-creator-container .svc-creator .svc-creator__content {
    height: 100% !important;
  }
  .survey-creator-container .svc-creator .svc-creator__designer {
    height: 100% !important;
  }
  .survey-creator-container .svc-creator .svc-creator__designer .svc-designer {
    height: 100% !important;
  }
  .survey-creator-container .svc-creator .svc-creator__designer .svc-designer .svc-designer__content {
    height: 100% !important;
  }
`;

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

  // Create the creator instance
  useEffect(() => {
    console.log('Creating SurveyCreator instance...');
    
    try {
      // Inject custom styles
      const styleElement = document.createElement('style');
      styleElement.setAttribute('data-survey-creator-styles', 'true');
      styleElement.textContent = customStyles;
      document.head.appendChild(styleElement);
      
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
          // Use a small delay to prevent rapid-fire updates
          setTimeout(() => {
            if (creatorRef.current) {
              onJsonChanged(creatorRef.current.JSON);
            }
          }, 100);
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
    } catch (error) {
      console.error('Error creating SurveyCreator instance:', error);
      setIsLoaded(false);
    }

    // Cleanup function
    return () => {
      console.log('Disposing SurveyCreator instance...');
      if (creatorRef.current) {
        try {
          creatorRef.current.dispose();
        } catch (error) {
          console.error('Error disposing SurveyCreator instance:', error);
        }
        creatorRef.current = null;
      }
      // Remove custom styles
      const existingStyle = document.querySelector('style[data-survey-creator-styles]');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [
    showDesignerTab,
    showTestSurveyTab,
    showEmbededSurveyTab,
    showJSONEditorTab,
    showTranslationTab,
    showLogicTab,
    readOnly
  ]); // Don't include initialJson to prevent recreation on every change

  // Update JSON when initialJson prop changes (only if different)
  useEffect(() => {
    if (creatorRef.current && initialJson !== undefined) {
      const currentJson = creatorRef.current.JSON;
      // Only update if the JSON is actually different to prevent unnecessary re-renders
      if (JSON.stringify(currentJson) !== JSON.stringify(initialJson)) {
        creatorRef.current.JSON = initialJson;
      }
    }
  }, [initialJson]);

  if (!isLoaded || !creatorRef.current) {
    return (
      <div className={`survey-creator-container ${className}`}>
        <div className="flex items-center justify-center h-96 text-muted-foreground">
          <p>Loading form creator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`survey-creator-container ${className}`} style={{ height: '100%' }}>
      {creatorRef.current && (
        <div style={{ height: '100%' }}>
          <SurveyCreatorComponent 
            key={`survey-creator-${isLoaded}`} 
            creator={creatorRef.current}
          />
        </div>
      )}
    </div>
  );
}

export default SurveyCreatorWrapper;
