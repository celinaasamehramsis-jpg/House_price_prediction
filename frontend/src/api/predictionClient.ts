import {
  HouseFeaturesInput,
  PredictionResult,
  HealthStatus,
  LocationsResponse
} from '../types/prediction';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function checkHealth(): Promise<HealthStatus> {
  try {
    const response = await fetch(`${BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Health check failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return {
      status: 'offline',
      model_loaded: false,
      version: 'unknown'
    };
  }
}

export async function fetchLocations(): Promise<string[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/locations`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (response.ok) {
      const data: LocationsResponse = await response.json();
      return data.locations;
    }
  } catch (err) {
    console.warn("Could not fetch locations from backend API, falling back to local defaults.", err);
  }
  // Default fallback locations matching locations.json
  return ["ahmedabad", "mumbai", "nagpur", "navi-mumbai", "thane"];
}

export async function predictPrice(features: HouseFeaturesInput): Promise<PredictionResult> {
  const endpoint = `${BASE_URL}/predict`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(features),
  });

  if (!response.ok) {
    let errorMsg = `Server error (${response.status})`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMsg = typeof errorData.detail === 'string' 
          ? errorData.detail 
          : JSON.stringify(errorData.detail);
      }
    } catch {
      // Use fallback errorMsg
    }
    throw new Error(errorMsg);
  }

  return await response.json();
}
