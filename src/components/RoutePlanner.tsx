import React, { useState } from "react";
import { Corridor, RouteSampleResult } from "@/types";
import { sampleCorridorRoute } from "@/lib/api";
import { generateRouteRiskPdf } from "@/lib/pdfGenerator";
import {
  Navigation,
  FileDown,
  ShieldAlert,
  AlertTriangle,
  Loader2,
  TrendingUp,
  ChevronRight
} from "lucide-react";

interface RoutePlannerProps {
  corridors: Record<string, Corridor>;
  onRouteCalculated: (res: RouteSampleResult) => void;
  activeRoute: RouteSampleResult | null;
  selectedCorridorKey?: string;
  onSelectCorridorKey?: (key: string) => void;
}

export default function RoutePlanner({
  corridors,
  onRouteCalculated,
  activeRoute,
  selectedCorridorKey: externalKey,
  onSelectCorridorKey,
}: RoutePlannerProps) {
  const [internalKey, setInternalKey] = useState<string>("NH-58");
  const selectedCorridorKey = externalKey || internalKey;
  const setSelectedCorridorKey = (key: string) => {
    setInternalKey(key);
    if (onSelectCorridorKey) onSelectCorridorKey(key);
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAssessRoute = async (corridorKey: string) => {
    const corridor = corridors[corridorKey];
    if (!corridor) return;

    setLoading(true);
    setError(null);
    try {
      const result = await sampleCorridorRoute(corridorKey, corridor.waypoints, corridor.name);
      onRouteCalculated(result);
    } catch (err: any) {
      console.error(err);
      setError("Failed to calculate corridor risk. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = () => {
    if (!activeRoute) return;
    generateRouteRiskPdf(activeRoute);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 p-5 shadow-xl flex flex-col gap-4 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Safe Route Corridor Planner</h3>
            <p className="text-[11px] text-slate-400">25-Point Geotechnical & Meteorological Terrain Sampler</p>
          </div>
        </div>
      </div>

      {/* Mountain Corridor Presets */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-2 uppercase tracking-wider">
          Monitored Mountain Corridors:
        </label>
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(corridors).map(([key, item]) => {
            const isSelected = selectedCorridorKey === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedCorridorKey(key);
                  handleAssessRoute(key);
                }}
                className={`flex items-center justify-between p-2.5 rounded-lg text-left transition-all border text-xs cursor-pointer ${
                  isSelected
                    ? "bg-cyan-950/40 border-cyan-500/60 text-white shadow-sm"
                    : "bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="truncate pr-2">
                  <span className="font-bold text-cyan-400 block">{key}</span>
                  <span className="text-[11px] text-slate-300 truncate block">{item.name}</span>
                  <span className="text-[10px] text-slate-400 block">
                    {item.origin.name} → {item.destination.name}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      item.danger_level === "Critical"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {item.danger_level}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => handleAssessRoute(selectedCorridorKey)}
          disabled={loading}
          className="flex-1 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing 25 Terrain Points...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4" />
              Assess Route Safety Index
            </>
          )}
        </button>

        {activeRoute && (
          <button
            onClick={handleExportPdf}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            title="Download PDF Risk Report"
          >
            <FileDown className="w-4 h-4 text-cyan-400" />
            PDF Report
          </button>
        )}
      </div>

      {error && (
        <div className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded border border-red-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Active Route Telemetry Breakdown */}
      {activeRoute && (
        <div className="flex flex-col gap-3 pt-2 border-t border-slate-800">
          {/* Safety Gauge Header */}
          <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                Overall Route Safety
              </span>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-2xl font-black ${
                    activeRoute.verdict_badge === "Green"
                      ? "text-emerald-400"
                      : activeRoute.verdict_badge === "Amber"
                      ? "text-amber-400"
                      : "text-red-400"
                  }`}
                >
                  {activeRoute.safety_score_pct}%
                </span>
                <span className="text-xs text-slate-400">/ 100%</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                Hazard Exposure
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {activeRoute.critical_hazard_points} Severe
                </span>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {activeRoute.warning_hazard_points} Caution
                </span>
              </div>
            </div>
          </div>

          {/* Verdict Banner */}
          <div
            className={`p-2.5 rounded-lg border text-xs leading-relaxed ${
              activeRoute.verdict_badge === "Green"
                ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                : activeRoute.verdict_badge === "Amber"
                ? "bg-amber-950/30 border-amber-500/40 text-amber-300"
                : "bg-red-950/30 border-red-500/40 text-red-300"
            }`}
          >
            <strong>Advisory:</strong> {activeRoute.verdict}
          </div>

          {/* 25-Point Segment Sampling List */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1.5">
              <span>Sampled Corridor Nodes ({activeRoute.segments.length})</span>
              <span>Susceptibility Score</span>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar text-xs">
              {activeRoute.segments.map((seg) => (
                <div
                  key={seg.step_index}
                  className="flex items-center justify-between p-2 rounded bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 transition-all"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                      {seg.step_index}
                    </span>
                    <div className="truncate">
                      <span className="font-medium text-slate-200 block truncate">
                        {seg.location_name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {seg.elevation_m}m | Slope {seg.slope_deg}° | Moist {seg.soil_moisture_pct}%
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className="font-bold text-xs block"
                      style={{ color: seg.color }}
                    >
                      {seg.risk_score}
                    </span>
                    <span
                      className="text-[9px] uppercase px-1 py-0.2 rounded font-semibold"
                      style={{
                        backgroundColor: `${seg.color}20`,
                        color: seg.color,
                        border: `1px solid ${seg.color}40`,
                      }}
                    >
                      {seg.risk_level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
