import { create } from 'zustand';
import { TBrowserSession, TBrowserSessionCreate, TBrowserSessionUpdate } from '@/types/browser-session';
import { axiosApiClient } from '@/lib/api/axios-client';

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

export const useBrowserSessionStore = create<BrowserSessionState>((set, get) => ({
  sessions: [],
  isLoading: false,
  error: null,

  loadSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const sessions = await axiosApiClient.get<TBrowserSession[]>('/browser-sessions/');
      set({ sessions, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },

  createSession: async (sessionData: TBrowserSessionCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newSession = await axiosApiClient.post<TBrowserSession>('/browser-sessions/', sessionData);
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
      const updatedSession = await axiosApiClient.patch<TBrowserSession>(`/browser-sessions/${id}/`, sessionData);
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
      await axiosApiClient.delete(`/browser-sessions/${id}/`);
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
      await axiosApiClient.post(`/browser-sessions/${id}/launch_browser/`);
      set({ isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
      throw error;
    }
  },
}));

