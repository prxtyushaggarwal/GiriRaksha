import React, { useEffect, useState } from "react";
import { fetchThreatScanner } from "@/lib/api";
import { ShieldAlert, AlertTriangle, Clock, MapPin, Loader2, RefreshCw } from "lucide-react";

export default function ThreatScannerMatrix() {
  const [data, setData] = useState<{
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
  } | null>(null);

  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchThreatScanner();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getRiskColor = (score: number) => {
    if (score >= 80) return "bg-rose-500/20 text-rose-400 border border-rose-500/40";
    if (score >= 65) return "bg-orange-500/20 text-orange-400 border border-orange-500/40";
    if (score >= 45) return "bg-amber-500/20 text-amber-400 border border-amber-500/40";
    return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40";
  };

  if (loading || !data) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-center text-slate-400">
        <Loader2 className="w-6 h-6 mx-auto animate-spin text-cyan-400 mb-2" />
        <p className="text-xs">Computing 72-Hour Regional Threat Projections...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl text-slate-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">72-Hour Mountain Hazard Threat Matrix</h3>
            <p className="text-[11px] text-slate-400">Continuous Recurrent Infiltration Projection across Sensitive Highways</p>
          </div>
        </div>

        <button
          onClick={loadData}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
          title="Refresh scanner"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {data.regions.map((reg, idx) => (
          <div key={idx} className="bg-slate-950/60 rounded-lg p-3.5 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {reg.region}
                </span>
                <span className="text-[10px] text-slate-400 block">{reg.corridor}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                    <th className="pb-1 font-semibold">Choke Point</th>
                    <th className="pb-1 font-semibold text-center">0h (Now)</th>
                    <th className="pb-1 font-semibold text-center">+24h</th>
                    <th className="pb-1 font-semibold text-center">+48h</th>
                    <th className="pb-1 font-semibold text-center">+72h</th>
                    <th className="pb-1 font-semibold text-right">Rain Forecast</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {reg.points.map((pt, pIdx) => (
                    <tr key={pIdx} className="hover:bg-slate-900/50 transition-all">
                      <td className="py-2 text-slate-200 font-medium">{pt.name}</td>
                      <td className="py-2 text-center">
                        <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${getRiskColor(pt.h0_risk)}`}>
                          {pt.h0_risk}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${getRiskColor(pt.h24_risk)}`}>
                          {pt.h24_risk}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${getRiskColor(pt.h48_risk)}`}>
                          {pt.h48_risk}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${getRiskColor(pt.h72_risk)}`}>
                          {pt.h72_risk}
                        </span>
                      </td>
                      <td className="py-2 text-right font-mono text-cyan-400 font-semibold">
                        {pt.predicted_rainfall_mm} mm
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
