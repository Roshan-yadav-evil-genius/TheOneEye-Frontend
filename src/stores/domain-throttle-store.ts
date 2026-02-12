import { create } from 'zustand';
import {
  TDomainThrottleRule,
  TDomainThrottleRuleCreate,
  TDomainThrottleRuleUpdate,
} from '@/types/browser-session';
import { axiosApiClient } from '@/lib/api/axios-client';

interface DomainThrottleState {
  rules: TDomainThrottleRule[];
  isLoading: boolean;
  error: string | null;

  listRules: (sessionId: string) => Promise<TDomainThrottleRule[]>;
  createRule: (
    sessionId: string,
    data: TDomainThrottleRuleCreate
  ) => Promise<TDomainThrottleRule>;
  updateRule: (
    sessionId: string,
    id: string,
    data: TDomainThrottleRuleUpdate
  ) => Promise<TDomainThrottleRule>;
  deleteRule: (sessionId: string, id: string) => Promise<void>;
  reset: () => void;
}

export const useDomainThrottleStore = create<DomainThrottleState>((set, get) => ({
  rules: [],
  isLoading: false,
  error: null,

  listRules: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const rules = await axiosApiClient.get<TDomainThrottleRule[]>(
        `/browser-sessions/${sessionId}/domain-throttle-rules/`
      );
      set({ rules, isLoading: false });
      return rules;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createRule: async (sessionId: string, data: TDomainThrottleRuleCreate) => {
    set({ isLoading: true, error: null });
    try {
      const rule = await axiosApiClient.post<TDomainThrottleRule>(
        `/browser-sessions/${sessionId}/domain-throttle-rules/`,
        data
      );
      set(state => ({
        rules: [...state.rules, rule],
        isLoading: false,
      }));
      return rule;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
      throw error;
    }
  },

  updateRule: async (
    sessionId: string,
    id: string,
    data: TDomainThrottleRuleUpdate
  ) => {
    set({ isLoading: true, error: null });
    try {
      const rule = await axiosApiClient.patch<TDomainThrottleRule>(
        `/browser-sessions/${sessionId}/domain-throttle-rules/${id}/`,
        data
      );
      set(state => ({
        rules: state.rules.map(r => (r.id === id ? rule : r)),
        isLoading: false,
      }));
      return rule;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteRule: async (sessionId: string, id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosApiClient.delete(
        `/browser-sessions/${sessionId}/domain-throttle-rules/${id}/`
      );
      set(state => ({
        rules: state.rules.filter(r => r.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
      throw error;
    }
  },

  reset: () => set({ rules: [], error: null }),
}));
