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
