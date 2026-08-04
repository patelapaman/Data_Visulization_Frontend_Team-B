import React, { useEffect, useState, useMemo } from "react";
import {
  Activity,
  ShieldAlert,
  TriangleAlert,
  Bug,
  Siren,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  BarChart3,
  SlidersHorizontal,
  Filter,
  Tag,
  Calendar,
  Globe,
  RotateCcw,
} from "lucide-react";
import Papa from "papaparse";
import DashboardLayout from "../components/layout/DashboardLayout";
import SecurityEventsTable from "../components/SecurityEventsTable";
import PieChartComponent from "../components/layout/PieChart";
import LineChartComponent from "../components/layout/LineChart";
import BarChartComponent from "../components/layout/BarChart";
import "./Dashboard.css";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters State
  const [severityFilter, setSeverityFilter] = useState("All");
  const [eventTypeFilter, setEventTypeFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ipFilter, setIpFilter] = useState("");

  // Load events from CSV
  useEffect(() => {
    Papa.parse("/security_events.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setEvents(results.data || []);
        setLoading(false);
      },
      error: (err) => {
        setError(err?.message || "Failed to load events data");
        setLoading(false);
      },
    });
  }, []);

  // Dynamically extract unique Event Types from data
  const uniqueEventTypes = useMemo(() => {
    const types = new Set();
    events.forEach((evt) => {
      if (evt.event_type) types.add(evt.event_type);
    });
    return Array.from(types).sort();
  }, [events]);

  // Filtered Events logic connecting Severity, Date, Event Type, and IP Address
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // 1. Severity filter
      if (severityFilter !== "All") {
        if (evt.severity?.toLowerCase() !== severityFilter.toLowerCase()) {
          return false;
        }
      }

      // 2. Event Type filter
      if (eventTypeFilter !== "All") {
        if (evt.event_type?.toLowerCase() !== eventTypeFilter.toLowerCase()) {
          return false;
        }
      }

      // 3. IP Address filter (Source or Destination IP)
      if (ipFilter.trim()) {
        const query = ipFilter.trim().toLowerCase();
        const srcIp = evt.source_ip?.toLowerCase() || "";
        const dstIp = evt.destination_ip?.toLowerCase() || "";
        if (!srcIp.includes(query) && !dstIp.includes(query)) {
          return false;
        }
      }

      // 4. Date filter
      if (evt.timestamp) {
        const evtDate = evt.timestamp.split(" ")[0]; // "YYYY-MM-DD"
        if (startDate && evtDate < startDate) return false;
        if (endDate && evtDate > endDate) return false;
      }

      return true;
    });
  }, [events, severityFilter, eventTypeFilter, ipFilter, startDate, endDate]);

  // Chart Data 1: Threat Distribution (Pie Chart)
  const pieChartData = useMemo(() => {
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    filteredEvents.forEach((evt) => {
      const sev = evt.severity;
      if (!sev) return;
      const formatted = sev.charAt(0).toUpperCase() + sev.slice(1).toLowerCase();
      if (counts[formatted] !== undefined) {
        counts[formatted]++;
      }
    });
    return [
      { name: "Critical", value: counts.Critical },
      { name: "High", value: counts.High },
      { name: "Medium", value: counts.Medium },
      { name: "Low", value: counts.Low },
    ];
  }, [filteredEvents]);

  // Chart Data 2: Event Trend over time (Line Chart)
  const lineChartData = useMemo(() => {
    const timeCounts = {};
    filteredEvents.forEach((evt) => {
      if (!evt.timestamp) return;
      const [datePart, timePart] = evt.timestamp.split(" ");
      if (!datePart || !timePart) return;
      const hour = timePart.split(":")[0];
      const key = `${datePart.slice(5)} ${hour}:00`;
      timeCounts[key] = (timeCounts[key] || 0) + 1;
    });

    const keys = Object.keys(timeCounts).sort();
    return keys.slice(0, 24).map((k) => ({
      time: k,
      events: timeCounts[k],
    }));
  }, [filteredEvents]);

  // Chart Data 3: Top Attack Types (Bar Chart)
  const barChartData = useMemo(() => {
    const typeCounts = {};
    filteredEvents.forEach((evt) => {
      const type = evt.event_type || "Unknown";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    return Object.entries(typeCounts)
      .map(([attack, count]) => ({ attack, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [filteredEvents]);

  // Dynamic KPI Metrics calculated from filteredEvents
  const kpiItems = useMemo(() => {
    const total = filteredEvents.length;
    const critical = filteredEvents.filter(
      (e) => e.severity?.toLowerCase() === "critical"
    ).length;
    const high = filteredEvents.filter(
      (e) => e.severity?.toLowerCase() === "high"
    ).length;
    const vulnerabilities = filteredEvents.filter(
      (e) => e.vulnerability_id && e.vulnerability_id !== "None"
    ).length;
    const activeIncidents = filteredEvents.filter(
      (e) =>
        e.event_status?.toLowerCase() === "failed" ||
        e.event_status?.toLowerCase() === "blocked"
    ).length;

    return [
      {
        icon: Activity,
        label: "Total Events",
        value: total,
        tone: "cyan",
      },
      {
        icon: ShieldAlert,
        label: "Critical Threats",
        value: critical,
        tone: "critical",
      },
      {
        icon: TriangleAlert,
        label: "High Severity Alerts",
        value: high,
        tone: "high",
      },
      {
        icon: Bug,
        label: "Vulnerabilities",
        value: vulnerabilities,
        tone: "medium",
      },
      {
        icon: Siren,
        label: "Active Incidents",
        value: activeIncidents,
        tone: "critical",
      },
    ];
  }, [filteredEvents]);

  const isFiltered =
    severityFilter !== "All" ||
    eventTypeFilter !== "All" ||
    startDate !== "" ||
    endDate !== "" ||
    ipFilter.trim() !== "";

  const handleResetFilters = () => {
    setSeverityFilter("All");
    setEventTypeFilter("All");
    setStartDate("");
    setEndDate("");
    setIpFilter("");
  };

  return (
    <DashboardLayout pageTitle="Overview">
      {/* ---- Filters Row ---- */}
      <section className="filters-bar" aria-label="Filters & Search">
        <div className="filters-title">
          <SlidersHorizontal size={16} />
          <span>Filters</span>
        </div>

        <div className="filter-group">
          <label htmlFor="severity-select" className="filter-label">
            <Filter size={13} /> Severity:
          </label>
          <select
            id="severity-select"
            className="filter-select"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="event-type-select" className="filter-label">
            <Tag size={13} /> Event Type:
          </label>
          <select
            id="event-type-select"
            className="filter-select"
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
          >
            <option value="All">All Event Types</option>
            {uniqueEventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="start-date" className="filter-label">
            <Calendar size={13} /> Date:
          </label>
          <input
            id="start-date"
            type="date"
            className="filter-input date-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="date-sep">to</span>
          <input
            id="end-date"
            type="date"
            className="filter-input date-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="ip-input" className="filter-label">
            <Globe size={13} /> IP:
          </label>
          <input
            id="ip-input"
            type="text"
            className="filter-input ip-input"
            placeholder="Filter IP address..."
            value={ipFilter}
            onChange={(e) => setIpFilter(e.target.value)}
          />
        </div>

        {isFiltered && (
          <button
            className="filter-reset-btn"
            onClick={handleResetFilters}
            title="Reset all filters"
          >
            <RotateCcw size={13} /> Reset
          </button>
        )}

        <div className="filter-badge">
          {filteredEvents.length.toLocaleString()} / {events.length.toLocaleString()} Events
        </div>
      </section>

      {/* ---- KPI cards ---- */}
      <section className="kpi-grid" aria-label="Key metrics">
        {kpiItems.map((item) => (
          <KpiCard
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={formatMetric(item.value, loading)}
            tone={item.tone}
          />
        ))}
      </section>

      {error ? (
        <div className="stats-error">Unable to load security events.</div>
      ) : null}

      {/* ---- Charts connected to filters ---- */}
      <section className="charts-grid" aria-label="Analytics">
        <div className="chart-card">
          <div className="panel-header">
            <PieChartIcon size={17} />
            <h2>Threat Distribution</h2>
          </div>
          <PieChartComponent data={pieChartData} />
        </div>

        <div className="chart-card">
          <div className="panel-header">
            <LineChartIcon size={17} />
            <h2>Event Trend</h2>
          </div>
          <LineChartComponent data={lineChartData} />
        </div>

        <div className="chart-card">
          <div className="panel-header">
            <BarChart3 size={17} />
            <h2>Top Attack Types</h2>
          </div>
          <BarChartComponent data={barChartData} />
        </div>
      </section>

      {/* ---- Event Table connected to filters ---- */}
      <SecurityEventsTable events={filteredEvents} />
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

function KpiCard({ icon: Icon, label, value, tone }) {
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
