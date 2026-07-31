import React, { useEffect, useState } from "react";
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
import { getStats } from "../services/api";
import "./Dashboard.css";
import SecurityEventsTable from "../components/SecurityEventsTable";

/**
 * Dashboard (page)
 *
 * This is a WORKING DEMO of the dashboard layout so the shell can be
 * previewed/tested on its own. Everything inside the sections marked
 * "PLACEHOLDER" belongs to another teammate's task and should be
 * swapped for their real component — the layout/grid around it can
 * stay as-is since that's this task's job (Member 2).
 *
 *   Member 3 -> <KpiCards />         (replaces .kpi-grid contents)
 *   Member 4 -> <SecurityEventsTable /> (replaces .table-placeholder)
 *   Member 5 -> <ThreatPieChart />, <EventTrendLine />, <TopAttacksBar />
 *   Member 6 -> <FiltersBar />       (replaces .filters-placeholder)
 */
export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEvents: null,
    criticalThreats: null,
    highSeverityAlerts: null,
    vulnerabilities: null,
    activeIncidents: null,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const result = await getStats();
        if (!isMounted) return;

        setStats({
          totalEvents: result.totalEvents ?? result.total_events ?? 0,
          criticalThreats:
            result.criticalThreats ?? result.critical_threats ?? 0,
          highSeverityAlerts:
            result.highSeverityAlerts ?? result.high_severity_alerts ?? 0,
          vulnerabilities: result.vulnerabilities ?? 0,
          activeIncidents:
            result.activeIncidents ?? result.active_incidents ?? 0,
        });
      } catch (error) {
        if (!isMounted) return;
        setStatsError(error?.message ?? "Unable to load stats");
      } finally {
        if (isMounted) setStatsLoading(false);
      }
    }

    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const kpiItems = [
    {
      icon: Activity,
      label: "Total Events",
      value: stats.totalEvents,
      tone: "cyan",
    },
    {
      icon: ShieldAlert,
      label: "Critical Threats",
      value: stats.criticalThreats,
      tone: "critical",
    },
    {
      icon: TriangleAlert,
      label: "High Severity Alerts",
      value: stats.highSeverityAlerts,
      tone: "high",
    },
    {
      icon: Bug,
      label: "Vulnerabilities",
      value: stats.vulnerabilities,
      tone: "medium",
    },
    {
      icon: Siren,
      label: "Active Incidents",
      value: stats.activeIncidents,
      tone: "critical",
    },
  ];

  return (
    <DashboardLayout pageTitle="Overview">
      {/* ---- Filters row : Member 6 plugs in here ---- */}
      <section className="filters-placeholder" aria-label="Filters">
        <SlidersHorizontal size={16} />
        <span>Filters — Severity · Date range · Event type · IP address</span>
        <span className="placeholder-tag">Member 6</span>
      </section>

      {/* ---- KPI cards : Member 3 plugs in here, wired to GET /stats ---- */}
      <section className="kpi-grid" aria-label="Key metrics">
        {kpiItems.map((item) => (
          <KpiPlaceholder
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={formatMetric(item.value, statsLoading)}
            tone={item.tone}
          />
        ))}
      </section>

      {statsError ? (
        <div className="stats-error">Unable to load KPI metrics.</div>
      ) : null}

      {/* ---- Charts : Member 5 plugs in here ---- */}
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

      {/* ---- Table : Member 4 plugs in here ---- */}
      <SecurityEventsTable />
    </DashboardLayout>
  );
}

function formatMetric(value, loading) {
  if (loading) {
    return "…";
  }

  if (value === null || value === undefined) {
    return "—";
  }

  return typeof value === "number" ? value.toLocaleString() : value;
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
