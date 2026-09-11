# 🏔️ GrahRaksha

### AI Landslide Early Prediction & Warning System

> **Predict. Monitor. Warn. Protect.**

GrahRaksha is an AI-powered **landslide early prediction and warning platform** designed to help identify, analyze, and monitor landslide-prone regions before they become critical.

The platform combines **AI/ML prediction, geospatial intelligence, geotechnical analysis, weather data, 3D terrain visualization, route risk assessment, and geofenced alerts** into a single interactive dashboard.

Built around the requirements of **Smart India Hackathon – Problem Statement SIH26001**, GrahRaksha focuses on improving disaster preparedness and situational awareness for vulnerable mountainous and hilly regions.

---

## 🚨 Key Features

### 🌍 3D Globe & Corridor Monitoring

* Interactive 3D terrain and geographic visualization
* Real-time hazard visualization
* Landslide-prone corridor monitoring
* Interactive hazard selection
* Route and corridor risk assessment

### 🤖 AI Landslide Prediction

* Multi-model landslide susceptibility analysis
* Interactive prediction simulator
* Geotechnical factor-of-safety calculations
* Terrain and environmental parameter analysis
* Risk scoring and classification

### 🗺️ Assam & North-East GIS Analytics

* Dedicated Assam & North-Eastern Region dashboard
* Geospatial hazard analysis
* Landslide hotspot visualization
* Regional analytics and risk assessment

### 🌦️ Weather & Saturation Timeline

* Historical and forecast-oriented timeline
* Weather-driven landslide risk analysis
* Soil saturation monitoring
* Timeline ranging from **-24 hours to +72 hours**

### ⚠️ 72-Hour Threat Matrix

* Threat assessment over the next 72 hours
* Hazard prioritization
* Risk-level visualization
* Early identification of potentially critical areas

### 📍 25 km Geofenced Alerts

* Location-based hazard monitoring
* Configurable 25 km alert zones
* User location/geospatial awareness
* Early-warning notification workflow

### 👥 Community Hazard Reporting

* Crowd-sourced hazard reporting
* Map-based incident reporting
* Community-generated ground intelligence
* Reported hazards can feed back into the monitoring workflow

### 🧠 AI Advisor

* AI-assisted risk interpretation
* Natural-language interaction with the platform
* Helps users understand hazard and prediction information

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      User / Admin    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   GrahRaksha Web UI  │
                    │   React + Tailwind   │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
       ┌───────────┐    ┌────────────┐    ┌──────────────┐
       │ 3D GIS    │    │ AI/ML      │    │ Weather &    │
       │ Mapping   │    │ Prediction │    │ Environment  │
       └─────┬─────┘    └─────┬──────┘    └──────┬───────┘
             │                │                   │
             └────────────────┼───────────────────┘
                              ▼
                    ┌──────────────────────┐
                    │ Risk & Threat Engine │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
       ┌───────────┐     ┌────────────┐    ┌────────────┐
       │ Geofence  │     │ Threat     │    │ Community  │
       │ Alerts    │     │ Matrix     │    │ Reports    │
       └───────────┘     └────────────┘    └────────────┘
```

---

## 🖥️ Dashboard Modules

GrahRaksha provides four major operational views:

| Module                      | Purpose                                                 |
| --------------------------- | ------------------------------------------------------- |
| 🌍 **3D Globe & Corridors** | Monitor terrain, hazards and transportation corridors   |
| 🏔️ **Assam & NER GIS**     | Analyze regional landslide hotspots and geospatial data |
| 🎛️ **ML Simulator**        | Experiment with prediction and geotechnical parameters  |
| 🛡️ **72h Threat Matrix**   | Analyze upcoming hazards and prioritize threats         |

---

## 🛠️ Technology Stack

### Frontend

* **React 19**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Lucide React**
* **Motion**

### Geospatial Visualization

* **CesiumJS**
* 3D globe and terrain visualization
* Interactive geographic coordinates
* Hazard and corridor mapping

### Backend

* **Node.js**
* **Express**
* **TypeScript**
* **tsx**

### AI

* **Google Gemini API**
* Server-side AI integration
* AI-assisted risk analysis and advisory features

### Build & Development

* Vite
* TypeScript
* esbuild
* dotenv

The repository's package configuration confirms the React/Vite frontend, Express backend, Google GenAI integration, Tailwind, Motion and Lucide dependencies.

---

## 📂 Project Structure

```text
GiriRaksha/
│
├── .github/
├── server/
├── src/
│   ├── components/
│   ├── lib/
│   └── ...
│
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── server.ts
├── tsconfig.json
└── vite.config.ts
```

The application entry point loads the React application through `src/main.tsx`, while the project uses `server.ts` for its server-side functionality.

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/prxtyushaggarwal/GiriRaksha.git
cd GiriRaksha
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file based on `.env.example`.

```bash
cp .env.example .env
```

Add the required API credentials/configuration to the environment file.

### 4. Start the development server

```bash
npm run dev
```

The project's development script runs the TypeScript server using `tsx`.

---

## 🏭 Production Build

Build the complete application using:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

Type checking can be performed with:

```bash
npm run lint
```

---

## 🔐 Environment Variables

Do **not** commit API keys or other secrets to GitHub.

Use the provided:

```text
.env.example
```

as the template for your local `.env` configuration.

---

## 🎯 Problem Statement

Landslides pose a major threat to communities, roads, infrastructure and transportation corridors in mountainous regions.

Traditional monitoring systems can be fragmented across weather information, terrain analysis, geological conditions and incident reports.

GrahRaksha aims to bring these signals together into a unified platform that can:

**Detect → Analyze → Predict → Alert → Assist**

This can help authorities, infrastructure teams and communities make faster and more informed decisions during periods of elevated landslide risk.

---

## 🚀 Future Scope

Potential future improvements include:

* 📡 Integration with real-time IoT soil sensors
* 🛰️ Satellite-based terrain change detection
* 🌧️ Real-time rainfall and soil-moisture feeds
* 🧠 Improved ML model training using historical landslide datasets
* 📱 Mobile emergency-warning application
* 🗺️ Expanded coverage across Himalayan and North-Eastern regions
* 🔔 SMS/WhatsApp emergency notification integration
* 🚑 Emergency-response route optimization
* 📊 Advanced historical risk analytics
* ☁️ Scalable cloud deployment

---

## 🏆 Smart India Hackathon

**Event:** Smart India Hackathon 2026
**Problem Statement:** SIH26001
**Domain:** Disaster Management / Artificial Intelligence / Geospatial Intelligence

---

## ⚠️ Disclaimer

GrahRaksha is a technology demonstration and decision-support platform.

Predictions and risk assessments should not be treated as a substitute for official emergency-management agencies, geological surveys, or professional engineering assessments.

---

## 🤝 Contributing

Contributions, ideas and improvements are welcome.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit your changes
5. Open a Pull Request

---

## 📜 License

Add the appropriate project license here before publishing the project publicly.

---

## ⭐ Support

If you find GrahRaksha useful or interesting, consider giving the repository a ⭐ on GitHub.

**Built with technology, geospatial intelligence and AI to make landslide preparedness smarter.**
