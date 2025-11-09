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

// Form-related types
export interface BrowserSessionFormData {
  name: string;
  description: string;
  browser_type: 'chromium' | 'firefox' | 'webkit';
  playwright_config: {
    headless: boolean;
    viewport: {
      width: number;
      height: number;
    };
    user_agent?: string;
    args?: string[];
    timeout?: number;
    slow_mo?: number;
  };
}

export interface BrowserSessionFormProps {
  initialData?: Partial<BrowserSessionFormData>;
  onSubmit: (data: BrowserSessionFormData) => Promise<void>;
  submitButtonText: string;
  onCancel: () => void;
}




