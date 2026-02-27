import { axiosApiClient } from '../axios-client';
import type {
  TBrowserPool,
  TBrowserPoolCreate,
  TBrowserPoolUpdate,
  TPoolDomainThrottleRule,
  TPoolDomainThrottleRuleCreate,
  TPoolDomainThrottleRuleUpdate,
} from '@/types/browser-pool';

export async function getPools(): Promise<TBrowserPool[]> {
  return axiosApiClient.get<TBrowserPool[]>('/browser-pools/');
}

export async function getPool(id: string): Promise<TBrowserPool> {
  return axiosApiClient.get<TBrowserPool>(`/browser-pools/${id}/`);
}

export async function createPool(data: TBrowserPoolCreate): Promise<TBrowserPool> {
  return axiosApiClient.post<TBrowserPool>('/browser-pools/', data);
}

export async function updatePool(id: string, data: TBrowserPoolUpdate): Promise<TBrowserPool> {
  return axiosApiClient.patch<TBrowserPool>(`/browser-pools/${id}/`, data);
}

export async function deletePool(id: string): Promise<void> {
  await axiosApiClient.delete(`/browser-pools/${id}/`);
}

export async function getPoolThrottleRules(poolId: string): Promise<TPoolDomainThrottleRule[]> {
  return axiosApiClient.get<TPoolDomainThrottleRule[]>(
    `/browser-pools/${poolId}/domain-throttle-rules/`
  );
}

export async function createPoolThrottleRule(
  poolId: string,
  data: TPoolDomainThrottleRuleCreate
): Promise<TPoolDomainThrottleRule> {
  return axiosApiClient.post<TPoolDomainThrottleRule>(
    `/browser-pools/${poolId}/domain-throttle-rules/`,
    data
  );
}

export async function updatePoolThrottleRule(
  poolId: string,
  ruleId: string,
  data: TPoolDomainThrottleRuleUpdate
): Promise<TPoolDomainThrottleRule> {
  return axiosApiClient.patch<TPoolDomainThrottleRule>(
    `/browser-pools/${poolId}/domain-throttle-rules/${ruleId}/`,
    data
  );
}

export async function deletePoolThrottleRule(poolId: string, ruleId: string): Promise<void> {
  await axiosApiClient.delete(
    `/browser-pools/${poolId}/domain-throttle-rules/${ruleId}/`
  );
}
