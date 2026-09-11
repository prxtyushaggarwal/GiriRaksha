import {
  HazardItem,
  Corridor,
  RouteSampleResult,
  PredictResult,
  CommunityReport,
  AssamAnalytics,
  WeatherTimelineStep,
} from "@/types";

import {
  FALLBACK_CORRIDORS,
  FALLBACK_HAZARDS,
  FALLBACK_THREAT_SCANNER,
  FALLBACK_ASSAM_ANALYTICS,
  generateFallbackAssamHotspots,
  FALLBACK_WEATHER_STEPS,
  clientMlEngine,
  clientSubscribeAlert,
  clientVerifyAlertOtp,
  clientTriggerDispatchCheck,
  clientGetCommunityReports,
  clientSubmitCommunityReport,
  clientDomainAiAdvisor,
} from "./clientFallback";

// Track whether the app is talking to the full-stack server or running client-side
let serverAvailable: boolean | null = null;

export function getServerStatus(): boolean {
  return serverAvailable ?? true;
}

// In-memory / session hazard cache to allow freshly reported hazards to persist in view
let localHazardsCache: HazardItem[] = [...FALLBACK_HAZARDS];

export async function fetchCorridors(): Promise<Record<string, Corridor>> {
  try {
    const res = await fetch("/api/corridors");
    if (res.ok) {
      const data = await res.json();
      serverAvailable = true;
      return data.corridors;
    }
  } catch (_) {}

  serverAvailable = false;
  return FALLBACK_CORRIDORS;
}

export async function fetchLiveHazards(): Promise<HazardItem[]> {
  try {
    const res = await fetch("/api/hazards/live");
    if (res.ok) {
      const data = await res.json();
      serverAvailable = true;
      localHazardsCache = data.hazards;
      return data.hazards;
    }
  } catch (_) {}

  serverAvailable = false;
  return localHazardsCache;
}

export async function fetchThreatScanner(): Promise<{
  timestamp: string;
  regions: Array<{
    region: string;
    corridor: string;
    points: Array<{
      name: string;
      lat: number;
      lon: number;
      h0_risk: number;
      h24_risk: number;
      h48_risk: number;
      h72_risk: number;
      predicted_rainfall_mm: number;
    }>;
  }>;
  intervals: string[];
}> {
  try {
    const res = await fetch("/api/threat-scanner");
    if (res.ok) {
      serverAvailable = true;
      return await res.json();
    }
  } catch (_) {}

  serverAvailable = false;
  return FALLBACK_THREAT_SCANNER;
}

export async function fetchAssamAnalytics(): Promise<AssamAnalytics> {
  try {
    const res = await fetch("/api/geospatial/assam/analytics");
    if (res.ok) {
      serverAvailable = true;
      return await res.json();
    }
  } catch (_) {}

  serverAvailable = false;
  return FALLBACK_ASSAM_ANALYTICS;
}

export async function fetchAssamHotspots(): Promise<HazardItem[]> {
  try {
    const res = await fetch("/api/geospatial/assam/hotspots");
    if (res.ok) {
      const data = await res.json();
      serverAvailable = true;
      return data.hotspots.map((spot: any) => ({
        ...spot,
        title: `${spot.district} Historical Cluster (#${spot.id})`,
        corridor: `${spot.district} Hill Range`,
        state: "Assam",
        rainfall_3d_mm: Math.round(spot.slope_deg * 3.2),
        rainfall_forecast_24h_mm: Math.round(spot.slope_deg * 1.5),
        sensor_status: "HISTORICAL_GROUND_TRUTH",
        displacement_rate_mm_hr: 0.8,
        road_status: `ISRO Bhuvan inventory: ${spot.lulc}. Elevation ${spot.elevation_m}m.`,
        last_updated: `Year ${spot.year} Ground-Truth`,
      }));
    }
  } catch (_) {}

  serverAvailable = false;
  return generateFallbackAssamHotspots();
}

