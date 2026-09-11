import React, { useState } from "react";
import { submitCommunityReport } from "@/lib/api";
import { CommunityReport } from "@/types";
import { MapPin, AlertTriangle, CheckCircle2, X, Loader2, Send } from "lucide-react";

interface CommunityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  clickedCoords?: { lat: number; lon: number } | null;
  onReportSubmitted: () => void;
}

export default function CommunityReportModal({
  isOpen,
  onClose,
  clickedCoords,
  onReportSubmitted,
}: CommunityReportModalProps) {
  const [reporterName, setReporterName] = useState("");
  const [contact, setContact] = useState("");
  const [hazardType, setHazardType] = useState("Active Rockfall / Shooting Stones");
  const [severity, setSeverity] = useState<"Minor" | "Moderate" | "Critical">("Moderate");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [lat, setLat] = useState<number>(() => {
    if (typeof clickedCoords?.lat === "number" && !Number.isNaN(clickedCoords.lat)) {
      return clickedCoords.lat;
    }
    return 30.2451;
  });
  const [lon, setLon] = useState<number>(() => {
    if (typeof clickedCoords?.lon === "number" && !Number.isNaN(clickedCoords.lon)) {
      return clickedCoords.lon;
    }
    return 78.8920;
  });
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync coords when clicked
  React.useEffect(() => {
    if (clickedCoords) {
      if (typeof clickedCoords.lat === "number" && !Number.isNaN(clickedCoords.lat)) {
        setLat(clickedCoords.lat);
      }
      if (typeof clickedCoords.lon === "number" && !Number.isNaN(clickedCoords.lon)) {
        setLon(clickedCoords.lon);
      }
    }
  }, [clickedCoords]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !locationName) {
      setError("Please describe the hazard location and status.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload: CommunityReport = {
        reporter_name: reporterName || "Mountain Commuter",
        contact,
        hazard_type: hazardType,
        severity,
        description,
        location_name: locationName,
        lat,
        lon,
        photo_url: photoUrl || undefined,
      };
      await submitCommunityReport(payload);
      setSubmitted(true);
      onReportSubmitted();
    } catch (err: any) {
      setError("Failed to register incident. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Crowdsourced Hazard Incident Report</h3>
            <p className="text-xs text-slate-400">Pin rockfalls, road cracks, or debris directly to the early-warning network</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Incident Broadcasted!</h4>
            <p className="text-xs text-slate-300">
              Your report has been logged and pinned on the 3D globe. Nearby commuters and response teams have been alerted.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Hazard Category</label>
                <select
                  value={hazardType}
                  onChange={(e) => setHazardType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white cursor-pointer"
                >
                  <option>Active Rockfall / Shooting Stones</option>
                  <option>Severe Road Cracks / Subsidence</option>
                  <option>Debris Flow / Mudslide</option>
                  <option>Retaining Wall Failure</option>
                  <option>River Toe Scour</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Estimated Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white cursor-pointer"
                >
                  <option value="Minor">Minor (Caution / Debris on shoulder)</option>
                  <option value="Moderate">Moderate (Single lane blocked)</option>
                  <option value="Critical">Critical (Complete road closure)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Location Landmark / Kilometer Milestone</label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. NH-58 Sirobagarh km 124 near tunnel portal"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={Number.isNaN(lat) ? "" : lat}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setLat(Number.isNaN(val) ? 0 : val);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 font-mono text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={Number.isNaN(lon) ? "" : lon}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setLon(Number.isNaN(val) ? 0 : val);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 font-mono text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Incident Description & Transit Status</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe slide width, ongoing boulder movements, weather, and vehicular backup..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Reporter Name / Affiliation</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. BRO Patrol / Taxi Operator"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Photo Reference URL (Optional)</label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-600/30 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Publish Hazard Pin to Live Map Network
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
