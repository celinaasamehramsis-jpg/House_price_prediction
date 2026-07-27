export interface HouseFeaturesInput {
  carpet_area_sqft: number;
  floor_num: number;
  bathroom: number;
  balcony: number;
  location_grouped: string;
  Furnishing: string;
  Transaction: string;
  Ownership: string;
  facing: string;
}

export interface PredictionResult {
  predicted_price: number;
  formatted_price: string;
  currency: string;
  features_summary: HouseFeaturesInput;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'offline';
  model_loaded: boolean;
  version: string;
}

export interface LocationsResponse {
  locations: string[];
  total: number;
}
