import React, { useState, useEffect } from "react";
import { predictPointRisk } from "@/lib/api";
import { PredictResult } from "@/types";
import {
  Cpu,
  Activity,
  Layers,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Gauge,
  Info
} from "lucide-react";

interface PredictionStudioProps {
  initialCoords?: { lat: number; lon: number };
}

export default function PredictionStudio({ initialCoords }: PredictionStudioProps) {
  const [lat, setLat] = useState<number>(() => {
    if (typeof initialCoords?.lat === "number" && !Number.isNaN(initialCoords.lat)) {
      return initialCoords.lat;
    }
    return 30.2451;
  });
  const [lon, setLon] = useState<number>(() => {
    if (typeof initialCoords?.lon === "number" && !Number.isNaN(initialCoords.lon)) {
      return initialCoords.lon;
    }
    return 78.8920;
  });
  const [slopeDeg, setSlopeDeg] = useState(48.5);
  const [rainfall3d, setRainfall3d] = useState(135.0);
  const [rainfall24h, setRainfall24h] = useState(55.0);
  const [soilMoisture, setSoilMoisture] = useState(84.0);
  const [elevation, setElevation] = useState(1450.0);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCoords) {
      if (typeof initialCoords.lat === "number" && !Number.isNaN(initialCoords.lat)) {
        setLat(initialCoords.lat);
      }
      if (typeof initialCoords.lon === "number" && !Number.isNaN(initialCoords.lon)) {
        setLon(initialCoords.lon);
      }
    }
  }, [initialCoords]);

  const runPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await predictPointRisk({
        lat,
        lon,
        slope_deg: slopeDeg,
        rainfall_3d_mm: rainfall3d,
        rainfall_forecast_24h_mm: rainfall24h,
        soil_moisture_pct: soilMoisture,
        elevation_m: elevation,
      });
      setResult(res);
    } catch (err: any) {
      setError("Prediction failed. Ensure backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runPrediction();
  }, []);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Interactive Multi-Model Geotechnical Simulator</h3>
            <p className="text-[11px] text-slate-400">Random Forest + XGBoost + Spatial CNN + LSTM Dynamic Ensemble</p>
          </div>
        </div>

        <button
          onClick={runPrediction}
          disabled={loading}
          className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer self-start sm:self-auto"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Cpu className="w-3.5 h-3.5" />}
          Re-Compute Ensemble
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-400 mb-0.5">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={Number.isNaN(lat) ? "" : lat}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setLat(Number.isNaN(val) ? 0 : val);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 font-mono text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-0.5">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={Number.isNaN(lon) ? "" : lon}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setLon(Number.isNaN(val) ? 0 : val);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 font-mono text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Slope Angle Gradient (β): <strong className="text-amber-400 font-mono">{Number.isNaN(slopeDeg) ? 0 : slopeDeg}°</strong></span>
              <span className="text-[10px] text-slate-500">Critical &gt; 35°</span>
            </div>
            <input
              type="range"
              min="5"
              max="70"
              step="0.5"
              value={Number.isNaN(slopeDeg) ? 48.5 : slopeDeg}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setSlopeDeg(Number.isNaN(val) ? 5 : val);
              }}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>3-Day Antecedent Rainfall: <strong className="text-blue-400 font-mono">{Number.isNaN(rainfall3d) ? 0 : rainfall3d} mm</strong></span>
              <span className="text-[10px] text-slate-500">Cumulative Infiltration</span>
            </div>
            <input
              type="range"
              min="0"
              max="350"
              step="5"
              value={Number.isNaN(rainfall3d) ? 135 : rainfall3d}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setRainfall3d(Number.isNaN(val) ? 0 : val);
              }}
              className="w-full accent-blue-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>24h Forecast Precipitation: <strong className="text-sky-400 font-mono">{Number.isNaN(rainfall24h) ? 0 : rainfall24h} mm</strong></span>
              <span className="text-[10px] text-slate-500">Dynamic Trigger</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={Number.isNaN(rainfall24h) ? 55 : rainfall24h}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setRainfall24h(Number.isNaN(val) ? 0 : val);
              }}
              className="w-full accent-sky-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Soil Pore-Water Saturation (m): <strong className="text-cyan-400 font-mono">{Number.isNaN(soilMoisture) ? 0 : soilMoisture}%</strong></span>
              <span className="text-[10px] text-slate-500">Pore Pressure Exceeded</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={Number.isNaN(soilMoisture) ? 84 : soilMoisture}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setSoilMoisture(Number.isNaN(val) ? 10 : val);
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Elevation: <strong className="text-emerald-400 font-mono">{Number.isNaN(elevation) ? 0 : elevation} m</strong></span>
            </div>
            <input
              type="range"
              min="100"
              max="4500"
              step="50"
              value={Number.isNaN(elevation) ? 1450 : elevation}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setElevation(Number.isNaN(val) ? 100 : val);
              }}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Prediction Output Results */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-3">
          {error && (
            <div className="p-2.5 rounded bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-3">
              {/* Verdict Banner */}
              <div
                className="p-3.5 rounded-lg border text-xs"
                style={{
                  backgroundColor: `${result.color}15`,
                  borderColor: `${result.color}50`,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm" style={{ color: result.color }}>
                    {result.status_text}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-mono font-bold"
                    style={{ backgroundColor: `${result.color}25`, color: result.color }}
                  >
                    Risk Score: {result.risk_score} / 100
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] mt-1">{result.advisory}</p>
              </div>

              {/* Geotechnical Indicators */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Factor of Safety (FS)
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span
                      className={`text-xl font-mono font-black ${
                        result.factor_of_safety < 1.05
                          ? "text-rose-400"
                          : result.factor_of_safety < 1.3
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {result.factor_of_safety}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {result.factor_of_safety < 1.0 ? "(Failure Imminent)" : "(Limit Equilibrium)"}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Caine (1980) Rainfall Threshold
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {result.caine_threshold_exceeded ? (
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Exceeded (Critical)
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Within Tolerance
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Model Weights Breakdown */}
              <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-xs">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">
                  Ensemble Contribution Breakdown:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Random Forest</span>
                    <span className="font-mono font-bold text-cyan-400">
                      {result.model_breakdown.random_forest_score}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">XGBoost</span>
                    <span className="font-mono font-bold text-blue-400">
                      {result.model_breakdown.xgboost_score}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Spatial CNN</span>
                    <span className="font-mono font-bold text-purple-400">
                      {Math.round(result.model_breakdown.cnn_deformation_index * 100)}%
                    </span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">LSTM Trigger</span>
                    <span className="font-mono font-bold text-amber-400">
                      {Math.round(result.model_breakdown.lstm_trigger_probability * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* LSTM 72h Forecast Projection */}
              {result.lstm_forecast && (
                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1 text-[10px]">
                    <span className="text-slate-400 uppercase font-bold tracking-wider">
                      LSTM 72h Recurrent Saturation Progression:
                    </span>
                    <span className="text-rose-400 font-mono">
                      Peak: {result.lstm_forecast.peak_risk_window}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {result.lstm_forecast.forecast_intervals.map((int, i) => (
                      <div key={int} className="bg-slate-900 p-1.5 rounded border border-slate-800 text-center">
                        <span className="text-[9px] text-slate-400 block">{int.split(" ")[0]}</span>
                        <span className="font-mono font-bold text-xs text-cyan-300">
                          {result.lstm_forecast.projected_soil_saturation_pct[i]}% sat
                        </span>
                        <span className="text-[9px] block text-amber-400 font-mono">
                          {Math.round(result.lstm_forecast.temporal_trigger_probabilities[i] * 100)}% risk
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
