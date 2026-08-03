import React, { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";

import {
  Activity,
  ShieldAlert,
  TriangleAlert,
  Bug,
  Siren,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import PieChartComponent from "../components/layout/PieChart";
import LineChartComponent from "../components/layout/LineChart";
import BarChartComponent from "../components/layout/BarChart";
import SecurityEventsTable from "../components/SecurityEventsTable";

import "./Dashboard.css";

export default function Dashboard() {

  const [events, setEvents] = useState([]);

  const [filters, setFilters] = useState({
    severity: "",
    eventType: "",
    date: "",
    ip: "",
  });

  useEffect(() => {
    Papa.parse("/security_events.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setEvents(results.data);
      },
    });
  }, []);

  const filteredEvents = useMemo(() => {

    return events.filter((event) => {

      const severityMatch =
        !filters.severity ||
        event.severity === filters.severity;

      const eventMatch =
        !filters.eventType ||
        event.event_type === filters.eventType;

      const ipMatch =
        !filters.ip ||
        event.source_ip
          .toLowerCase()
          .includes(filters.ip.toLowerCase());

      const dateMatch =
        !filters.date ||
        event.timestamp.startsWith(filters.date);

      return (
        severityMatch &&
        eventMatch &&
        ipMatch &&
        dateMatch
      );

    });

  }, [events, filters]);

  // ---------- KPI DATA ----------

  const totalEvents = filteredEvents.length;

  const criticalThreats = filteredEvents.filter(
    e => e.severity === "Critical"
  ).length;

  const highSeverityAlerts = filteredEvents.filter(
    e => e.severity === "High"
  ).length;

  const vulnerabilities = filteredEvents.filter(
    e => e.vulnerability_id &&
         e.vulnerability_id !== ""
  ).length;

  const activeIncidents = filteredEvents.filter(
    e => e.event_status === "Open"
  ).length;

  // ---------- PIE CHART ----------

  const pieEvents = filteredEvents;

  // ---------- LINE CHART ----------

  const lineEvents = filteredEvents;

  // ---------- BAR CHART ----------

  const barEvents = filteredEvents;

    return (
    <DashboardLayout pageTitle="Overview">

      {/* ================= Filters ================= */}

      <section className="filters-placeholder">

        <select
          value={filters.severity}
          onChange={(e) =>
            setFilters({
              ...filters,
              severity: e.target.value,
            })
          }
        >
          <option value="">All Severity</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={filters.eventType}
          onChange={(e) =>
            setFilters({
              ...filters,
              eventType: e.target.value,
            })
          }
        >
          <option value="">All Event Types</option>

          <option value="Malware">
            Malware
          </option>

          <option value="Brute Force">
            Brute Force
          </option>

          <option value="Phishing">
            Phishing
          </option>

          <option value="Reconnaissance">
            Reconnaissance
          </option>

        </select>

        <input
          type="date"
          value={filters.date}
          onChange={(e) =>
            setFilters({
              ...filters,
              date: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Search IP Address"
          value={filters.ip}
          onChange={(e) =>
            setFilters({
              ...filters,
              ip: e.target.value,
            })
          }
        />

      </section>

      {/* ================= KPI Cards ================= */}

      <section className="kpi-grid">

        <KpiCard
          icon={Activity}
          label="Total Events"
          value={totalEvents}
          tone="cyan"
        />

        <KpiCard
          icon={ShieldAlert}
          label="Critical Threats"
          value={criticalThreats}
          tone="critical"
        />

        <KpiCard
          icon={TriangleAlert}
          label="High Severity Alerts"
          value={highSeverityAlerts}
          tone="high"
        />

        <KpiCard
          icon={Bug}
          label="Vulnerabilities"
          value={vulnerabilities}
          tone="medium"
        />

        <KpiCard
          icon={Siren}
          label="Active Incidents"
          value={activeIncidents}
          tone="critical"
        />

      </section>

      {/* ================= Charts ================= */}

      <section className="charts-grid" aria-label="Analytics">

          <PieChartComponent
            events={filteredEvents}
          />

          <LineChartComponent
            events={filteredEvents}
          />

          <BarChartComponent
            events={filteredEvents}
          />

        </section>

      {/* ================= Table ================= */}

      <SecurityEventsTable
        events={filteredEvents}
      />

    </DashboardLayout>
  );
}

/* ================= KPI CARD ================= */

function KpiCard({
  icon: Icon,
  label,
  value,
  tone,
}) {

  return (

    <div className={`kpi-card tone-${tone}`}>

      <div className="kpi-icon">
        <Icon size={20} />
      </div>

      <div className="kpi-body">

        <div className="kpi-value">
          {value}
        </div>

        <div className="kpi-label">
          {label}
        </div>

      </div>

    </div>

  );
}

