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
  domain_throttle_enabled?: boolean;
  resource_blocking_enabled?: boolean;
  blocked_resource_types?: string[];
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
  domain_throttle_enabled?: boolean;
  resource_blocking_enabled?: boolean;
  blocked_resource_types?: string[];
}

/** Playwright resource types that can be blocked (for Settings UI). */
export const RESOURCE_TYPE_OPTIONS = [
  { value: 'image', label: 'Image' },
  { value: 'stylesheet', label: 'Stylesheet' },
  { value: 'font', label: 'Font' },
  { value: 'media', label: 'Media' },
  { value: 'script', label: 'Script' },
  { value: 'document', label: 'Document' },
  { value: 'xhr', label: 'XHR' },
  { value: 'fetch', label: 'Fetch' },
  { value: 'other', label: 'Other' },
] as const;

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
  enabled: boolean;
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
  enabled?: boolean;
}