export async function fetchWeatherTimeline(): Promise<WeatherTimelineStep[]> {
  try {
    const res = await fetch("/api/weather/timeline");
    if (res.ok) {
      const data = await res.json();
      serverAvailable = true;
      return data.steps;
    }
  } catch (_) {}

  serverAvailable = false;
  return FALLBACK_WEATHER_STEPS;
}

export async function predictPointRisk(params: {
  lat: number;
  lon: number;
  slope_deg: number;
  rainfall_3d_mm: number;
  rainfall_forecast_24h_mm: number;
  soil_moisture_pct: number;
  elevation_m?: number;
}): Promise<PredictResult> {
  try {
    const res = await fetch("/api/ml/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      serverAvailable = true;
      return await res.json();
    }
  } catch (_) {}

  serverAvailable = false;
  return clientMlEngine.predict(params);
}

export async function sampleCorridorRoute(
  corridor_id: string,
  waypoints: any[],
  route_name?: string
): Promise<RouteSampleResult> {
  try {
    const res = await fetch("/api/ml/corridor-sample", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ corridor_id, waypoints, route_name }),
    });
    if (res.ok) {
      serverAvailable = true;
      return await res.json();
    }
  } catch (_) {}

  serverAvailable = false;
  return clientMlEngine.sampleRoute(corridor_id, waypoints, route_name);
}

export async function subscribeAlert(params: {
  email: string;
  phone?: string;
  lat: number;
  lon: number;
  location_name?: string;
  radius_km?: number;
}): Promise<{
  status: string;
  email: string;
  message: string;
  expires_in_minutes: number;
  dev_otp_preview?: string;
}> {
  try {
    const res = await fetch("/api/alerts/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      serverAvailable = true;
      return await res.json();
    }
  } catch (_) {}

  serverAvailable = false;
  return clientSubscribeAlert(params);
}

export async function verifyAlertOtp(
  email: string,
  code: string
): Promise<{ status: string; message: string }> {
  try {
    const res = await fetch("/api/alerts/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    if (res.ok) {
      serverAvailable = true;
      return await res.json();
    }
  } catch (_) {}

  serverAvailable = false;
  return clientVerifyAlertOtp(email, code);
}

export async function triggerDispatchCheck(
  lat: number,
  lon: number,
  radius_km = 25.0
): Promise<any> {
  try {
    const res = await fetch("/api/alerts/dispatch-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lon, radius_km }),
    });
    if (res.ok) {
      serverAvailable = true;
      return await res.json();
    }
  } catch (_) {}

  serverAvailable = false;
  return clientTriggerDispatchCheck(lat, lon, radius_km);
}

export async function fetchCommunityReports(): Promise<CommunityReport[]> {
  try {
    const res = await fetch("/api/reports/community");
    if (res.ok) {
      const data = await res.json();
      serverAvailable = true;
      return data.reports;
    }
  } catch (_) {}

  serverAvailable = false;
  return clientGetCommunityReports();
}

export async function submitCommunityReport(
  report: CommunityReport
): Promise<any> {
  try {
    const res = await fetch("/api/reports/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });
    if (res.ok) {
      const data = await res.json();
      serverAvailable = true;
      if (data.hazard_entry) {
        localHazardsCache.unshift(data.hazard_entry);
      }
      return data;
    }
  } catch (_) {}

  serverAvailable = false;
  const result = clientSubmitCommunityReport(report);
  localHazardsCache.unshift(result.hazard_entry);
  return result;
}

export async function queryAiAdvisor(
  user_query: string,
  corridor_context?: string,
  hazard_context?: any,
  risk_score?: number
): Promise<{ advice: string; provider: string }> {
  try {
    const res = await fetch("/api/ai/advisor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_query,
        corridor_context,
        hazard_context,
        risk_score,
      }),
    });
    if (res.ok) {
      serverAvailable = true;
      return await res.json();
    }
  } catch (_) {}

  serverAvailable = false;
  return clientDomainAiAdvisor(user_query, corridor_context, hazard_context, risk_score);
}
