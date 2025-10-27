export interface TBrowserSession {
  id: string;
  name: string;
  description: string;
  browser_type: 'chromium' | 'firefox' | 'webkit';
  playwright_config: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  created_by: string | null;
  tags: string[];
  created_at: Date;
  updated_at: Date;
}

export interface TBrowserSessionCreate {
  name: string;
  description: string;
  browser_type: 'chromium' | 'firefox' | 'webkit';
  playwright_config: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  created_by: string | null;
  tags: string[];
}

export interface TBrowserSessionUpdate {
  name: string;
  description: string;
  browser_type: 'chromium' | 'firefox' | 'webkit';
  playwright_config: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  tags: string[];
}


