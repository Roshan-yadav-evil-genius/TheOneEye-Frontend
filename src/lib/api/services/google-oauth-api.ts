/**
 * Google OAuth API Service
 * 
 * Handles all Google OAuth related API operations.
 * Single responsibility: API communication for Google OAuth.
 */

import { BaseApiService } from '../base-api-service';
import {
  TGoogleConnectedAccount,
  TGoogleOAuthInitiateRequest,
  TGoogleOAuthInitiateResponse,
  TGoogleOAuthCallbackRequest,
} from '@/types';

class GoogleOAuthApiService extends BaseApiService {
  /**
   * Get all connected Google accounts for the current user.
   */
  async getAccounts(): Promise<TGoogleConnectedAccount[]> {
    return this.get<TGoogleConnectedAccount[]>('/auth/google/accounts/');
  }

  /**
   * Initiate Google OAuth flow.
   * Returns the authorization URL to redirect the user to.
   */
  async initiateOAuth(data: TGoogleOAuthInitiateRequest): Promise<TGoogleOAuthInitiateResponse> {
    return this.post<TGoogleOAuthInitiateResponse>('/auth/google/initiate/', data);
  }

  /**
   * Handle OAuth callback - exchange code for tokens.
   */
  async handleCallback(data: TGoogleOAuthCallbackRequest): Promise<TGoogleConnectedAccount> {
    return this.post<TGoogleConnectedAccount>('/auth/google/callback/', data);
  }

  /**
   * Delete/disconnect a Google account.
   */
  async deleteAccount(accountId: string): Promise<void> {
    return this.delete(`/auth/google/accounts/${accountId}/`);
  }
}

// Export singleton instance
export const googleOAuthApi = new GoogleOAuthApiService();

// Export individual methods for easier importing
export const {
  getAccounts,
  initiateOAuth,
  handleCallback,
  deleteAccount,
} = googleOAuthApi;

