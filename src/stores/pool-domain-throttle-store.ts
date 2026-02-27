import { create } from 'zustand';
import type {
  TPoolDomainThrottleRule,
  TPoolDomainThrottleRuleCreate,
  TPoolDomainThrottleRuleUpdate,
} from '@/types/browser-pool';
import { axiosApiClient } from '@/lib/api/axios-client';

interface PoolDomainThrottleState {
  rules: TPoolDomainThrottleRule[];
  isLoading: boolean;
  error: string | null;

  listRules: (poolId: string) => Promise<TPoolDomainThrottleRule[]>;
  createRule: (
    poolId: string,
    data: TPoolDomainThrottleRuleCreate
  ) => Promise<TPoolDomainThrottleRule>;
  updateRule: (
    poolId: string,
    id: string,
    data: TPoolDomainThrottleRuleUpdate
  ) => Promise<TPoolDomainThrottleRule>;
  deleteRule: (poolId: string, id: string) => Promise<void>;
  reset: () => void;
}

export const usePoolDomainThrottleStore = create<PoolDomainThrottleState>((set) => ({
  rules: [],
  isLoading: false,
  error: null,

  listRules: async (poolId: string) => {
    set({ isLoading: true, error: null });
    try {
      const rules = await axiosApiClient.get<TPoolDomainThrottleRule[]>(
        `/browser-pools/${poolId}/domain-throttle-rules/`
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

  createRule: async (poolId: string, data: TPoolDomainThrottleRuleCreate) => {
    set({ isLoading: true, error: null });
    try {
      const rule = await axiosApiClient.post<TPoolDomainThrottleRule>(
        `/browser-pools/${poolId}/domain-throttle-rules/`,
        data
      );
      set((state) => ({
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
    poolId: string,
    id: string,
    data: TPoolDomainThrottleRuleUpdate
  ) => {
    set({ isLoading: true, error: null });
    try {
      const rule = await axiosApiClient.patch<TPoolDomainThrottleRule>(
        `/browser-pools/${poolId}/domain-throttle-rules/${id}/`,
        data
      );
      set((state) => ({
        rules: state.rules.map((r) => (r.id === id ? rule : r)),
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

  deleteRule: async (poolId: string, id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosApiClient.delete(
        `/browser-pools/${poolId}/domain-throttle-rules/${id}/`
      );
      set((state) => ({
        rules: state.rules.filter((r) => r.id !== id),
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
