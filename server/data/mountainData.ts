export interface CorridorData {
  name: string;
  state: string;
  region: string;
  danger_level: "Critical" | "Warning" | "Moderate" | "Safe";
  origin: { name: string; lat: number; lon: number };
  destination: { name: string; lat: number; lon: number };
  waypoints: Array<{
    name: string;
    lat: number;
    lon: number;
    elevation_m: number;
    slope_deg: number;
    rainfall_3d_mm?: number;
    rainfall_forecast_24h_mm?: number;
    soil_moisture_pct?: number;
  }>;
}

export const CORRIDORS: Record<string, CorridorData> = {
  "NH-58": {
    name: "NH-58 / Badrinath National Highway (Rishikesh - Joshimath - Mana)",
    state: "Uttarakhand",
    region: "Garhwal Himalayas",
    danger_level: "Critical",
    origin: { name: "Rishikesh", lat: 30.0869, lon: 78.2676 },
    destination: { name: "Badrinath / Mana Pass", lat: 30.7433, lon: 79.4938 },
    waypoints: [
      { name: "Rishikesh Valley Gateway", lat: 30.0869, lon: 78.2676, elevation_m: 372, slope_deg: 12 },
      { name: "Byasi Rapids", lat: 30.1245, lon: 78.4412, elevation_m: 450, slope_deg: 26 },
      { name: "Devprayag Sangam", lat: 30.1459, lon: 78.5989, elevation_m: 610, slope_deg: 38 },
      { name: "Srinagar Garhwal Basin", lat: 30.2224, lon: 78.7845, elevation_m: 560, slope_deg: 22 },
      { name: "Sirobagarh Chronic Slide Zone", lat: 30.2451, lon: 78.8920, elevation_m: 720, slope_deg: 54 },
      { name: "Rudraprayag Alaknanda Confluence", lat: 30.2844, lon: 78.9811, elevation_m: 895, slope_deg: 41 },
      { name: "Karnaprayag Gorge", lat: 30.2600, lon: 79.2170, elevation_m: 1450, slope_deg: 44 },
      { name: "Nandaprayag Cutting", lat: 30.3325, lon: 79.3245, elevation_m: 1350, slope_deg: 39 },
      { name: "Chamoli District Headquarter", lat: 30.4080, lon: 79.3320, elevation_m: 1550, slope_deg: 32 },
      { name: "Pipalkoti Fragile Scarp", lat: 30.4285, lon: 79.4290, elevation_m: 1339, slope_deg: 48 },
      { name: "Helang Subsidence Sector", lat: 30.5280, lon: 79.5120, elevation_m: 1530, slope_deg: 52 },
      { name: "Joshimath Town Ridge", lat: 30.5566, lon: 79.5667, elevation_m: 1890, slope_deg: 46 },
      { name: "Govindghat Valley Entry", lat: 30.6250, lon: 79.5580, elevation_m: 1828, slope_deg: 40 },
      { name: "Lambagar Glacial River Cutting", lat: 30.6890, lon: 79.5310, elevation_m: 2350, slope_deg: 51 },
      { name: "Pandukeshwar Outpost", lat: 30.6380, lon: 79.5440, elevation_m: 1920, slope_deg: 36 },
      { name: "Hanuman Chatti Transition", lat: 30.7020, lon: 79.5080, elevation_m: 2560, slope_deg: 45 },
      { name: "Badrinath Temple Valley", lat: 30.7433, lon: 79.4938, elevation_m: 3133, slope_deg: 30 }
    ]
  },
  "NH-107": {
    name: "NH-107 / Kedarnath Pilgrimage Highway (Rudraprayag - Guptkashi - Gaurikund)",
    state: "Uttarakhand",
    region: "Mandakini River Valley",
    danger_level: "Critical",
    origin: { name: "Rudraprayag", lat: 30.2844, lon: 78.9811 },
    destination: { name: "Gaurikund Base", lat: 30.6517, lon: 79.0272 },
    waypoints: [
      { name: "Rudraprayag Mandakini Junction", lat: 30.2844, lon: 78.9811, elevation_m: 895, slope_deg: 35 },
      { name: "Tilwara River Bank", lat: 30.3450, lon: 79.0120, elevation_m: 950, slope_deg: 28 },
      { name: "Agastyamuni Valley", lat: 30.3920, lon: 79.0280, elevation_m: 1000, slope_deg: 24 },
      { name: "Kund Switchback", lat: 30.4920, lon: 79.0520, elevation_m: 1150, slope_deg: 42 },
      { name: "Guptkashi Hill Terrace", lat: 30.5228, lon: 79.0772, elevation_m: 1319, slope_deg: 36 },
      { name: "Phata Helipad Sector", lat: 30.5750, lon: 79.0500, elevation_m: 1500, slope_deg: 44 },
      { name: "Sonprayag Debris Fan", lat: 30.6300, lon: 79.0150, elevation_m: 1820, slope_deg: 55 },
      { name: "Gaurikund Terminus", lat: 30.6517, lon: 79.0272, elevation_m: 1982, slope_deg: 50 }
    ]
  },
  "NH-27": {
    name: "NH-27 / Assam East-West Corridor (Guwahati - Haflong - Silchar)",
    state: "Assam",
    region: "Barail Hills & Dima Hasao",
    danger_level: "Critical",
    origin: { name: "Guwahati", lat: 26.1445, lon: 91.7362 },
    destination: { name: "Silchar (Barak Valley)", lat: 24.8333, lon: 92.7789 },
    waypoints: [
      { name: "Guwahati Brahmaputra Bank", lat: 26.1445, lon: 91.7362, elevation_m: 55, slope_deg: 8 },
      { name: "Nagaon Junction", lat: 26.3468, lon: 92.6840, elevation_m: 60, slope_deg: 12 },
      { name: "Lumding Foothills", lat: 25.8190, lon: 93.1700, elevation_m: 125, slope_deg: 24 },
      { name: "Maibang Hill Gorge", lat: 25.3020, lon: 93.1610, elevation_m: 350, slope_deg: 42 },
      { name: "Haflong Hill Station", lat: 25.1667, lon: 93.0167, elevation_m: 680, slope_deg: 48 },
      { name: "Jatinga Landslide Choke Point", lat: 25.1150, lon: 93.0450, elevation_m: 620, slope_deg: 56 },
      { name: "Harangajao Vulnerable Cutting", lat: 25.0120, lon: 92.8710, elevation_m: 210, slope_deg: 52 },
      { name: "Silchar Valley Entry", lat: 24.8333, lon: 92.7789, elevation_m: 30, slope_deg: 10 }
    ]
  },
  "NH-766": {
    name: "NH-766 / Kozhikode - Wayanad Ghats (Thamarassery Churam Corridor)",
    state: "Kerala",
    region: "Western Ghats",
    danger_level: "Critical",
    origin: { name: "Kozhikode (Calicut)", lat: 11.2588, lon: 75.7804 },
    destination: { name: "Sulthan Bathery (Wayanad)", lat: 11.6628, lon: 76.2570 },
    waypoints: [
      { name: "Adivaram Base Camp", lat: 11.4810, lon: 75.9890, elevation_m: 140, slope_deg: 18 },
      { name: "Hairpin 3 Fragile Scarp", lat: 11.5120, lon: 76.0120, elevation_m: 380, slope_deg: 46 },
      { name: "Hairpin 5 Active Rockfall Zone", lat: 11.5280, lon: 76.0240, elevation_m: 540, slope_deg: 55 },
      { name: "Hairpin 9 View Point", lat: 11.5380, lon: 76.0350, elevation_m: 720, slope_deg: 51 },
      { name: "Lakkidi Rainforest Crest", lat: 11.5150, lon: 76.0420, elevation_m: 700, slope_deg: 32 },
      { name: "Vythiri High Saturated Soil", lat: 11.5510, lon: 76.0410, elevation_m: 720, slope_deg: 40 },
      { name: "Chooralmala Debris Basin Sector", lat: 11.5320, lon: 76.1750, elevation_m: 850, slope_deg: 49 },
      { name: "Kalpetta District Hub", lat: 11.6050, lon: 76.0830, elevation_m: 780, slope_deg: 25 }
    ]
  },
  "NH-44": {
    name: "NH-44 (Jammu - Srinagar National Highway)",
    state: "Jammu & Kashmir",
    region: "Pir Panjal Range",
    danger_level: "Critical",
    origin: { name: "Jammu Tawi", lat: 32.7266, lon: 74.8570 },
    destination: { name: "Srinagar", lat: 34.0837, lon: 74.7973 },
    waypoints: [
      { name: "Jammu Tawi Gateway", lat: 32.7266, lon: 74.8570, elevation_m: 327, slope_deg: 10 },
      { name: "Udhampur Ridge", lat: 32.9250, lon: 75.1416, elevation_m: 756, slope_deg: 24 },
      { name: "Chenani-Nashri Tunnel Portal", lat: 33.0560, lon: 75.2910, elevation_m: 1200, slope_deg: 32 },
      { name: "Ramban Chenab Gorge", lat: 33.2428, lon: 75.2444, elevation_m: 1150, slope_deg: 43 },
      { name: "Mehar Shooting Stone Zone", lat: 33.2562, lon: 75.2415, elevation_m: 1180, slope_deg: 55 },
      { name: "Cafeteria Morh Slide", lat: 33.2710, lon: 75.2380, elevation_m: 1220, slope_deg: 58 },
      { name: "Digdol Chronic Rockfall Sector", lat: 33.3120, lon: 75.2010, elevation_m: 1350, slope_deg: 61 },
      { name: "Panthyal High Velocity Chute", lat: 33.3340, lon: 75.1900, elevation_m: 1420, slope_deg: 63 },
      { name: "Banihal Pass South Portal", lat: 33.4286, lon: 75.2033, elevation_m: 1730, slope_deg: 33 },
      { name: "Srinagar Valley Plain", lat: 34.0837, lon: 74.7973, elevation_m: 1585, slope_deg: 8 }
    ]
  },
  "NH-5": {
    name: "NH-5 (Hindustan-Tibet Road: Shimla - Kinnaur)",
    state: "Himachal Pradesh",
    region: "Kinnaur Himalayas",
    danger_level: "Critical",
    origin: { name: "Shimla", lat: 31.1048, lon: 77.1734 },
    destination: { name: "Reckong Peo / Spiti Entry", lat: 31.5395, lon: 78.2754 },
    waypoints: [
      { name: "Shimla Ridge", lat: 31.1048, lon: 77.1734, elevation_m: 2206, slope_deg: 25 },
      { name: "Narkanda Peak Pass", lat: 31.2590, lon: 77.4578, elevation_m: 2708, slope_deg: 32 },
      { name: "Rampur Bushahr Gorge", lat: 31.4497, lon: 77.6300, elevation_m: 1005, slope_deg: 38 },
      { name: "Jhakri Hydro Dam Flank", lat: 31.4920, lon: 77.7010, elevation_m: 1150, slope_deg: 45 },
      { name: "Nigulsari 2021 Landslide Scarp", lat: 31.5798, lon: 77.9890, elevation_m: 1780, slope_deg: 62 },
      { name: "Urni Overhanging Cliff", lat: 31.5420, lon: 78.1430, elevation_m: 1950, slope_deg: 59 },
      { name: "Karcham Sangam", lat: 31.5010, lon: 78.2160, elevation_m: 1800, slope_deg: 42 },
      { name: "Reckong Peo Sub-Divisional Post", lat: 31.5395, lon: 78.2754, elevation_m: 2290, slope_deg: 36 }
    ]
  },
  "NH-10": {
    name: "NH-10 (Siliguri - Gangtok Teesta Valley)",
    state: "West Bengal / Sikkim",
    region: "Eastern Himalayas",
    danger_level: "Critical",
    origin: { name: "Siliguri", lat: 26.7271, lon: 88.3953 },
    destination: { name: "Gangtok", lat: 27.3389, lon: 88.6065 },
    waypoints: [
      { name: "Siliguri Foothills Gateway", lat: 26.7271, lon: 88.3953, elevation_m: 125, slope_deg: 5 },
      { name: "Sevoke Coronation Bridge", lat: 26.8830, lon: 88.4730, elevation_m: 230, slope_deg: 33 },
      { name: "Kalijhora Rockslide Scarp", lat: 26.9380, lon: 88.4550, elevation_m: 310, slope_deg: 49 },
      { name: "29th Mile Chronic Subsidence Zone", lat: 27.0210, lon: 88.4350, elevation_m: 420, slope_deg: 58 },
      { name: "Teesta Bazaar Confluence", lat: 27.0650, lon: 88.4280, elevation_m: 210, slope_deg: 44 },
      { name: "Rangpo Sikkim Border Checkpoint", lat: 27.1770, lon: 88.5310, elevation_m: 330, slope_deg: 31 },
      { name: "Singtam River Terrace", lat: 27.2340, lon: 88.5020, elevation_m: 400, slope_deg: 36 },
      { name: "Gangtok Capital Ridge", lat: 27.3389, lon: 88.6065, elevation_m: 1650, slope_deg: 28 }
    ]
  }
};

