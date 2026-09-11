import React, { useEffect, useState } from "react";
import {
  HazardItem,
  Corridor,
  RouteSampleResult,
  AssamAnalytics,
  WeatherTimelineStep,
} from "@/types";
import {
  fetchCorridors,
  fetchLiveHazards,
  fetchAssamAnalytics,
  fetchAssamHotspots,
  fetchWeatherTimeline,
} from "@/lib/api";

import GlobeView from "@/components/GlobeView";
import RoutePlanner from "@/components/RoutePlanner";
import WeatherTimelineScrubber from "@/components/WeatherTimelineScrubber";
import AssamAnalyticsView from "@/components/AssamAnalyticsView";
import PredictionStudio from "@/components/PredictionStudio";
import ThreatScannerMatrix from "@/components/ThreatScannerMatrix";
import AlertSubscribeModal from "@/components/AlertSubscribeModal";
import CommunityReportModal from "@/components/CommunityReportModal";
import AiAdvisorDrawer from "@/components/AiAdvisorDrawer";
import GitHubDeployModal from "@/components/GitHubDeployModal";

import {
  Mountain,
  ShieldAlert,
  Bell,
  MapPin,
  Bot,
  Activity,
  Layers,
  Sliders,
  Clock,
  Compass,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Github,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"map" | "assam" | "simulator" | "scanner">("map");

  const [corridors, setCorridors] = useState<Record<string, Corridor>>({});
  const [hazards, setHazards] = useState<HazardItem[]>([]);
  const [assamAnalytics, setAssamAnalytics] = useState<AssamAnalytics | null>(null);
  const [assamHotspots, setAssamHotspots] = useState<HazardItem[]>([]);
  const [weatherSteps, setWeatherSteps] = useState<WeatherTimelineStep[]>([]);
  const [activeWeatherIdx, setActiveWeatherIdx] = useState<number>(1); // 0h (Live)

  const [selectedHazard, setSelectedHazard] = useState<HazardItem | null>(null);
  const [selectedCorridorKey, setSelectedCorridorKey] = useState<string>("NH-58");
  const [activeRoute, setActiveRoute] = useState<RouteSampleResult | null>(null);
  const [clickedMapCoords, setClickedMapCoords] = useState<{ lat: number; lon: number } | null>(null);

  // Modals & Drawers
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  // Initial load
  const loadCoreData = async () => {
    try {
      const [corrData, hazData, assamData, assamSpots, wSteps] = await Promise.all([
        fetchCorridors().catch(() => ({})),
        fetchLiveHazards().catch(() => []),
        fetchAssamAnalytics().catch(() => null),
        fetchAssamHotspots().catch(() => []),
        fetchWeatherTimeline().catch(() => []),
      ]);

      setCorridors(corrData);
      setHazards(hazData);
      setAssamAnalytics(assamData);
      setAssamHotspots(assamSpots);
      setWeatherSteps(wSteps);
    } catch (e) {
      console.error("Data load error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoreData();
  }, []);

  const handleMapClick = (lat: number, lon: number) => {
    if (typeof lat === "number" && !Number.isNaN(lat) && typeof lon === "number" && !Number.isNaN(lon)) {
      setClickedMapCoords({ lat, lon });
    }
  };

  const handleSelectHotspotFromAssam = (h: HazardItem) => {
    setSelectedHazard(h);
    setActiveTab("map");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                  GrahRaksha
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    SIH PS 26001
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400">
                AI Landslide Early Prediction & Warning System | NDMA, BRO & ASDMA Integrated
              </p>
            </div>
          </div>

          {/* Navigation Views Switcher */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab("map")}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "map"
                  ? "bg-cyan-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-850"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              3D Globe & Corridors
            </button>
            <button
              onClick={() => setActiveTab("assam")}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "assam"
                  ? "bg-cyan-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-850"
              }`}
            >
              <Mountain className="w-3.5 h-3.5 text-emerald-400" />
              Assam & NER GIS
            </button>
            <button
              onClick={() => setActiveTab("simulator")}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "simulator"
                  ? "bg-cyan-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-850"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              ML Simulator
            </button>
            <button
              onClick={() => setActiveTab("scanner")}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "scanner"
                  ? "bg-cyan-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-850"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              72h Threat Matrix
            </button>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={() => setIsGitHubModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Fix GitHub Host Server & Deployment Guide"
            >
              <Github className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">GitHub Host</span> Sync / Fix
            </button>
            <button
              onClick={() => setIsAlertModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Configure 25km Geofenced Alerts"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">25km Geofence</span> Alerts
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Pin Live Hazard Incident"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Crowdsource</span> Report
            </button>
            <button
              onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              AI Advisor
            </button>
          </div>
        </div>
      </header>

      {/* Real-time Emergency Ticker Bar */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-1.5 text-xs flex items-center justify-between overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-rose-400 shrink-0">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            Live Critical Feeds:
          </div>
          <div className="overflow-x-auto scrollbar-none flex items-center gap-3 text-slate-300 text-[11px] whitespace-nowrap">
            {hazards.slice(0, 4).map((h) => (
              <button
                key={h.id}
                onClick={() => {
                  setSelectedHazard(h);
                  setActiveTab("map");
                }}
                className="hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="font-semibold text-white">[{h.corridor.split(" ")[0]}]:</span>
                <span>{h.title}</span>
                <span className="px-1.5 py-0.2 rounded font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px]">
                  {h.risk_score}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={loadCoreData}
            className="text-slate-400 hover:text-slate-200 shrink-0 ml-auto cursor-pointer"
            title="Refresh telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 flex flex-col gap-5">
        {/* VIEW 1: 3D Globe & Corridors */}
        {activeTab === "map" && (
          <div className="flex flex-col gap-5">
            {/* Top Row: 3D / 2D Globe + Route Corridor Planner */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Globe Column */}
              <div className="lg:col-span-8 flex flex-col min-h-[540px]">
                <GlobeView
                  hazards={hazards}
                  selectedHazard={selectedHazard}
                  onSelectHazard={setSelectedHazard}
                  routeResult={activeRoute}
                  onMapClick={handleMapClick}
                  corridors={corridors}
                  selectedCorridorKey={selectedCorridorKey}
                  onSelectCorridor={setSelectedCorridorKey}
                />
              </div>

              {/* Corridor Route Planner Column */}
              <div className="lg:col-span-4 flex flex-col">
                <RoutePlanner
                  corridors={corridors}
                  onRouteCalculated={setActiveRoute}
                  activeRoute={activeRoute}
                  selectedCorridorKey={selectedCorridorKey}
                  onSelectCorridorKey={setSelectedCorridorKey}
                />
              </div>
            </div>

            {/* Weather & Saturation Scrubber (-24h to +72h) */}
            <WeatherTimelineScrubber
              steps={weatherSteps}
              activeStepIndex={activeWeatherIdx}
              onSelectStep={setActiveWeatherIdx}
            />
          </div>
        )}

        {/* VIEW 2: Assam & North Eastern Region (NER) Geospatial Analytics */}
        {activeTab === "assam" && (
          <AssamAnalyticsView
            analytics={assamAnalytics}
            hotspots={assamHotspots}
            onSelectHotspot={handleSelectHotspotFromAssam}
          />
        )}

        {/* VIEW 3: Interactive Multi-Model Geotechnical Simulator */}
        {activeTab === "simulator" && (
          <PredictionStudio initialCoords={clickedMapCoords || undefined} />
        )}

        {/* VIEW 4: 72h Threat Matrix */}
        {activeTab === "scanner" && (
          <ThreatScannerMatrix />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/90 border-t border-slate-800 py-4 px-4 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">GrahRaksha Landslide Early-Warning System</span>
            <span>•</span>
            <span>Smart India Hackathon 2026 (Problem Statement SIH26001)</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>NDRF Emergency Helpline: <strong className="text-cyan-400">1078</strong></span>
            <span>BRO Highway Desk: <strong className="text-cyan-400">1070</strong></span>
            <span>ASDMA Control: <strong className="text-cyan-400">1079</strong></span>
          </div>
        </div>
      </footer>

      {/* Modals and Side Drawers */}
      <AlertSubscribeModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        defaultCoords={clickedMapCoords || (selectedHazard ? { lat: selectedHazard.lat, lon: selectedHazard.lon } : undefined)}
      />

      <CommunityReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        clickedCoords={clickedMapCoords}
        onReportSubmitted={() => {
          loadCoreData();
        }}
      />

      <AiAdvisorDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        activeCorridor={activeRoute?.corridor_id || selectedHazard?.corridor}
        selectedHazard={selectedHazard}
      />

      <GitHubDeployModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
    </div>
  );
}
