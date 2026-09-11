import crypto from "crypto";

export interface Subscriber {
  id: number;
  email: string;
  phone?: string;
  lat: number;
  lon: number;
  location_name: string;
  radius_km: number;
  verified: boolean;
  created_at: string;
}

export interface CommunityReportRecord {
  id: number;
  reporter_name: string;
  contact?: string;
  hazard_type: string;
  severity: "Minor" | "Moderate" | "Critical";
  description: string;
  lat: number;
  lon: number;
  location_name: string;
  photo_url?: string;
  upvotes: number;
  status: string;
  created_at: string;
}

interface OtpRecord {
  email: string;
  token_hash: string;
  code: string;
  expires_at: number; // timestamp ms
  used: boolean;
}

const OTP_SALT = process.env.OTP_SALT || "GIRIRAKSHA_SIH_2026_SECRET_KEY";

class AlertStore {
  private subscribers: Map<string, Subscriber> = new Map();
  private reports: CommunityReportRecord[] = [];
  private otps: Map<string, OtpRecord> = new Map();
  private subIdCounter = 1;
  private repIdCounter = 1;

  constructor() {
    // Seed verified demonstration responder subscribers
    this.addDemonstrationSubscriber({
      email: "mountain.patrol@sih2026.gov.in",
      phone: "+91-9876543210",
      lat: 30.2451,
      lon: 78.8920,
      location_name: "Sirobagarh BRO Outpost",
      radius_km: 25.0,
      verified: true,
    });
    this.addDemonstrationSubscriber({
      email: "asdma.ner.control@assam.gov.in",
      phone: "+91-9435002222",
      lat: 25.1150,
      lon: 93.0450,
      location_name: "Jatinga Highway Watchstation",
      radius_km: 30.0,
      verified: true,
    });

    // Seed realistic community crowdsourced reports
    this.reports.push({
      id: this.repIdCounter++,
      reporter_name: "BRO Highway Patrol Unit 4",
      contact: "0135-2740444",
      hazard_type: "Active Rockfall / Shooting Stones",
      severity: "Critical",
      description: "Intermittent rockfall at Sirobagarh km 124. Heavy earthmover standing by. Maintain single-file convoy.",
      lat: 30.2451,
      lon: 78.8920,
      location_name: "NH-58 Sirobagarh km 124",
      upvotes: 8,
      status: "VERIFIED_BY_BRO_PATROL",
      created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    });
    this.reports.push({
      id: this.repIdCounter++,
      reporter_name: "Dima Hasao Hill Transport Union",
      contact: "dhtrans@gmail.com",
      hazard_type: "Severe Road Cracks / Subsidence",
      severity: "Moderate",
      description: "Transverse shear cracks along outer asphalt shoulder near Harangajao cutting. Heavy vehicles slowed.",
      lat: 25.0120,
      lon: 92.8710,
      location_name: "NH-27 Harangajao Sector",
      upvotes: 5,
      status: "VERIFIED_BY_COMMUNITY",
      created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    });
  }

  private addDemonstrationSubscriber(data: Omit<Subscriber, "id" | "created_at">) {
    const id = this.subIdCounter++;
    this.subscribers.set(data.email.toLowerCase(), {
      ...data,
      id,
      created_at: new Date().toISOString(),
    });
  }

  haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371.0;
    const dLat = ((lat2 - lat1) * Math.PI) / 180.0;
    const dLon = ((lon2 - lon1) * Math.PI) / 180.0;
    const a =
      Math.sin(dLat / 2.0) ** 2 +
      Math.cos((lat1 * Math.PI) / 180.0) *
        Math.cos((lat2 * Math.PI) / 180.0) *
        Math.sin(dLon / 2.0) ** 2;
    const c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
    return Number((R * c).toFixed(2));
  }

  generateSha256Otp(email: string): { code: string; token_hash: string } {
    const cleanEmail = email.toLowerCase().trim();
    const code = `${Math.floor(100000 + Math.random() * 900000)}`;
    const rawStr = `${cleanEmail}:${code}:${OTP_SALT}`;
    const token_hash = crypto.createHash("sha256").update(rawStr).digest("hex");
    const expires_at = Date.now() + 10 * 60 * 1000; // 10 minutes

    this.otps.set(cleanEmail, {
      email: cleanEmail,
      token_hash,
      code,
      expires_at,
      used: false,
    });

    return { code, token_hash };
  }

  verifySha256Otp(email: string, code: string): boolean {
    const cleanEmail = email.toLowerCase().trim();
    const rawStr = `${cleanEmail}:${code.trim()}:${OTP_SALT}`;
    const expectedHash = crypto.createHash("sha256").update(rawStr).digest("hex");

    const record = this.otps.get(cleanEmail);
    if (!record || record.used || record.token_hash !== expectedHash) {
      return false;
    }

    if (Date.now() > record.expires_at) {
      return false;
    }

    record.used = true;
    const sub = this.subscribers.get(cleanEmail);
    if (sub) {
      sub.verified = true;
    }
    return true;
  }

  upsertSubscriber(data: {
    email: string;
    phone?: string;
    lat: number;
    lon: number;
    location_name?: string;
    radius_km?: number;
  }): Subscriber {
    const cleanEmail = data.email.toLowerCase().trim();
    const existing = this.subscribers.get(cleanEmail);

    if (existing) {
      existing.lat = data.lat;
      existing.lon = data.lon;
      existing.location_name = data.location_name || existing.location_name;
      existing.radius_km = data.radius_km || existing.radius_km;
      if (data.phone) existing.phone = data.phone;
      return existing;
    }

    const newSub: Subscriber = {
      id: this.subIdCounter++,
      email: cleanEmail,
      phone: data.phone,
      lat: data.lat,
      lon: data.lon,
      location_name: data.location_name || "Mountain Transit Zone",
      radius_km: data.radius_km || 25.0,
      verified: false,
      created_at: new Date().toISOString(),
    };

    this.subscribers.set(cleanEmail, newSub);
    return newSub;
  }

  findSubscribersInGeofence(targetLat: number, targetLon: number, radiusKm = 25.0) {
    const matched: Array<{
      email: string;
      distance_km: number;
      location_name: string;
      phone?: string;
    }> = [];

    this.subscribers.forEach((sub) => {
      if (sub.verified) {
        const dist = this.haversineDistanceKm(targetLat, targetLon, sub.lat, sub.lon);
        const effectiveRadius = Math.max(radiusKm, sub.radius_km || 25.0);
        if (dist <= effectiveRadius) {
          matched.push({
            email: sub.email,
            distance_km: dist,
            location_name: sub.location_name,
            phone: sub.phone,
          });
        }
      }
    });

    return matched;
  }

  addCommunityReport(report: Omit<CommunityReportRecord, "id" | "upvotes" | "status" | "created_at">): CommunityReportRecord {
    const newRecord: CommunityReportRecord = {
      ...report,
      id: this.repIdCounter++,
      upvotes: 1,
      status: "VERIFIED_BY_COMMUNITY",
      created_at: new Date().toISOString(),
    };
    this.reports.unshift(newRecord);
    return newRecord;
  }

  getCommunityReports(): CommunityReportRecord[] {
    return this.reports;
  }
}

export const alertStore = new AlertStore();
