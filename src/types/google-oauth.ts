/**
 * Google OAuth Types
 * 
 * Types for Google connected accounts and OAuth flow.
 */

// Google connected account from backend
export interface TGoogleConnectedAccount {
  id: string;
  name: string;
  email: string;
  picture: string | null;
  scopes: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Request to initiate OAuth flow
export interface TGoogleOAuthInitiateRequest {
  name: string;
  scopes: string[];
}

// Response from initiate endpoint
export interface TGoogleOAuthInitiateResponse {
  auth_url: string;
  state: string;
  name: string;
  scopes: string[];
}

// Request to handle OAuth callback
export interface TGoogleOAuthCallbackRequest {
  code: string;
  state: string;
  name: string;
  scopes: string[];
}

// Available Google OAuth scopes
export const GOOGLE_OAUTH_SCOPES = {
  sheets_readonly: {
    key: 'sheets_readonly',
    label: 'Google Sheets (Read Only)',
    description: 'View your Google Sheets spreadsheets',
  },
  sheets: {
    key: 'sheets',
    label: 'Google Sheets (Read & Write)',
    description: 'View and edit your Google Sheets spreadsheets',
  },
  drive_readonly: {
    key: 'drive_readonly',
    label: 'Google Drive (Read Only)',
    description: 'View files in your Google Drive',
  },
  drive: {
    key: 'drive',
    label: 'Google Drive (Read & Write)',
    description: 'View and manage files in your Google Drive',
  },
  gmail_readonly: {
    key: 'gmail_readonly',
    label: 'Gmail (Read Only)',
    description: 'View your Gmail messages',
  },
  gmail_send: {
    key: 'gmail_send',
    label: 'Gmail (Send)',
    description: 'Send emails on your behalf',
  },
} as const;

export type TGoogleOAuthScopeKey = keyof typeof GOOGLE_OAUTH_SCOPES;

