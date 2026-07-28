import React from "react";
import {
  Activity,
  ShieldAlert,
  TriangleAlert,
  Bug,
  Siren,
  PieChart,
  LineChart,
  BarChart3,
  ListTree,
  SlidersHorizontal,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import "./Dashboard.css";


export default function Dashboard() {
  return (
    <DashboardLayout pageTitle="Overview">
      {/* ---- Filters row  */}
      <section className="filters-placeholder" aria-label="Filters">
        <SlidersHorizontal size={16} />
        <span>Filters — Severity · Date range · Event type · IP address</span>
        <span className="placeholder-tag"></span>
      </section>

      {/* ---- KPI cards : plug in here */}
      <section className="kpi-grid" aria-label="Key metrics">
        <KpiPlaceholder
          icon={Activity}
          label="Total Events"
          value="18,204"
          tone="cyan"
        />
        <KpiPlaceholder
          icon={ShieldAlert}
          label="Critical Threats"
          value="27"
          tone="critical"
        />
        <KpiPlaceholder
          icon={TriangleAlert}
          label="High Severity Alerts"
          value="93"
          tone="high"
        />
        <KpiPlaceholder
          icon={Bug}
          label="Vulnerabilities"
          value="341"
          tone="medium"
        />
        <KpiPlaceholder
          icon={Siren}
          label="Active Incidents"
          value="6"
          tone="critical"
        />
      </section>

      {/* ---- Charts :  plug in here ---- */}
      <section className="charts-grid" aria-label="Analytics">
        <ChartPlaceholder
          icon={PieChart}
          title="Threat Distribution"
          note="Pie chart · GET /threats"
        />
        <ChartPlaceholder
          icon={LineChart}
          title="Event Trend"
          note="Line chart · GET /events"
        />
        <ChartPlaceholder
          icon={BarChart3}
          title="Top Attack Types"
          note="Bar chart · GET /threats"
        />
      </section>

      {/* ---- Table : plug in here ---- */}
      <section className="table-placeholder" aria-label="Security events table">
        <div className="panel-header">
          <ListTree size={17} />
          <h2>Security Events</h2>
          <span className="placeholder-tag"></span>
        </div>
        <p className="panel-note">
          Time · Event Type · Severity · Source IP · Status — with search,
          sorting &amp; pagination, connected to{" "}
          <code>GET /events</code>.
        </p>
      </section>
    </DashboardLayout>
  );
}

function KpiPlaceholder({ icon: Icon, label, value, tone }) {
  return (
    <div className={`kpi-card tone-${tone}`}>
      <div className="kpi-icon">
        <Icon size={18} />
      </div>
      <div className="kpi-body">
        <span className="kpi-value">{value}</span>
        <span className="kpi-label">{label}</span>
      </div>
    </div>
  );
}

function ChartPlaceholder({ icon: Icon, title, note }) {
  return (
    <div className="chart-card">
      <div className="panel-header">
        <Icon size={17} />
        <h2>{title}</h2>
      </div>
      <div className="chart-canvas-placeholder">
        <Icon size={34} strokeWidth={1.3} />
        <span>{note}</span>
      </div>
    </div>
  );
}
