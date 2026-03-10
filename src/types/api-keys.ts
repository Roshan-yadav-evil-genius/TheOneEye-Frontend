/**
 * API Key types (match backend serializers).
 */

export interface ApiKeyListItem {
  id: string;
  name: string;
  prefix: string;
  created_at: string;
}

export interface ApiKeyCreateResponse extends ApiKeyListItem {
  key: string;
}
