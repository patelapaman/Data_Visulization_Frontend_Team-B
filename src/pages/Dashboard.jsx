import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import Papa from "papaparse";
import {
  Activity,
  ShieldAlert,
  TriangleAlert,
  Bug,
  Siren,
  RefreshCw,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import PieChartComponent from "../components/layout/PieChart";
import LineChartComponent from "../components/layout/LineChart";
import BarChartComponent from "../components/layout/BarChart";
import SecurityEventsTable from "../components/SecurityEventsTable";
import { getStats, getEvents } from "../services/api";

import "./Dashboard.css";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    severity: "",
    eventType: "",
    date: "",
    ip: "",
  });

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, eventsData] = await Promise.all([
        getStats(),
        getEvents(filters),
      ]);
      setStats(statsData);
      setEvents(eventsData.events || eventsData);
    } catch (err) {
      setError("Live API connection unavailable. Loaded local dataset.");
      Papa.parse("/security_events.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => setEvents(results.data),
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchSeverity = !filters.severity || e.severity === filters.severity;
      const matchType = !filters.eventType || e.event_type === filters.eventType;
      const matchDate =
        !filters.date || (e.timestamp && e.timestamp.includes(filters.date));
      const matchIp =
        !filters.ip || (e.source_ip && e.source_ip.includes(filters.ip));
      return matchSeverity && matchType && matchDate && matchIp;
    });
  }, [events, filters]);

  const kpiData = useMemo(() => {
    if (stats) return stats;
    return {
      totalEvents: filteredEvents.length,
      criticalThreats: filteredEvents.filter((e) => e.severity === "Critical").length,
      highSeverityAlerts: filteredEvents.filter((e) => e.severity === "High").length,
      vulnerabilities: filteredEvents.filter(
        (e) => e.event_type?.toLowerCase().includes("vulnerability")
      ).length,
      activeIncidents: filteredEvents.filter(
        (e) =>
          e.status === "Open" ||
          e.status === "Investigating" ||
          e.event_status === "Open"
      ).length,
    };
  }, [stats, filteredEvents]);

  // View rendered for /dashboard (Overview)
  const OverviewContent = () => (
    <>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">AI Security Monitoring Dashboard</h1>
          <p className="dashboard-subtitle">
            Real-time threat detection and security analytics
          </p>
        </div>
        <button
          className="refresh-btn"
          onClick={loadDashboardData}
          disabled={loading}
        >
          <RefreshCw className={loading ? "spin" : ""} size={16} />
          Refresh Data
        </button>
      </div>

      {error && <div className="api-warning-banner">{error}</div>}

      {/* Filters Section */}
      <div className="filters-card">
        <div className="filter-group">
          <label>Severity</label>
          <select
            value={filters.severity}
            onChange={(e) =>
              setFilters({ ...filters, severity: e.target.value })
            }
          >
            <option value="">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Event Type</label>
          <select
            value={filters.eventType}
            onChange={(e) =>
              setFilters({ ...filters, eventType: e.target.value })
            }
          >
            <option value="">All Event Types</option>
            <option value="DDoS Attack">DDoS Attack</option>
            <option value="SQL Injection">SQL Injection</option>
            <option value="Unauthorized Login">Unauthorized Login</option>
            <option value="Malware Execution">Malware Execution</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <label>Source IP</label>
          <input
            type="text"
            placeholder="Filter by IP..."
            value={filters.ip}
            onChange={(e) => setFilters({ ...filters, ip: e.target.value })}
          />
        </div>

        <button
          className="reset-btn"
          onClick={() =>
            setFilters({ severity: "", eventType: "", date: "", ip: "" })
          }
        >
          Reset Filters
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <Activity className="icon total" />
          <div>
            <span>Total Events</span>
            <h2>{kpiData.totalEvents}</h2>
          </div>
        </div>

        <div className="kpi-card">
          <ShieldAlert className="icon critical" />
          <div>
            <span>Critical Threats</span>
            <h2>{kpiData.criticalThreats}</h2>
          </div>
        </div>

        <div className="kpi-card">
          <TriangleAlert className="icon high" />
          <div>
            <span>High Severity</span>
            <h2>{kpiData.highSeverityAlerts}</h2>
          </div>
        </div>

        <div className="kpi-card">
          <Bug className="icon warning" />
          <div>
            <span>Vulnerabilities</span>
            <h2>{kpiData.vulnerabilities}</h2>
          </div>
        </div>

        <div className="kpi-card">
          <Siren className="icon critical" />
          <div>
            <span>Active Incidents</span>
            <h2>{kpiData.activeIncidents}</h2>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <PieChartComponent events={filteredEvents} />
        </div>
        <div className="chart-card">
          <LineChartComponent events={filteredEvents} />
        </div>
        <div className="chart-card">
          <BarChartComponent events={filteredEvents} />
        </div>
      </div>

      {/* Events Table */}
      <div className="table-card">
        <SecurityEventsTable events={filteredEvents} />
      </div>
    </>
  );

  return (
    <DashboardLayout>
      <Routes>
        {/* /dashboard */}
        <Route index element={<OverviewContent />} />

        {/* /dashboard/events */}
        <Route
          path="events"
          element={
            <div className="table-card" style={{ padding: "24px" }}>
              <h2 style={{ marginBottom: "16px" }}>Security Events Log</h2>
              <SecurityEventsTable events={filteredEvents} />
            </div>
          }
        />

        {/* /dashboard/threats */}
        <Route
          path="threats"
          element={
            <div style={{ display: "grid", gap: "24px" }}>
              <div className="table-card" style={{ padding: "24px" }}>
                <h2>Threat Intelligence Analytics</h2>
                <p style={{ color: "#94a3b8", marginTop: "8px" }}>
                  Real-time threat monitoring and frequency distribution.
                </p>
              </div>
              <div className="charts-grid">
                <div className="chart-card">
                  <LineChartComponent events={filteredEvents} />
                </div>
                <div className="chart-card">
                  <BarChartComponent events={filteredEvents} />
                </div>
              </div>
            </div>
          }
        />

        {/* /dashboard/vulnerabilities */}
        <Route
          path="vulnerabilities"
          element={
            <div className="table-card" style={{ padding: "24px" }}>
              <h2 style={{ marginBottom: "8px" }}>
                Vulnerabilities ({kpiData.vulnerabilities})
              </h2>
              <p style={{ color: "#94a3b8", marginBottom: "16px" }}>
                Showing detected system vulnerabilities and critical alerts.
              </p>
              <SecurityEventsTable
                events={filteredEvents.filter(
                  (e) =>
                    e.severity === "Critical" ||
                    e.severity === "High" ||
                    e.event_type?.toLowerCase().includes("vulnerability")
                )}
              />
            </div>
          }
        />

        {/* /dashboard/incidents */}
        <Route
          path="incidents"
          element={
            <div className="table-card" style={{ padding: "24px" }}>
              <h2 style={{ marginBottom: "8px" }}>
                Active Incidents ({kpiData.activeIncidents})
              </h2>
              <p style={{ color: "#94a3b8", marginBottom: "16px" }}>
                Filtered list of active threat incidents requiring immediate action.
              </p>
              <SecurityEventsTable
                events={filteredEvents.filter(
                  (e) => e.severity === "Critical" || e.severity === "High"
                )}
              />
            </div>
          }
        />

        {/* /dashboard/reports */}
        <Route
          path="reports"
          element={
            <div style={{ display: "grid", gap: "24px" }}>
              <div className="table-card" style={{ padding: "24px" }}>
                <h2>Platform Reports</h2>
                <p style={{ color: "#94a3b8", marginTop: "8px" }}>
                  Exportable metrics and threat severity breakdown ({filteredEvents.length} total events logged).
                </p>
              </div>
              <div className="charts-grid">
                <div className="chart-card">
                  <PieChartComponent events={filteredEvents} />
                </div>
              </div>
            </div>
          }
        />

        {/* /dashboard/settings */}
        <Route
          path="settings"
          element={
            <div className="table-card" style={{ padding: "24px" }}>
              <h2>Settings</h2>
              <p style={{ color: "#94a3b8", marginTop: "8px" }}>
                Dashboard configuration and local CSV dataset preferences.
              </p>
            </div>
          }
        />
      </Routes>
    </DashboardLayout>
  );
}