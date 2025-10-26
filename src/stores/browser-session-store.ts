import { create } from 'zustand';
import { TBrowserSession, TBrowserSessionCreate, TBrowserSessionUpdate } from '@/types/browser-session';

interface BrowserSessionState {
  sessions: TBrowserSession[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadSessions: () => Promise<void>;
  createSession: (session: TBrowserSessionCreate) => Promise<TBrowserSession>;
  updateSession: (id: string, session: TBrowserSessionUpdate) => Promise<TBrowserSession>;
  deleteSession: (id: string) => Promise<void>;
  launchBrowser: (id: string) => Promise<void>;
}

const API_BASE = 'http://127.0.0.1:7878/api';

export const useBrowserSessionStore = create<BrowserSessionState>((set, get) => ({
  sessions: [],
  isLoading: false,
  error: null,

  loadSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/browser-sessions/`);
      if (!response.ok) {
        throw new Error('Failed to fetch browser sessions');
      }
      const sessions = await response.json();
      set({ sessions, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },

  createSession: async (sessionData: TBrowserSessionCreate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/browser-sessions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create browser session');
      }
      
      const newSession = await response.json();
      set(state => ({ 
        sessions: [newSession, ...state.sessions], 
        isLoading: false 
      }));
      return newSession;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
      throw error;
    }
  },

  updateSession: async (id: string, sessionData: TBrowserSessionUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/browser-sessions/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update browser session');
      }
      
      const updatedSession = await response.json();
      set(state => ({
        sessions: state.sessions.map(session => 
          session.id === id ? updatedSession : session
        ),
        isLoading: false
      }));
      return updatedSession;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
      throw error;
    }
  },

  deleteSession: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/browser-sessions/${id}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete browser session');
      }
      
      set(state => ({
        sessions: state.sessions.filter(session => session.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
      throw error;
    }
  },

  launchBrowser: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/browser-sessions/${id}/launch_browser/`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to launch browser');
      }
      
      const result = await response.json();
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
      throw error;
    }
  },
}));
