"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ResizablePanelProps {
  children: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

interface ResizablePanelsProps {
  children: React.ReactNode[];
  defaultSizes?: number[];
  minSizes?: number[];
  maxSizes?: number[];
  className?: string;
}

export function ResizablePanel({ 
  children, 
  defaultSize = 33.33, 
  minSize = 20, 
  maxSize = 80,
  className = ""
}: ResizablePanelProps) {
  return (
    <div 
      className={`flex-shrink-0 ${className}`}
      style={{ width: `${defaultSize}%` }}
    >
      {children}
    </div>
  );
}

export function ResizablePanels({ 
  children, 
  defaultSizes = [33.33, 33.33, 33.34], 
  minSizes = [20, 20, 20],
  maxSizes = [80, 80, 80],
  className = ""
}: ResizablePanelsProps) {
  const [sizes, setSizes] = useState<number[]>(defaultSizes);
  const [isResizing, setIsResizing] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startSizesRef = useRef<number[]>([]);

  const handleMouseDown = useCallback((index: number, event: React.MouseEvent) => {
    event.preventDefault();
    setIsResizing(index);
    startXRef.current = event.clientX;
    startSizesRef.current = [...sizes];
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [sizes]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isResizing === null || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const deltaX = event.clientX - startXRef.current;
    const deltaPercent = (deltaX / containerWidth) * 100;

    const newSizes = [...startSizesRef.current];
    const leftPanelIndex = isResizing;
    const rightPanelIndex = isResizing + 1;

    // Calculate new sizes
    const newLeftSize = Math.max(
      minSizes[leftPanelIndex] || 20,
      Math.min(
        maxSizes[leftPanelIndex] || 80,
        newSizes[leftPanelIndex] + deltaPercent
      )
    );
    
    const newRightSize = Math.max(
      minSizes[rightPanelIndex] || 20,
      Math.min(
        maxSizes[rightPanelIndex] || 80,
        newSizes[rightPanelIndex] - deltaPercent
      )
    );

    // Update sizes
    newSizes[leftPanelIndex] = newLeftSize;
    newSizes[rightPanelIndex] = newRightSize;

    setSizes(newSizes);
  }, [isResizing, minSizes, maxSizes]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(null);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    if (isResizing !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className={`flex h-full ${className}`}>
      {children.map((child, index) => (
        <React.Fragment key={index}>
          <div 
            className="flex-shrink-0"
            style={{ width: `${sizes[index]}%` }}
          >
            {child}
          </div>
          {index < children.length - 1 && (
            <div
              className="w-1 bg-gray-700 hover:bg-gray-600 cursor-col-resize flex-shrink-0 relative group"
              onMouseDown={(e) => handleMouseDown(index, e)}
            >
              <div className="absolute inset-0 w-2 -ml-0.5" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-500 rounded opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
