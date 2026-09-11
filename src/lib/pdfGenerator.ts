import { RouteSampleResult } from "@/types";

export function generateRouteRiskPdf(result: RouteSampleResult) {
  const printWindow = window.open("", "_blank", "width=850,height=900");
  if (!printWindow) {
    alert("Please allow popups to download or print the risk assessment report.");
    return;
  }

  const currentDate = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "medium",
  });

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GrahRaksha Route Risk Assessment Report - ${result.corridor_id || "Corridor"}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 40px;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.5;
    }
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand-sub {
      font-size: 12px;
      color: #64748b;
      margin-top: 4px;
    }
    .meta-box {
      text-align: right;
      font-size: 11px;
      color: #64748b;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
    }
    .stat-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      font-weight: 600;
    }
    .stat-value {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 4px;
    }
    .verdict-banner {
      padding: 14px;
      border-radius: 8px;
      margin-bottom: 24px;
      font-size: 13px;
      font-weight: 600;
    }
    .badge-Green {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }
    .badge-Amber {
      background: #fffbeb;
      color: #92400e;
      border: 1px solid #fde68a;
    }
    .badge-Red {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      font-size: 11px;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      text-align: left;
      padding: 8px 10px;
      font-weight: 700;
      border-bottom: 1px solid #cbd5e1;
    }
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #e2e8f0;
    }
    tr:nth-child(even) {
      background: #f8fafc;
    }
    .risk-pill {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 10px;
    }
    .footer {
      margin-top: 40px;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      font-size: 10px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body { margin: 15mm; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="brand-title">GRAHRAKSHA - TRANSIT CORRIDOR SAFETY CERTIFICATE</h1>
      <div class="brand-sub">Smart India Hackathon 2026 | PS SIH26001 Early-Warning Landslide System</div>
    </div>
    <div class="meta-box">
      <div><strong>Report Ref:</strong> GR-${Date.now().toString().slice(-6)}</div>
      <div><strong>Generated:</strong> ${currentDate}</div>
    </div>
  </div>

  <div class="verdict-banner badge-${result.verdict_badge}">
    <strong>OFFICIAL TRANSIT ADVISORY (${result.verdict_badge.toUpperCase()}):</strong> ${result.verdict}
  </div>

  <div class="summary-grid">
    <div class="stat-card">
      <div class="stat-label">Route Safety Score</div>
      <div class="stat-value" style="color: ${result.verdict_badge === "Green" ? "#10b981" : result.verdict_badge === "Amber" ? "#f59e0b" : "#ef4444"};">
        ${result.safety_score_pct}%
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Critical Hazard Nodes</div>
      <div class="stat-value" style="color: #ef4444;">${result.critical_hazard_points}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Warning Nodes</div>
      <div class="stat-value" style="color: #f59e0b;">${result.warning_hazard_points}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Sampled Terrain Points</div>
      <div class="stat-value">${result.total_sampled_points} Nodes</div>
    </div>
  </div>

  <h3 style="font-size: 14px; margin-bottom: 8px; color: #0f172a;">25-Point Geotechnical & Meteorological Terrain Breakdown</h3>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Waypoint / Sector</th>
        <th>Elevation</th>
        <th>Slope</th>
        <th>3-Day Rain</th>
        <th>Saturation</th>
        <th>Factor of Safety</th>
        <th>Risk Score</th>
      </tr>
    </thead>
    <tbody>
      ${result.segments
        .map(
          (s) => `
        <tr>
          <td><strong>${s.step_index}</strong></td>
          <td><strong>${s.location_name}</strong></td>
          <td>${s.elevation_m} m</td>
          <td>${s.slope_deg}°</td>
          <td>${s.rainfall_3d_mm} mm</td>
          <td>${s.soil_moisture_pct}%</td>
          <td>${s.factor_of_safety}</td>
          <td>
            <span class="risk-pill" style="background: ${s.color}20; color: ${s.color}; border: 1px solid ${s.color}60;">
              ${s.risk_score} / 100 (${s.risk_level})
            </span>
          </td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <div class="footer">
    <span>GrahRaksha AI Multi-Model Ensemble (Random Forest + XGBoost + Spatial CNN + LSTM)</span>
    <span>NDMA Emergency Helpline: 1078 | BRO Highway Desk: 1070</span>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