export const REALTIME_HAZARDS = [
  {
    id: "HAZ-001",
    title: "Sirobagarh Chronic Debris Slide",
    corridor: "NH-58 Rishikesh-Badrinath km 124",
    state: "Uttarakhand",
    lat: 30.2451,
    lon: 78.8920,
    severity: "Severe" as const,
    risk_score: 92.4,
    slope_deg: 54.0,
    soil_moisture_pct: 94.0,
    rainfall_3d_mm: 185.0,
    rainfall_forecast_24h_mm: 78.0,
    sensor_status: "PIEZOMETER_TRIGGERED",
    displacement_rate_mm_hr: 4.8,
    road_status: "Single lane open under BRO supervision; heavy vehicle transit restricted.",
    last_updated: "10 mins ago"
  },
  {
    id: "HAZ-002",
    title: "Sonprayag Debris Funnel & Slope Creep",
    corridor: "NH-107 Rudraprayag-Kedarnath km 72",
    state: "Uttarakhand",
    lat: 30.6300,
    lon: 79.0150,
    severity: "Severe" as const,
    risk_score: 88.5,
    slope_deg: 55.0,
    soil_moisture_pct: 91.0,
    rainfall_3d_mm: 165.0,
    rainfall_forecast_24h_mm: 65.0,
    sensor_status: "INCLINOMETER_CRITICAL",
    displacement_rate_mm_hr: 3.2,
    road_status: "Active mudflow reported. Evacuation staging in progress at Sitapur.",
    last_updated: "25 mins ago"
  },
  {
    id: "HAZ-003",
    title: "Jatinga-Harangajao Vulnerable Cutting",
    corridor: "NH-27 East-West Corridor (Dima Hasao)",
    state: "Assam",
    lat: 25.1150,
    lon: 93.0450,
    severity: "Severe" as const,
    risk_score: 86.8,
    slope_deg: 56.0,
    soil_moisture_pct: 88.5,
    rainfall_3d_mm: 175.0,
    rainfall_forecast_24h_mm: 82.0,
    sensor_status: "ASDMA_SEOC_ALERT",
    displacement_rate_mm_hr: 2.9,
    road_status: "Cut-slope scarp sliding. Heavy boulders cleared by NDRF/PWD team.",
    last_updated: "35 mins ago"
  },
  {
    id: "HAZ-004",
    title: "Thamarassery Churam Hairpin 5 Overhang",
    corridor: "NH-766 Kozhikode-Wayanad Ghat",
    state: "Kerala",
    lat: 11.5280,
    lon: 76.0240,
    severity: "High" as const,
    risk_score: 74.2,
    slope_deg: 55.0,
    soil_moisture_pct: 86.0,
    rainfall_3d_mm: 140.0,
    rainfall_forecast_24h_mm: 45.0,
    sensor_status: "FIBER_OPTIC_STRAIN_ALERT",
    displacement_rate_mm_hr: 1.5,
    road_status: "Slow vehicular movement. Night travel restricted between 21:00 and 06:00.",
    last_updated: "1 hour ago"
  },
  {
    id: "HAZ-005",
    title: "Helang Fragile Scree Slope",
    corridor: "NH-58 km 242 (Joshimath approach)",
    state: "Uttarakhand",
    lat: 30.5280,
    lon: 79.5120,
    severity: "High" as const,
    risk_score: 71.0,
    slope_deg: 52.0,
    soil_moisture_pct: 79.0,
    rainfall_3d_mm: 125.0,
    rainfall_forecast_24h_mm: 38.0,
    sensor_status: "GEO_PHONE_ACTIVE",
    displacement_rate_mm_hr: 1.1,
    road_status: "Caution boards placed; spotters deployed at km 242 hairpin turn.",
    last_updated: "2 hours ago"
  },
  {
    id: "HAZ-006",
    title: "Chooralmala Debris Channel",
    corridor: "Meppadi-Chooralmala Hill Road",
    state: "Kerala",
    lat: 11.5320,
    lon: 76.1750,
    severity: "Severe" as const,
    risk_score: 89.0,
    slope_deg: 49.0,
    soil_moisture_pct: 95.0,
    rainfall_3d_mm: 210.0,
    rainfall_forecast_24h_mm: 90.0,
    sensor_status: "CRITICAL_PORE_PRESSURE",
    displacement_rate_mm_hr: 5.1,
    road_status: "Continuous surveillance; water level sensors monitoring uphill catchment.",
    last_updated: "15 mins ago"
  },
  {
    id: "HAZ-HP-02",
    title: "Nigulsari Rockfall & Debris Flow",
    corridor: "NH-5 Hindustan-Tibet Road km 168",
    state: "Himachal Pradesh",
    lat: 31.5798,
    lon: 77.9890,
    severity: "Severe" as const,
    risk_score: 93.2,
    slope_deg: 61.8,
    soil_moisture_pct: 91.2,
    rainfall_3d_mm: 185.0,
    rainfall_forecast_24h_mm: 75.0,
    sensor_status: "PIEZOMETER_SATURATION_SPIKE",
    displacement_rate_mm_hr: 6.8,
    road_status: "Red Alert: Night travel prohibited; continuous shooting stones observed.",
    last_updated: "5 mins ago"
  },
  {
    id: "HAZ-JK-03",
    title: "Panthyal-Mehar Shooting Stone Zone",
    corridor: "NH-44 Jammu-Srinagar km 148",
    state: "Jammu & Kashmir",
    lat: 33.3340,
    lon: 75.1900,
    severity: "High" as const,
    risk_score: 82.5,
    slope_deg: 63.0,
    soil_moisture_pct: 74.0,
    rainfall_3d_mm: 110.4,
    rainfall_forecast_24h_mm: 48.0,
    sensor_status: "ACOUSTIC_EMISSION_DETECTED",
    displacement_rate_mm_hr: 2.9,
    road_status: "Convoy escorted in batch intervals; steel protection shed maintained.",
    last_updated: "18 mins ago"
  },
  {
    id: "HAZ-SK-04",
    title: "29th Mile Teesta Gorge Slide",
    corridor: "NH-10 Siliguri-Gangtok km 29",
    state: "West Bengal / Sikkim",
    lat: 27.0210,
    lon: 88.4350,
    severity: "High" as const,
    risk_score: 78.4,
    slope_deg: 57.5,
    soil_moisture_pct: 84.0,
    rainfall_3d_mm: 164.2,
    rainfall_forecast_24h_mm: 62.0,
    sensor_status: "RIVER_TOE_EROSION_ELEVATED",
    displacement_rate_mm_hr: 3.1,
    road_status: "Heavy commercial vehicles diverted via Lava-Gorubathan route.",
    last_updated: "40 mins ago"
  },
  {
    id: "HAZ-AS-06",
    title: "Bongaigaon Valley Slip & Foothills Scarp",
    corridor: "Assam Foothills Corridor (Bongaigaon)",
    state: "Assam",
    lat: 26.4056,
    lon: 90.5785,
    severity: "Moderate" as const,
    risk_score: 58.0,
    slope_deg: 38.0,
    soil_moisture_pct: 69.5,
    rainfall_3d_mm: 88.0,
    rainfall_forecast_24h_mm: 34.0,
    sensor_status: "NORMAL_MONITORING",
    displacement_rate_mm_hr: 0.8,
    road_status: "Normal transit with cautionary 30 km/h speed limit on curve.",
    last_updated: "1 hour ago"
  }
];

