export interface MapData {
  id: number;
  mapId: number;
  mod: string;
  mapName: string;
  difficultyName: string;
  length: number;
  starRating: number;
  mapSetId: number;
  maxCombo: number;
  bpm: number;
  downloadAvailable: boolean;
  mmr: number;
  skillset: string;
  sheetId: string;
  poolName: string;
  poolId: number;
}

export interface MapFilters {
  mod?: string;
  starRating?: number;
  bpm?: number;
}

export interface RecommendResponse {
  command?: string;
  messages?: string[];
  totalMatches?: number;
  randomMMR?: number;
  map?: MapData | null;
  filtersApplied?: MapFilters;
  error?: string;
  usage?: string;
  examples?: string[];
}

export interface HistoryEntry {
  command: string;
  result: RecommendResponse;
  timestamp: number;
}

// Pool management types

export interface PoolData {
  id: number;
  version: number;
  name: string;
  link?: string;
  averageMMR: number;
  uuid: string;
  mapCount: number;
}

export interface PoolWithMaps {
  id: number;
  version: number;
  name: string;
  link?: string;
  averageMMR: number;
  uuid: string;
  maps: MapData[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BeatmapLookupResult {
  mapId: number;
  mapSetId: number;
  mapName: string;
  difficultyName: string;
  length: number;
  starRating: number;
  maxCombo: number;
  bpm: number;
  downloadAvailable: boolean;
}

export interface CreatePoolPayload {
  version: number;
  name: string;
  link?: string;
  averageMMR: number;
}

export interface CreateMapPayload {
  mapId: number;
  mod: string;
  mapName: string;
  difficultyName: string;
  length: number;
  starRating: number;
  mapSetId: number;
  maxCombo: number;
  bpm: number;
  downloadAvailable?: boolean;
  mmr: number;
  skillset?: string;
  sheetId: string;
  poolName: string;
}
