// Store debugging utilities
export const storeDebug = {
  // Log store state changes
  logStateChange: (storeName: string, prevState: unknown, nextState: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔄 ${storeName} State Change`);
      console.log('Previous:', prevState);
      console.log('Next:', nextState);
      console.log('Diff:', getStateDiff(prevState, nextState));
      console.groupEnd();
    }
  },

  // Log store actions
  logAction: (storeName: string, actionName: string, payload?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎯 ${storeName}.${actionName}`, payload || '');
    }
  },

  // Get state differences
  getStateDiff: (prevState: unknown, nextState: unknown) => {
    const diff: Record<string, unknown> = {};
    
    for (const key in nextState) {
      if (prevState[key] !== nextState[key]) {
        diff[key] = {
          from: prevState[key],
          to: nextState[key]
        };
      }
    }
    
    return diff;
  },

  // Performance monitoring
  measureAction: async (actionName: string, action: () => Promise<unknown>) => {
    const start = performance.now();
    try {
      const result = await action();
      const end = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${actionName} took ${(end - start).toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const end = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ ${actionName} failed after ${(end - start).toFixed(2)}ms:`, error);
      }
      
      throw error;
    }
  },

  // Store state inspector
  inspectStore: (storeName: string, store: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔍 ${storeName} Store Inspector`);
      console.log('Current State:', store.getState());
      console.log('Available Actions:', Object.keys(store.getState()).filter(key => typeof store.getState()[key] === 'function'));
      console.groupEnd();
    }
  }
};

// Helper function for state diff
function getStateDiff(prevState: unknown, nextState: unknown) {
  return storeDebug.getStateDiff(prevState, nextState);
}

// Store middleware for debugging
export const debugMiddleware = (storeName: string) => <T>(config: (set: (...args: unknown[]) => void, get: () => T, api: unknown) => T) => (set: (...args: unknown[]) => void, get: () => T, api: unknown) => {
  const store = config(
    (...args: unknown[]) => {
      const prevState = get();
      set(...args);
      const nextState = get();
      
      storeDebug.logStateChange(storeName, prevState, nextState);
    },
    get,
    api
  );

  // Add debugging methods to store
  if (process.env.NODE_ENV === 'development') {
    (store as Record<string, unknown>).__debug = {
      inspect: () => storeDebug.inspectStore(storeName, store),
      getState: () => get(),
      reset: () => set(store.getInitialState?.() || {}),
    };
  }

  return store;
};