import { create } from 'zustand';
import {
  getPools,
  getPool,
  createPool as createPoolApi,
  updatePool as updatePoolApi,
  deletePool as deletePoolApi,
} from '@/lib/api/services/browser-pool-api';
import type { TBrowserPool, TBrowserPoolCreate, TBrowserPoolUpdate } from '@/types/browser-pool';

interface BrowserPoolState {
  pools: TBrowserPool[];
  isLoading: boolean;
  error: string | null;

  loadPools: () => Promise<void>;
  getPoolById: (id: string) => Promise<TBrowserPool | null>;
  createPool: (data: TBrowserPoolCreate) => Promise<TBrowserPool>;
  updatePool: (id: string, data: TBrowserPoolUpdate) => Promise<TBrowserPool>;
  deletePool: (id: string) => Promise<void>;
}

export const useBrowserPoolStore = create<BrowserPoolState>((set, get) => ({
  pools: [],
  isLoading: false,
  error: null,

  loadPools: async () => {
    set({ isLoading: true, error: null });
    try {
      const pools = await getPools();
      set({ pools, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  getPoolById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const pool = await getPool(id);
      set({ isLoading: false });
      return pool;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
      return null;
    }
  },

  createPool: async (data: TBrowserPoolCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newPool = await createPoolApi(data);
      set((state) => ({
        pools: [newPool, ...state.pools],
        isLoading: false,
      }));
      return newPool;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
      throw error;
    }
  },

  updatePool: async (id: string, data: TBrowserPoolUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await updatePoolApi(id, data);
      set((state) => ({
        pools: state.pools.map((p) => (p.id === id ? updated : p)),
        isLoading: false,
      }));
      return updated;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
      throw error;
    }
  },

  deletePool: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deletePoolApi(id);
      set((state) => ({
        pools: state.pools.filter((p) => p.id !== id),
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
}));
