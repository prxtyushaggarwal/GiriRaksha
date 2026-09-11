import React from "react";
import { AssamAnalytics, HazardItem } from "@/types";
import {
  Mountain,
  Layers,
  Cpu,
  ShieldAlert,
  Activity,
  Trees,
  Database,
  CheckCircle2,
  MapPin,
  Flame
} from "lucide-react";

interface AssamAnalyticsViewProps {
  analytics: AssamAnalytics | null;
  hotspots: HazardItem[];
  onSelectHotspot: (h: HazardItem) => void;
}

export default function AssamAnalyticsView({
  analytics,
  hotspots,
  onSelectHotspot
}: AssamAnalyticsViewProps) {
  if (!analytics) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
        <Activity className="w-8 h-8 mx-auto animate-spin text-cyan-400 mb-2" />
        <p>Loading Assam & North Eastern Region Geospatial Pipeline...</p>
      </div>
    );
  }

  const indicators = analytics.environmental_stress_indicators;
  const models = analytics.model_readiness;

  return (
    <div className="flex flex-col gap-6 text-slate-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-cyan-950/60 to-slate-900/80 border border-cyan-500/30 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ISRO Bhuvan + SRTM DEM 30m Pipeline
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                ASDMA / NDRF Decision Matrix
              </span>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Mountain className="w-6 h-6 text-cyan-400" />
              Assam & North Eastern Region (NER) Geospatial Analytics
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Automated landslide monitoring integrating 1,727 historical ground-truth inventories (2014, 2017, 2023),
              multi-source raster terrain derivatives, and temporal weather telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-black text-cyan-400 font-mono">
                {analytics.total_cataloged_landslides.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Cataloged Slide Events</div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Model Intelligence Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-md">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Cpu className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Spatial Random Forest</h4>
          </div>
          <p className="text-xs text-slate-400 mb-2">Multi-variable terrain classification (Slope, Aspect, Elevation, Lithology).</p>
          <div className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> {models.spatial_random_forest}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-md">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Activity className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Extreme Gradient Boost (XGB)</h4>
          </div>
          <p className="text-xs text-slate-400 mb-2">Spatial Gradient Boosting with tree-pruned soil pore-water thresholds.</p>
          <div className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> {models.spatial_xgboost}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-md">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Layers className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Spatial CNN Extractor</h4>
          </div>
          <p className="text-xs text-slate-400 mb-2">16x16 DEM heightmap patch convolution for slope shear deformation detection.</p>
          <div className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> {models.spatial_cnn_patch_extractor}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-md">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <ShieldAlert className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Dynamic LSTM Forecaster</h4>
          </div>
          <p className="text-xs text-slate-400 mb-2">Sequential recurrent forecasting for 72h antecedent rainfall & saturation curve.</p>
          <div className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> {models.lstm_weather_forecaster}
          </div>
        </div>
      </div>

      {/* Environmental Stress & Vulnerability Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Environmental Stress Gauges */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" /> Regional Stress Indicators
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Live Telemetry</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Brahmaputra Basin Saturation</span>
                <span className="font-mono font-bold text-orange-400">{indicators.brahmaputra_basin_monsoon_saturation_pct}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: `${indicators.brahmaputra_basin_monsoon_saturation_pct}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Barak Valley Pore Pressure</span>
                <span className="font-mono font-bold text-amber-400">{indicators.barak_valley_pore_pressure_index}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${indicators.barak_valley_pore_pressure_index}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Dima Hasao Hill Rail Corridor Risk</span>
                <span className="font-mono font-bold text-rose-400">{indicators.dima_hasao_rail_corridor_risk_index}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${indicators.dima_hasao_rail_corridor_risk_index}%` }}></div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Terrain Ruggedness (TRI)</span>
                <span className="font-mono font-bold text-cyan-400">{indicators.terrain_ruggedness_index_tri_mean} m</span>
              </div>
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Topographic Wetness (TWI)</span>
                <span className="font-mono font-bold text-blue-400">{indicators.topographic_wetness_index_twi_mean}</span>
              </div>
            </div>
          </div>
        </div>

        {/* High-Risk Districts Distribution */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" /> Vulnerable Districts (Historical Count)
            </h3>
          </div>

          <div className="space-y-2 mt-1">
            {Object.entries(analytics.high_risk_districts).map(([dist, count]) => {
              const max = 815;
              const numericCount = Number(count) || 0;
              const pct = Math.round((numericCount / max) * 100);
              return (
                <div key={dist}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-slate-300 font-medium">{dist}</span>
                    <span className="font-mono text-cyan-400 font-semibold">{numericCount} slides</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ISRO Bhuvan LULC Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Trees className="w-4 h-4 text-emerald-400" /> ISRO Bhuvan LULC Factor Analysis
            </h3>
          </div>

          <div className="space-y-2 mt-1">
            {Object.entries(analytics.land_use_cover_classification).map(([lulc, count]) => (
              <div key={lulc} className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80 text-xs">
                <span className="text-slate-300">{lulc}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-emerald-300 font-semibold text-[11px]">
                  {count} occurrences
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Hotspot Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Sample Ingested Assam Landslide Hotspots ({hotspots.length} Nodes Loaded)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Click any hotspot to focus on the 3D Cesium globe</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
          {hotspots.slice(0, 15).map((spot) => (
            <div
              key={spot.id}
              onClick={() => onSelectHotspot(spot)}
              className="p-3 rounded-lg bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all flex flex-col justify-between gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-xs text-white line-clamp-1">{spot.title}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  spot.severity === "Severe" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}>
                  {spot.risk_score}/100
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Slope: {spot.slope_deg}°</span>
                <span>Moisture: {spot.soil_moisture_pct}%</span>
              </div>
              <div className="text-[10px] text-cyan-400/80 line-clamp-1">
                {spot.road_status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
