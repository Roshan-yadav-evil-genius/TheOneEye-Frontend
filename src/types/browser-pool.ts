export interface TBrowserPool {
  id: string;
  name: string;
  description: string | null;
  session_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface TBrowserPoolCreate {
  name: string;
  description?: string | null;
  session_ids: string[];
}

export interface TBrowserPoolUpdate {
  name?: string;
  description?: string | null;
  session_ids?: string[];
}
