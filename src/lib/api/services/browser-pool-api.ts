import { axiosApiClient } from '../axios-client';
import type { TBrowserPool, TBrowserPoolCreate, TBrowserPoolUpdate } from '@/types/browser-pool';

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
