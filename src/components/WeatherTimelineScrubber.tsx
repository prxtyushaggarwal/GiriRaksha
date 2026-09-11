import React from "react";
import { WeatherTimelineStep } from "@/types";
import { Clock, CloudRain, AlertTriangle } from "lucide-react";

interface WeatherTimelineScrubberProps {
  steps: WeatherTimelineStep[];
  activeStepIndex: number;
  onSelectStep: (idx: number) => void;
}

export default function WeatherTimelineScrubber({
  steps,
  activeStepIndex,
  onSelectStep,
}: WeatherTimelineScrubberProps) {
  if (!steps || steps.length === 0) return null;

  const current = steps[activeStepIndex] || steps[0];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-slate-200 shadow-xl">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Temporal Weather & Saturation Scrubber (-24h to +72h)
          </span>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
          Step: {current.label}
        </span>
      </div>

      {/* Scrubber Buttons */}
      <div className="grid grid-cols-5 gap-1.5 mb-4">
        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const isExtreme = step.overall_regional_risk >= 85;
          return (
            <button
              key={step.offset}
              onClick={() => onSelectStep(idx)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? isExtreme
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 border border-rose-400"
                    : "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 border border-cyan-400"
                  : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700"
              }`}
            >
              <span className="font-semibold">{step.label.split(" ")[0]}</span>
              <span className="text-[10px] opacity-80">{step.label.split(" ")[1] || ""}</span>
            </button>
          );
        })}
      </div>

      {/* Active Step Details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase">Monsoon Status</span>
          <span className="font-semibold text-slate-200 flex items-center gap-1 mt-0.5">
            <CloudRain className="w-3.5 h-3.5 text-blue-400" /> {current.monsoon_intensity}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase">Avg Regional Rainfall</span>
          <span className="font-semibold text-cyan-400 mt-0.5 block">{current.avg_rainfall_mm} mm</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase">Terrain Risk Index</span>
          <span className={`font-semibold mt-0.5 block ${current.overall_regional_risk >= 85 ? "text-rose-400" : current.overall_regional_risk >= 60 ? "text-amber-400" : "text-emerald-400"}`}>
            {current.overall_regional_risk} / 100
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase">Severe Hazard Zones</span>
          <span className="font-semibold text-rose-400 flex items-center gap-1 mt-0.5">
            <AlertTriangle className="w-3.5 h-3.5" /> {current.active_severe_alerts} Corridors
          </span>
        </div>
      </div>
    </div>
  );
}
