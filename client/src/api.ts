import type {
  PoolData,
  PoolWithMaps,
  MapData,
  PaginatedResponse,
  BeatmapLookupResult,
  CreatePoolPayload,
  CreateMapPayload,
} from './types';

const BASE = import.meta.env.VITE_BASE_API_URL || '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const poolsApi = {
  list: (params?: { search?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    const query = qs.toString();
    return request<PaginatedResponse<PoolData>>(
      `/api/pools${query ? `?${query}` : ''}`,
    );
  },

  get: (id: number) => request<PoolWithMaps>(`/api/pools/${id}`),

  create: (data: CreatePoolPayload) =>
    request<PoolData>('/api/pools', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<CreatePoolPayload>) =>
    request<PoolData>(`/api/pools/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  remove: (id: number) =>
    request<void>(`/api/pools/${id}`, { method: 'DELETE' }),
};

export const mapsApi = {
  addToPool: (poolId: number, data: CreateMapPayload) =>
    request<MapData>(`/api/pools/${poolId}/maps`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<CreateMapPayload>) =>
    request<MapData>(`/api/maps/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  remove: (id: number) =>
    request<void>(`/api/maps/${id}`, { method: 'DELETE' }),
};

export const osuApi = {
  lookupBeatmap: (beatmapId: number) =>
    request<BeatmapLookupResult>(`/api/osu/beatmap/${beatmapId}`),
};
