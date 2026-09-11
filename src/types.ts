export interface HazardItem {
  id: string;
  title: string;
  corridor: string;
  state: string;
  lat: number;
  lon: number;
  severity: "Severe" | "High" | "Moderate" | "Low";
  risk_score: number;
  slope_deg: number;
  soil_moisture_pct: number;
  rainfall_3d_mm: number;
  rainfall_forecast_24h_mm: number;
  sensor_status: string;
  displacement_rate_mm_hr: number;
  road_status: string;
  last_updated: string;
}

export interface CorridorWaypoint {
  name: string;
  lat: number;
  lon: number;
  elevation_m?: number;
  slope_deg?: number;
  rainfall_3d_mm?: number;
  rainfall_forecast_24h_mm?: number;
  soil_moisture_pct?: number;
}

export interface Corridor {
  name: string;
  state: string;
  region: string;
  danger_level: "Critical" | "Warning" | "Moderate" | "Safe";
  origin: { name: string; lat: number; lon: number };
  destination: { name: string; lat: number; lon: number };
  waypoints: CorridorWaypoint[];
}

export interface RouteSegment {
  step_index: number;
  location_name: string;
  lat: number;
  lon: number;
  elevation_m: number;
  slope_deg: number;
  rainfall_3d_mm: number;
  rainfall_forecast_24h_mm: number;
  soil_moisture_pct: number;
  risk_score: number;
  risk_level: "Severe" | "High" | "Moderate" | "Low";
  color: string;
  factor_of_safety: number;
  caine_threshold_exceeded: boolean;
  status_text: string;
  advisory: string;
  model_breakdown: {
    random_forest_score: number;
    xgboost_score: number;
    cnn_deformation_index: number;
    lstm_trigger_probability: number;
  };
}

export interface RouteSampleResult {
  corridor_id?: string;
  route_name?: string;
  total_sampled_points: number;
  safety_score_pct: number;
  average_risk_score: number;
  verdict: string;
  verdict_badge: "Green" | "Amber" | "Red";
  critical_hazard_points: number;
  warning_hazard_points: number;
  segments: RouteSegment[];
}

export interface PredictResult {
  lat: number;
  lon: number;
  elevation_m: number;
  slope_deg: number;
  rainfall_3d_mm: number;
  rainfall_forecast_24h_mm: number;
  soil_moisture_pct: number;
  risk_score: number;
  risk_level: "Severe" | "High" | "Moderate" | "Low";
  color: string;
  factor_of_safety: number;
  caine_threshold_exceeded: boolean;
  status_text: string;
  advisory: string;
  model_breakdown: {
    random_forest_score: number;
    xgboost_score: number;
    cnn_deformation_index: number;
    lstm_trigger_probability: number;
  };
  cnn_analysis: {
    deformation_index: number;
    max_shear_gradient: number;
    terrain_curvature: number;
    model_architecture: string;
  };
  lstm_forecast: {
    forecast_intervals: string[];
    projected_soil_saturation_pct: number[];
    temporal_trigger_probabilities: number[];
    peak_risk_window: string;
    model_architecture: string;
  };
}

export interface CommunityReport {
  id?: number;
  reporter_name?: string;
  contact?: string;
  hazard_type: string;
  severity: "Minor" | "Moderate" | "Critical";
  description: string;
  lat: number;
  lon: number;
  location_name: string;
  photo_url?: string;
  upvotes?: number;
  status?: string;
  created_at?: string;
}

export interface AssamAnalytics {
  region: string;
  authority: string;
  total_cataloged_landslides: number;
  high_risk_districts: Record<string, number>;
  land_use_cover_classification: Record<string, number>;
  environmental_stress_indicators: {
    brahmaputra_basin_monsoon_saturation_pct: number;
    barak_valley_pore_pressure_index: number;
    dima_hasao_rail_corridor_risk_index: number;
    terrain_ruggedness_index_tri_mean: number;
    topographic_wetness_index_twi_mean: number;
  };
  model_readiness: {
    spatial_random_forest: string;
    spatial_xgboost: string;
    spatial_cnn_patch_extractor: string;
    lstm_weather_forecaster: string;
  };
  active_hotspots_count: number;
}

export interface WeatherTimelineStep {
  offset: number;
  label: string;
  monsoon_intensity: string;
  avg_rainfall_mm: number;
  overall_regional_risk: number;
  active_severe_alerts: number;
}
