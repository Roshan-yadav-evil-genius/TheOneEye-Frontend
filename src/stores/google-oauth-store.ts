/**
 * Google OAuth Store
 * 
 * Single responsibility: Managing Google connected accounts state.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { googleOAuthApi } from '@/lib/api/services/google-oauth-api';
import {
  TGoogleConnectedAccount,
  TGoogleOAuthInitiateRequest,
  TGoogleOAuthInitiateResponse,
  TGoogleOAuthCallbackRequest,
} from '@/types';

interface TGoogleOAuthState {
  accounts: TGoogleConnectedAccount[];
  isLoading: boolean;
  error: string | null;
  
  // Pending OAuth flow data (stored temporarily during OAuth redirect)
  pendingOAuth: {
    name: string;
    scopes: string[];
    state: string;
  } | null;
}

interface TGoogleOAuthActions {
  loadAccounts: () => Promise<void>;
  initiateOAuth: (data: TGoogleOAuthInitiateRequest) => Promise<TGoogleOAuthInitiateResponse>;
  handleCallback: (data: TGoogleOAuthCallbackRequest) => Promise<TGoogleConnectedAccount>;
  deleteAccount: (accountId: string) => Promise<void>;
  setPendingOAuth: (data: { name: string; scopes: string[]; state: string } | null) => void;
  clearError: () => void;
}

type TGoogleOAuthStore = TGoogleOAuthState & TGoogleOAuthActions;

const initialState: TGoogleOAuthState = {
  accounts: [],
  isLoading: false,
  error: null,
  pendingOAuth: null,
};

export const useGoogleOAuthStore = create<TGoogleOAuthStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      loadAccounts: async () => {
        set({ isLoading: true, error: null });
        try {
          const accounts = await googleOAuthApi.getAccounts();
          set({ accounts, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load accounts',
            isLoading: false,
          });
        }
      },

      initiateOAuth: async (data: TGoogleOAuthInitiateRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await googleOAuthApi.initiateOAuth(data);
          
          // Store pending OAuth data for callback
          set({
            pendingOAuth: {
              name: response.name,
              scopes: response.scopes,
              state: response.state,
            },
            isLoading: false,
          });
          
          // Also store in sessionStorage for persistence across redirect
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('google_oauth_pending', JSON.stringify({
              name: response.name,
              scopes: response.scopes,
              state: response.state,
            }));
          }
          
          return response;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to initiate OAuth',
            isLoading: false,
          });
          throw error;
        }
      },

      handleCallback: async (data: TGoogleOAuthCallbackRequest) => {
        set({ isLoading: true, error: null });
        try {
          const account = await googleOAuthApi.handleCallback(data);
          
          // Add the new account to the list
          set((state) => ({
            accounts: [account, ...state.accounts.filter(a => a.id !== account.id)],
            pendingOAuth: null,
            isLoading: false,
          }));
          
          // Clear sessionStorage
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('google_oauth_pending');
          }
          
          return account;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to complete OAuth',
            isLoading: false,
          });
          throw error;
        }
      },

      deleteAccount: async (accountId: string) => {
        set({ isLoading: true, error: null });
        try {
          await googleOAuthApi.deleteAccount(accountId);
          
          // Remove the account from the list
          set((state) => ({
            accounts: state.accounts.filter(a => a.id !== accountId),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete account',
            isLoading: false,
          });
          throw error;
        }
      },

      setPendingOAuth: (data) => {
        set({ pendingOAuth: data });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'google-oauth-store',
    }
  )
);

