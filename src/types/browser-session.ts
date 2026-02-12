export interface TBrowserSession {
  id: string;
  name: string;
  description: string;
  browser_type: 'chromium' | 'firefox' | 'webkit';
  playwright_config: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  created_by: string | null;
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
}

export interface TBrowserSessionUpdate {
  name: string;
  description: string;
  browser_type: 'chromium' | 'firefox' | 'webkit';
  playwright_config: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
}

// Form-related types
export interface BrowserSessionFormData {
  name: string;
  description: string;
  browser_type: 'chromium' | 'firefox' | 'webkit';
  playwright_config: {
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

// Domain throttle rule (per session, per domain delay)
export interface TDomainThrottleRule {
  id: string;
  session: string;
  domain: string;
  delay_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface TDomainThrottleRuleCreate {
  domain: string;
  delay_seconds: number;
}

export interface TDomainThrottleRuleUpdate {
  domain?: string;
  delay_seconds?: number;
}




