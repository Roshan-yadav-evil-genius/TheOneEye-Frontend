import React from 'react';

// Performance monitoring utilities
export const performanceMonitor = {
  // Measure component render time
  measureRender: (componentName: string) => {
    if (process.env.NODE_ENV === 'development') {
      const start = performance.now();
      
      return () => {
        const end = performance.now();
        const renderTime = end - start;
        
        if (renderTime > 16) { // More than one frame (16ms)
          console.warn(`🐌 ${componentName} took ${renderTime.toFixed(2)}ms to render`);
        } else {
          console.log(`⚡ ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
        }
      };
    }
    
    return () => {}; // No-op in production
  },

  // Measure async operations
  measureAsync: async <T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    
    try {
      const result = await operation();
      const end = performance.now();
      const duration = end - start;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${operationName} completed in ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const end = performance.now();
      const duration = end - start;
      
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ ${operationName} failed after ${duration.toFixed(2)}ms:`, error);
      }
      
      throw error;
    }
  },

  // Measure store operations
  measureStoreOperation: (storeName: string, operationName: string) => {
    if (process.env.NODE_ENV === 'development') {
      const start = performance.now();
      
      return () => {
        const end = performance.now();
        const duration = end - start;
        
        console.log(`🏪 ${storeName}.${operationName} took ${duration.toFixed(2)}ms`);
      };
    }
    
    return () => {}; // No-op in production
  },

  // Memory usage monitoring
  logMemoryUsage: (label: string) => {
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const memory = (performance as any).memory;
      console.log(`🧠 ${label} Memory Usage:`, {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
      });
    }
  },

  // Bundle size monitoring
  logBundleSize: () => {
    if (process.env.NODE_ENV === 'development') {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      
      console.log('📦 Bundle Analysis:', {
        scripts: scripts.length,
        stylesheets: stylesheets.length,
        totalResources: scripts.length + stylesheets.length,
      });
    }
  },
};

// React hook for performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const measureRender = performanceMonitor.measureRender(componentName);
  
  return {
    measureRender,
    measureAsync: performanceMonitor.measureAsync,
    logMemoryUsage: performanceMonitor.logMemoryUsage,
  };
};

// Higher-order component for performance monitoring
export const withPerformanceMonitor = <P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) => {
  const WrappedComponent = (props: P) => {
    const name = componentName || Component.displayName || Component.name || 'Unknown';
    const measureRender = performanceMonitor.measureRender(name);
    
    React.useEffect(measureRender);
    
    return React.createElement(Component, props);
  };
  
  WrappedComponent.displayName = `withPerformanceMonitor(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};
