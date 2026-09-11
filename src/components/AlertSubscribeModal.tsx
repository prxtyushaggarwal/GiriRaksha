import React, { useState } from "react";
import { subscribeAlert, verifyAlertOtp, triggerDispatchCheck } from "@/lib/api";
import { Bell, ShieldCheck, Mail, KeyRound, CheckCircle2, AlertTriangle, Send, X, Loader2 } from "lucide-react";

interface AlertSubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCoords?: { lat: number; lon: number };
}

export default function AlertSubscribeModal({
  isOpen,
  onClose,
  defaultCoords,
}: AlertSubscribeModalProps) {
  const [step, setStep] = useState<"subscribe" | "verify" | "success">("subscribe");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [locationName, setLocationName] = useState("Sirobagarh / Himalayan Foothills");
  const [lat, setLat] = useState<number>(() => {
    if (typeof defaultCoords?.lat === "number" && !Number.isNaN(defaultCoords.lat)) {
      return defaultCoords.lat;
    }
    return 30.2451;
  });
  const [lon, setLon] = useState<number>(() => {
    if (typeof defaultCoords?.lon === "number" && !Number.isNaN(defaultCoords.lon)) {
      return defaultCoords.lon;
    }
    return 78.8920;
  });
  const [radiusKm, setRadiusKm] = useState(25.0);
  const [otpCode, setOtpCode] = useState("");
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dispatchResult, setDispatchResult] = useState<any | null>(null);

  React.useEffect(() => {
    if (defaultCoords) {
      if (typeof defaultCoords.lat === "number" && !Number.isNaN(defaultCoords.lat)) {
        setLat(defaultCoords.lat);
      }
      if (typeof defaultCoords.lon === "number" && !Number.isNaN(defaultCoords.lon)) {
        setLon(defaultCoords.lon);
      }
    }
  }, [defaultCoords]);

  if (!isOpen) return null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await subscribeAlert({
        email,
        phone,
        lat,
        lon,
        location_name: locationName,
        radius_km: radiusKm,
      });
      if (res.dev_otp_preview) {
        setDevOtpHint(res.dev_otp_preview);
      }
      setStep("verify");
    } catch (err: any) {
      setError(err.message || "Subscription failed. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;
    setLoading(true);
    setError(null);
    try {
      await verifyAlertOtp(email, otpCode);
      setStep("success");
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleTestDispatch = async () => {
    setLoading(true);
    try {
      const res = await triggerDispatchCheck(lat, lon);
      setDispatchResult(res);
    } catch (err: any) {
      setError("Failed to trigger test dispatch.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Geofenced Email Early-Warning</h3>
            <p className="text-xs text-slate-400">Automated 25 km hazard triggers with SHA-256 OTP</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Registration */}
        {step === "subscribe" && (
          <form onSubmit={handleSubscribe} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Email Address (for High-Priority Alerts)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="commuter@mountainroads.in"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Mobile Phone (Optional SMS / WhatsApp)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91-9876543210"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
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
              <label className="block font-semibold text-slate-300 mb-1">Geofence Early Warning Radius: {Number.isNaN(radiusKm) ? 25 : radiusKm} km</label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={Number.isNaN(radiusKm) ? 25 : radiusKm}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setRadiusKm(Number.isNaN(val) ? 25 : val);
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-600/30 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send 6-Digit SHA-256 Verification Code
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === "verify" && (
          <form onSubmit={handleVerify} className="space-y-4 text-xs">
            <p className="text-slate-300">
              We dispatched a cryptographic verification token to <span className="text-cyan-400 font-mono">{email}</span>.
            </p>

            {devOtpHint && (
              <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                <span className="font-semibold block text-[11px] uppercase">Hackathon Demo Auto-Preview:</span>
                <span className="font-mono text-base font-bold tracking-widest">{devOtpHint}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Enter 6-Digit Verification Code</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.trim())}
                  placeholder="e.g. 482910"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white font-mono text-center tracking-widest text-lg placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Verify & Arm Early-Warning Network
            </button>
          </form>
        )}

        {/* STEP 3: Verified Status & Dispatch Simulator */}
        {step === "success" && (
          <div className="space-y-4 text-xs text-center">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">Subscription Active & Verified!</h4>
            <p className="text-slate-300">
              You are now enrolled in the automated early-warning network. Any active slide or pore-water spike within 25 km will trigger an automated emergency dispatch to <span className="text-cyan-400 font-mono">{email}</span>.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleTestDispatch}
                disabled={loading}
                className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Trigger Test 25 km Geofence Dispatch Simulation
              </button>
            </div>

            {dispatchResult && (
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-left font-mono text-[11px] text-slate-300 space-y-1">
                <span className="text-emerald-400 font-bold block">✓ Dispatch Simulated:</span>
                <div>Matched Subscribers: {dispatchResult.matched_count}</div>
                <div>Coordinates: {dispatchResult.target_coordinates?.lat}, {dispatchResult.target_coordinates?.lon}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
