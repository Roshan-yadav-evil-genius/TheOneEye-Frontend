export interface TBrowserPool {
  id: string;
  name: string;
  description: string | null;
  session_ids: string[];
  domain_throttle_enabled?: boolean;
  resource_blocking_enabled?: boolean;
  blocked_resource_types?: string[];
  created_at: string;
  updated_at: string;
}

export interface TBrowserPoolCreate {
  name: string;
  description?: string | null;
  session_ids: string[];
  domain_throttle_enabled?: boolean;
  resource_blocking_enabled?: boolean;
  blocked_resource_types?: string[];
}

export interface TBrowserPoolUpdate {
  name?: string;
  description?: string | null;
  session_ids?: string[];
  domain_throttle_enabled?: boolean;
  resource_blocking_enabled?: boolean;
  blocked_resource_types?: string[];
}

export interface TPoolDomainThrottleRule {
  id: string;
  pool: string;
  domain: string;
  delay_seconds: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface TPoolDomainThrottleRuleCreate {
  domain: string;
  delay_seconds: number;
  enabled?: boolean;
}

export interface TPoolDomainThrottleRuleUpdate {
  domain?: string;
  delay_seconds?: number;
  enabled?: boolean;
}
