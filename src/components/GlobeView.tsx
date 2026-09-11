import React, { useEffect, useRef, useState } from "react";
import { HazardItem, RouteSampleResult, Corridor } from "@/types";
import { Globe, Map, LocateFixed, Mountain, Activity, Layers, Navigation, ChevronRight, AlertTriangle } from "lucide-react";

interface GlobeViewProps {
  hazards: HazardItem[];
  selectedHazard: HazardItem | null;
  onSelectHazard: (h: HazardItem | null) => void;
  routeResult: RouteSampleResult | null;
  onMapClick?: (lat: number, lon: number) => void;
  corridors?: Record<string, Corridor>;
  selectedCorridorKey?: string;
  onSelectCorridor?: (key: string) => void;
}

// Optional custom Cesium token (if provided in environment variables)
const CUSTOM_CESIUM_ION_TOKEN = ((import.meta as any).env?.VITE_CESIUM_ION_TOKEN || "").trim();

export default function GlobeView({
  hazards,
  selectedHazard,
  onSelectHazard,
  routeResult,
  onMapClick,
  corridors,
  selectedCorridorKey,
  onSelectCorridor,
}: GlobeViewProps) {
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [cesiumLoaded, setCesiumLoaded] = useState(false);
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const corridorPolylinesRef = useRef<any[]>([]);
  const routePolylineRef = useRef<any>(null);

  // Load Cesium dynamically from CDN if not already loaded from index.html
  useEffect(() => {
    if (typeof window === "undefined") return;

    const setupCesiumToken = (cesiumObj: any) => {
      try {
        if (CUSTOM_CESIUM_ION_TOKEN && CUSTOM_CESIUM_ION_TOKEN.length > 20) {
          cesiumObj.Ion.defaultAccessToken = CUSTOM_CESIUM_ION_TOKEN;
        } else {
          // Clear any default token to prevent automatic unauthorized requests to api.cesium.com
          cesiumObj.Ion.defaultAccessToken = "";
        }
      } catch (_) {}
    };

    if ((window as any).Cesium) {
      setupCesiumToken((window as any).Cesium);
      setCesiumLoaded(true);
      return;
    }

    const checkInterval = setInterval(() => {
      if ((window as any).Cesium) {
        setupCesiumToken((window as any).Cesium);
        setCesiumLoaded(true);
        clearInterval(checkInterval);
      }
    }, 300);

    const timer = setTimeout(() => {
      clearInterval(checkInterval);
      if (!(window as any).Cesium) {
        console.warn("Cesium load timeout; defaulting to 2D tactical terrain canvas.");
        setViewMode("2d");
      }
    }, 4500);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timer);
    };
  }, []);

  // Initialize Cesium Viewer
  useEffect(() => {
    if (!cesiumLoaded || viewMode !== "3d" || !cesiumContainerRef.current) return;
    const Cesium = (window as any).Cesium;
    if (!Cesium) return;

    try {
      if (!viewerRef.current) {
        if (CUSTOM_CESIUM_ION_TOKEN && CUSTOM_CESIUM_ION_TOKEN.length > 20) {
          Cesium.Ion.defaultAccessToken = CUSTOM_CESIUM_ION_TOKEN;
        } else {
          Cesium.Ion.defaultAccessToken = "";
        }

        // Token-free open tile provider
        let imageryProvider;
        try {
          imageryProvider = new Cesium.UrlTemplateImageryProvider({
            url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            maximumLevel: 19,
            credit: "© OpenStreetMap contributors",
          });
        } catch (_) {
          try {
            imageryProvider = new Cesium.OpenStreetMapImageryProvider({
              url: "https://tile.openstreetmap.org/",
            });
          } catch (_) {
            imageryProvider = undefined;
          }
        }

        // Use offline WGS84 Ellipsoid terrain (no network token request needed)
        const terrainProvider = new Cesium.EllipsoidTerrainProvider();

        const viewer = new Cesium.Viewer(cesiumContainerRef.current, {
          imageryProvider,
          terrainProvider,
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          infoBox: false,
          selectionIndicator: false,
          timeline: false,
          animation: false,
          navigationHelpButton: false,
          sceneModePicker: false,
          fullscreenButton: false,
        });

        // Focus camera on Indian Himalayas
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(78.5, 30.5, 1200000),
          duration: 1.5,
        });

        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((click: any) => {
          const pickedObject = viewer.scene.pick(click.position);
          if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.hazardData) {
            onSelectHazard(pickedObject.id.hazardData);
          } else if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.corridorKey) {
            if (onSelectCorridor) onSelectCorridor(pickedObject.id.corridorKey);
          } else {
            const ray = viewer.camera.getPickRay(click.position);
            const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if (cartesian) {
              const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
              if (cartographic) {
                const lon = Cesium.Math.toDegrees(cartographic.longitude);
                const lat = Cesium.Math.toDegrees(cartographic.latitude);
                if (typeof lat === "number" && !Number.isNaN(lat) && typeof lon === "number" && !Number.isNaN(lon)) {
                  if (onMapClick) onMapClick(Number(lat.toFixed(4)), Number(lon.toFixed(4)));
                }
              }
            }
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        viewerRef.current = viewer;
      }
    } catch (e) {
      console.warn("Error initializing Cesium viewer:", e);
      setViewMode("2d");
    }

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        try {
          viewerRef.current.destroy();
          viewerRef.current = null;
        } catch (_) {}
      }
    };
  }, [cesiumLoaded, viewMode]);

  // Render All Corridors as glowing polylines on 3D Globe
  useEffect(() => {
    const viewer = viewerRef.current;
    const Cesium = (window as any).Cesium;
    if (!viewer || !Cesium || viewMode !== "3d" || !corridors) return;

    // Clear old corridor lines
    corridorPolylinesRef.current.forEach((e) => viewer.entities.remove(e));
    corridorPolylinesRef.current = [];

    const corridorColors: Record<string, string> = {
      "NH-58": "#38bdf8", // Sky blue
      "NH-107": "#a855f7", // Purple
      "NH-44": "#f59e0b", // Amber
      "NH-5": "#ef4444", // Red
      "NH-10": "#ec4899", // Pink
      "NH-27": "#10b981", // Emerald
      "NH-766": "#06b6d4", // Cyan
    };

    Object.entries(corridors).forEach(([key, corr]) => {
      if (!corr.waypoints || corr.waypoints.length < 2) return;

      const positions = corr.waypoints.map((wp) =>
        Cesium.Cartesian3.fromDegrees(wp.lon, wp.lat, (wp.elevation_m || 800) + 120)
      );

      const isSelected = selectedCorridorKey === key;
      const colorHex = corridorColors[key] || "#0284c7";
      const color = Cesium.Color.fromCssColorString(colorHex);

      const entity = viewer.entities.add({
        name: corr.name,
        polyline: {
          positions,
          width: isSelected ? 6 : 3,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: isSelected ? 0.35 : 0.15,
            color,
          }),
        },
      });
      entity.corridorKey = key;
      corridorPolylinesRef.current.push(entity);
    });
  }, [corridors, selectedCorridorKey, cesiumLoaded, viewMode]);

  // Update Cesium Hazard Markers
  useEffect(() => {
    const viewer = viewerRef.current;
    const Cesium = (window as any).Cesium;
    if (!viewer || !Cesium || viewMode !== "3d") return;

    markersRef.current.forEach((e) => viewer.entities.remove(e));
    markersRef.current = [];

    hazards.forEach((h) => {
      let pinColor = Cesium.Color.fromCssColorString("#ef4444");
      if (h.severity === "High") pinColor = Cesium.Color.fromCssColorString("#f97316");
      if (h.severity === "Moderate") pinColor = Cesium.Color.fromCssColorString("#f59e0b");
      if (h.severity === "Low") pinColor = Cesium.Color.fromCssColorString("#22c55e");

      const entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(h.lon, h.lat, 1500),
        point: {
          pixelSize: h.severity === "Severe" ? 18 : 13,
          color: pinColor,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
        },
        label: {
          text: `${h.title}\n[Risk: ${h.risk_score}]`,
          font: "12px sans-serif",
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -28),
          scale: 0.85,
        },
      });
      entity.hazardData = h;
      markersRef.current.push(entity);
    });
  }, [hazards, cesiumLoaded, viewMode]);

  // Update Active Route Polyline in Cesium
  useEffect(() => {
    const viewer = viewerRef.current;
    const Cesium = (window as any).Cesium;
    if (!viewer || !Cesium || viewMode !== "3d") return;

    if (routePolylineRef.current) {
      viewer.entities.remove(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    if (routeResult && routeResult.segments && routeResult.segments.length > 1) {
      const positions = routeResult.segments.map((seg) =>
        Cesium.Cartesian3.fromDegrees(seg.lon, seg.lat, (seg.elevation_m || 1000) + 150)
      );

      let lineColor = Cesium.Color.fromCssColorString("#22c55e");
      if (routeResult.verdict_badge === "Red") lineColor = Cesium.Color.fromCssColorString("#ef4444");
      else if (routeResult.verdict_badge === "Amber") lineColor = Cesium.Color.fromCssColorString("#f59e0b");

      routePolylineRef.current = viewer.entities.add({
        polyline: {
          positions,
          width: 6,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.4,
            color: lineColor,
          }),
        },
      });

      const mid = routeResult.segments[Math.floor(routeResult.segments.length / 2)];
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(mid.lon, mid.lat, 350000),
        duration: 1.5,
      });
    }
  }, [routeResult, cesiumLoaded, viewMode]);

  // Fly to selected hazard
  useEffect(() => {
    const viewer = viewerRef.current;
    const Cesium = (window as any).Cesium;
    if (!viewer || !Cesium || !selectedHazard || viewMode !== "3d") return;

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(selectedHazard.lon, selectedHazard.lat, 45000),
      duration: 1.2,
    });
  }, [selectedHazard, viewMode]);

  // Fly to selected corridor
  useEffect(() => {
    const viewer = viewerRef.current;
    const Cesium = (window as any).Cesium;
    if (!viewer || !Cesium || !selectedCorridorKey || !corridors || viewMode !== "3d") return;

    const corr = corridors[selectedCorridorKey];
    if (corr && corr.waypoints && corr.waypoints.length > 0) {
      const mid = corr.waypoints[Math.floor(corr.waypoints.length / 2)];
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(mid.lon, mid.lat, 380000),
        duration: 1.4,
      });
    }
  }, [selectedCorridorKey, corridors, viewMode]);

  const flyToRegion = (lat: number, lon: number, alt = 1000000) => {
    if (viewerRef.current && (window as any).Cesium) {
      const Cesium = (window as any).Cesium;
      viewerRef.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, alt),
        duration: 1.4,
      });
    }
  };

  // 2D Tactical View Projection Helper
  // Extends from longitude 72E to 96.5E, latitude 8N to 36N
  const projectTo2D = (lat: number, lon: number) => {
    const minLon = 72.0;
    const maxLon = 96.5;
    const minLat = 9.0;
    const maxLat = 35.5;

    const x = ((lon - minLon) / (maxLon - minLon)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return {
      left: `${Math.max(4, Math.min(96, x))}%`,
      top: `${Math.max(4, Math.min(96, y))}%`,
      rawX: x,
      rawY: y,
    };
  };

  return (
    <div className="relative w-full h-full min-h-[540px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      {/* View Switcher Bar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 shadow-lg text-xs">
        <span className="text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          Engine:
        </span>
        <button
          onClick={() => setViewMode("3d")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
            viewMode === "3d"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          3D Cesium Globe
        </button>
        <button
          onClick={() => setViewMode("2d")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
            viewMode === "2d"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          2D Tactical Grid
        </button>
      </div>

      {/* Regional Camera Focus Buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-wrap items-center gap-1.5 max-w-[calc(100%-240px)] justify-end">
        <button
          onClick={() => flyToRegion(30.4, 78.9, 750000)}
          className="bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded-lg border border-slate-700 flex items-center gap-1 shadow-lg transition-all cursor-pointer"
          title="Fly to Uttarakhand Garhwal (NH-58, NH-107)"
        >
          <LocateFixed className="w-3 h-3 text-cyan-400" />
          Garhwal
        </button>
        <button
          onClick={() => flyToRegion(31.5, 77.8, 700000)}
          className="bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 text-amber-200 text-xs px-2 py-1 rounded-lg border border-amber-600/40 flex items-center gap-1 shadow-lg transition-all cursor-pointer"
          title="Fly to Kinnaur HP (NH-5)"
        >
          <LocateFixed className="w-3 h-3 text-amber-400" />
          Kinnaur
        </button>
        <button
          onClick={() => flyToRegion(33.3, 75.1, 700000)}
          className="bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 text-purple-200 text-xs px-2 py-1 rounded-lg border border-purple-600/40 flex items-center gap-1 shadow-lg transition-all cursor-pointer"
          title="Fly to Pir Panjal J&K (NH-44)"
        >
          <LocateFixed className="w-3 h-3 text-purple-400" />
          Pir Panjal
        </button>
        <button
          onClick={() => flyToRegion(27.1, 88.5, 650000)}
          className="bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 text-pink-200 text-xs px-2 py-1 rounded-lg border border-pink-600/40 flex items-center gap-1 shadow-lg transition-all cursor-pointer"
          title="Fly to Sikkim Teesta (NH-10)"
        >
          <LocateFixed className="w-3 h-3 text-pink-400" />
          Sikkim
        </button>
        <button
          onClick={() => flyToRegion(25.6, 92.8, 850000)}
          className="bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 text-emerald-300 text-xs px-2 py-1 rounded-lg border border-emerald-500/40 flex items-center gap-1 shadow-lg transition-all cursor-pointer"
          title="Fly to Assam & Dima Hasao (NH-27)"
        >
          <Mountain className="w-3 h-3 text-emerald-400" />
          Assam
        </button>
        <button
          onClick={() => flyToRegion(11.55, 76.05, 550000)}
          className="bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 text-cyan-300 text-xs px-2 py-1 rounded-lg border border-cyan-600/40 flex items-center gap-1 shadow-lg transition-all cursor-pointer"
          title="Fly to Wayanad Ghats (NH-766)"
        >
          <LocateFixed className="w-3 h-3 text-cyan-400" />
          Wayanad
        </button>
      </div>

      {/* 3D Cesium Container */}
      <div
        ref={cesiumContainerRef}
        className={`w-full h-full flex-1 ${viewMode === "3d" ? "block" : "hidden"}`}
      />

      {/* 2D Tactical View Grid */}
      {viewMode === "2d" && (
        <div
          onClick={(e) => {
            if (onMapClick) {
              const rect = e.currentTarget.getBoundingClientRect();
              const xNorm = (e.clientX - rect.left) / rect.width;
              const yNorm = (e.clientY - rect.top) / rect.height;
              const lat = 35.5 - yNorm * (35.5 - 9.0);
              const lon = 72.0 + xNorm * (96.5 - 72.0);
              if (typeof lat === "number" && !Number.isNaN(lat) && typeof lon === "number" && !Number.isNaN(lon)) {
                onMapClick(Number(lat.toFixed(4)), Number(lon.toFixed(4)));
              }
            }
          }}
          className="w-full h-full flex-1 bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center p-4 select-none cursor-crosshair"
        >
          {/* Topo Grid Overlay */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#38bdf815_1px,transparent_1px),linear-gradient(to_bottom,#38bdf815_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,#0284c715,transparent_70%)]" />

          {/* Regional Reference Labels */}
          <div className="absolute top-16 left-12 text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">
            [Himalayan Tectonic Collision Arc]
          </div>
          <div className="absolute top-24 right-16 text-[10px] font-mono font-bold tracking-widest text-emerald-500/60 uppercase">
            [Assam-Arakan / Barail Thrust Belt]
          </div>
          <div className="absolute bottom-20 left-16 text-[10px] font-mono font-bold tracking-widest text-amber-500/50 uppercase">
            [Western Ghats Escarpment]
          </div>

          {/* Render All Corridor Lines in 2D */}
          {corridors && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {Object.entries(corridors).map(([key, corr]) => {
                if (!corr.waypoints || corr.waypoints.length < 2) return null;
                const pts = corr.waypoints
                  .map((wp) => {
                    const pos = projectTo2D(wp.lat, wp.lon);
                    return `${pos.left} ${pos.top}`;
                  })
                  .join(", ");
                const isSelected = selectedCorridorKey === key;
                return (
                  <polyline
                    key={key}
                    fill="none"
                    stroke={isSelected ? "#38bdf8" : "#475569"}
                    strokeWidth={isSelected ? "3.5" : "1.5"}
                    strokeDasharray={isSelected ? "none" : "3 3"}
                    opacity={isSelected ? 0.95 : 0.6}
                    points={pts}
                  />
                );
              })}
            </svg>
          )}

          {/* Interactive Hazard Pins */}
          {hazards.map((h) => {
            const pos = projectTo2D(h.lat, h.lon);
            const isSelected = selectedHazard?.id === h.id;
            return (
              <div
                key={h.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHazard(h);
                }}
                style={{ left: pos.left, top: pos.top }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
              >
                <div
                  className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                    isSelected
                      ? "scale-125 ring-4 ring-cyan-400"
                      : "hover:scale-110"
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full ${
                      h.severity === "Severe"
                        ? "bg-rose-500 animate-pulse"
                        : h.severity === "High"
                        ? "bg-orange-500"
                        : "bg-amber-500"
                    }`}
                  />
                  <span
                    className={`absolute -inset-1 rounded-full opacity-40 animate-ping ${
                      h.severity === "Severe" ? "bg-rose-500" : "bg-amber-500"
                    }`}
                  />
                </div>

                {/* Tooltip on hover */}
                <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-slate-900/95 border border-slate-700 text-white text-[11px] p-2 rounded shadow-2xl whitespace-nowrap z-30 pointer-events-none">
                  <div className="font-bold text-cyan-400">{h.title}</div>
                  <div className="text-slate-300">
                    Risk: <strong className="text-rose-400">{h.risk_score}</strong> | Slope: {h.slope_deg}°
                  </div>
                  <div className="text-[9px] text-slate-400">{h.corridor}</div>
                </div>
              </div>
            );
          })}

          {/* Route Overlay in 2D */}
          {routeResult && routeResult.segments && routeResult.segments.length > 0 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <polyline
                fill="none"
                stroke={routeResult.verdict_badge === "Red" ? "#ef4444" : routeResult.verdict_badge === "Amber" ? "#f59e0b" : "#10b981"}
                strokeWidth="4"
                strokeDasharray="5 3"
                points={routeResult.segments
                  .map((s) => {
                    const pos = projectTo2D(s.lat, s.lon);
                    return `${pos.left} ${pos.top}`;
                  })
                  .join(", ")}
              />
            </svg>
          )}

          {/* Legend Card */}
          <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-lg border border-slate-800 text-[10px] space-y-1 z-10">
            <div className="font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-cyan-400" /> 2D Map Legend
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-300">Severe Hazard Zone (Risk &gt; 75)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-300">Caution / Moderate Risk (30-74)</span>
            </div>
            <div className="text-slate-500 pt-1 border-t border-slate-800">
              Click anywhere on map to simulate GPS point
            </div>
          </div>
        </div>
      )}

      {/* Selected Hazard Telemetry Overlay Drawer */}
      {selectedHazard && (
        <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-96 z-20 bg-slate-900/95 backdrop-blur-md border border-rose-500/40 rounded-xl p-4 shadow-2xl animate-fade-in">
          <div className="flex items-start justify-between border-b border-slate-800 pb-2 mb-3">
            <div>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                selectedHazard.severity === "Severe"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : selectedHazard.severity === "High"
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              }`}>
                {selectedHazard.severity} Hazard
              </span>
              <h4 className="text-sm font-bold text-white mt-1">{selectedHazard.title}</h4>
              <p className="text-xs text-slate-400">{selectedHazard.corridor}</p>
            </div>
            <button
              onClick={() => onSelectHazard(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Susceptibility Risk</span>
              <span className="text-sm font-bold text-rose-400">{selectedHazard.risk_score} / 100</span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Slope Angle</span>
              <span className="text-sm font-bold text-amber-300">{selectedHazard.slope_deg}°</span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Soil Saturation</span>
              <span className="text-sm font-bold text-cyan-300">{selectedHazard.soil_moisture_pct}%</span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">3-Day Rainfall</span>
              <span className="text-sm font-bold text-blue-400">{selectedHazard.rainfall_3d_mm} mm</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800 text-[11px] text-slate-300 mb-3">
            <strong className="text-amber-400 block mb-1">Status / Field Note:</strong>
            {selectedHazard.road_status}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Sensor: {selectedHazard.sensor_status}</span>
            <span>{selectedHazard.last_updated}</span>
          </div>
        </div>
      )}
    </div>
  );
}