export const THREAT_FORECAST_72H = [
  {
    region: "Garhwal Himalayas (Uttarakhand)",
    corridor: "NH-58 & NH-107",
    points: [
      { name: "Chamoli-Joshimath", lat: 30.5566, lon: 79.5667, h0_risk: 75, h24_risk: 86, h48_risk: 89, h72_risk: 72, predicted_rainfall_mm: 128 },
      { name: "Devprayag-Sirobagarh", lat: 30.2451, lon: 78.8920, h0_risk: 92, h24_risk: 95, h48_risk: 88, h72_risk: 72, predicted_rainfall_mm: 165 },
      { name: "Lambagar-Badrinath", lat: 30.6890, lon: 79.5310, h0_risk: 78, h24_risk: 88, h48_risk: 92, h72_risk: 75, predicted_rainfall_mm: 142 }
    ]
  },
  {
    region: "Kinnaur & Kullu High Belts (Himachal Pradesh)",
    corridor: "NH-5 & NH-3",
    points: [
      { name: "Nigulsari-Urni Scarp", lat: 31.5798, lon: 77.9890, h0_risk: 93, h24_risk: 96, h48_risk: 94, h72_risk: 80, predicted_rainfall_mm: 185 },
      { name: "Rampur-Jhakri Flank", lat: 31.4497, lon: 77.6300, h0_risk: 68, h24_risk: 80, h48_risk: 85, h72_risk: 65, predicted_rainfall_mm: 115 }
    ]
  },
  {
    region: "Pir Panjal & Ramban Sector (J&K)",
    corridor: "NH-44 Jammu-Srinagar",
    points: [
      { name: "Panthyal-Mehar Chute", lat: 33.3340, lon: 75.1900, h0_risk: 82, h24_risk: 89, h48_risk: 85, h72_risk: 70, predicted_rainfall_mm: 125 },
      { name: "Nashri-Ramban Cutting", lat: 33.2428, lon: 75.2444, h0_risk: 66, h24_risk: 78, h48_risk: 81, h72_risk: 64, predicted_rainfall_mm: 95 }
    ]
  },
  {
    region: "Teesta River Valley (Sikkim / West Bengal)",
    corridor: "NH-10 Siliguri-Gangtok",
    points: [
      { name: "Kalijhora to 29th Mile", lat: 27.0210, lon: 88.4350, h0_risk: 78, h24_risk: 88, h48_risk: 91, h72_risk: 74, predicted_rainfall_mm: 164 },
      { name: "Teesta Bazaar Slopes", lat: 27.0650, lon: 88.4280, h0_risk: 62, h24_risk: 76, h48_risk: 82, h72_risk: 68, predicted_rainfall_mm: 120 }
    ]
  },
  {
    region: "Dima Hasao & Barail Range (Assam)",
    corridor: "NH-27 East-West Corridor",
    points: [
      { name: "Jatinga-Haflong Sector", lat: 25.1150, lon: 93.0450, h0_risk: 86, h24_risk: 92, h48_risk: 96, h72_risk: 80, predicted_rainfall_mm: 185 },
      { name: "Harangajao Cutting", lat: 25.0120, lon: 92.8710, h0_risk: 84, h24_risk: 89, h48_risk: 94, h72_risk: 82, predicted_rainfall_mm: 190 },
      { name: "Bongaigaon Valley Slip", lat: 26.4056, lon: 90.5785, h0_risk: 58, h24_risk: 69, h48_risk: 74, h72_risk: 50, predicted_rainfall_mm: 88 }
    ]
  },
  {
    region: "Western Ghats Escarpment (Kerala)",
    corridor: "NH-766 Thamarassery Churam",
    points: [
      { name: "Hairpin Bend 5 Overhang", lat: 11.5280, lon: 76.0240, h0_risk: 74, h24_risk: 86, h48_risk: 82, h72_risk: 68, predicted_rainfall_mm: 145 },
      { name: "Chooralmala Debris Channel", lat: 11.5320, lon: 76.1750, h0_risk: 89, h24_risk: 94, h48_risk: 89, h72_risk: 75, predicted_rainfall_mm: 170 },
      { name: "Lakkidi Rainforest Crest", lat: 11.5150, lon: 76.0420, h0_risk: 58, h24_risk: 72, h48_risk: 70, h72_risk: 54, predicted_rainfall_mm: 98 }
    ]
  }
];
