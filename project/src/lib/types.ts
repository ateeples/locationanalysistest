export interface LocationData {
  address: string;
  coordinates: [number, number];
  timestamp: number;
  isFavorite?: boolean;
  analysis?: LocationAnalysis;
}

export interface LocationDetails {
  name: string;
  address: string;
  coordinates: [number, number];
}

export type AreaType = 'Rural' | 'Suburban' | 'Urban' | 'Error';
export type PopulationRange = string;

export interface AreaTypeRanking {
  value: AreaType;
  description: string;
}

export interface PopulationRanking {
  value: PopulationRange;
  description: string;
}

export interface Rankings {
  areaType: AreaTypeRanking;
  population: PopulationRanking;
}

export interface AnalysisContent {
  demographic_profile: string;
  lifestyle_trends: string;
  relevant_industries: string;
  physical_characteristics: string;
  type_of_center: string;
  nearby_businesses: string;
}

export interface LocationAnalysis {
  location: LocationDetails;
  rankings: Rankings;
  analysis: AnalysisContent;
  error?: string;
}

export interface StorageData {
  recentSearches: LocationData[];
  favorites: LocationData[];
}

// Type guard for checking if a value is a valid area type
export function isValidAreaType(value: string): value is AreaType {
  return ['Rural', 'Suburban', 'Urban', 'Error'].includes(value);
}