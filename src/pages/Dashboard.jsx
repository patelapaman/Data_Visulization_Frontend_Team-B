import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, ShieldAlert, TriangleAlert, Bug, Siren,
  Search, X, SlidersHorizontal, RotateCcw
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PieChartComponent from "../components/layout/PieChart";
import LineChartComponent from "../components/layout/LineChart";
import BarChartComponent from "../components/layout/BarChart";
import SecurityEventsTable from "../components/SecurityEventsTable";
<<<<<<< HEAD
import { getEvents } from "../services/api";
import "./Dashboard.css";

const MONTHS = [
  ["01", "January"], ["02", "February"], ["03", "March"], ["04", "April"],
  ["05", "May"], ["06", "June"], ["07", "July"], ["08", "August"],
  ["09", "September"], ["10", "October"], ["11", "November"], ["12", "December"],
];
=======
import { getStats, getEvents , getThreatSummary } from "../services/api";

import "./Dashboard.css";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);

  const [threatSummary, setThreatSummary] = useState({
  totalEvents: 0,
  anomaliesDetected: 0,
  normalEvents: 0,
  highRiskEvents: 0,
  criticalThreats: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
>>>>>>> 782dd70ab0d199645c146adda816cab205fcfece

const SEVERITIES = ["Critical", "High", "Medium", "Low"];

function clean(value) {
  return String(value ?? "").trim();
}

function eventDateParts(timestamp) {
  const raw = clean(timestamp);
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? { year: match[1], month: match[2], date: `${match[1]}-${match[2]}-${match[3]}` } : null;
}

export default function Dashboard({ searchQuery = "" }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    severity: "",
    eventType: "",
    calendarMode: "all",
    date: "",
    month: "",
    year: "",
    ip: "",
  });

<<<<<<< HEAD
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getEvents();
        if (mounted) setEvents(Array.isArray(data) ? data : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const eventTypes = useMemo(
    () => [...new Set(events.map((e) => clean(e.event_type)).filter(Boolean))].sort(),
    [events]
  );

  const years = useMemo(
    () => [...new Set(events.map((e) => eventDateParts(e.timestamp)?.year).filter(Boolean))].sort().reverse(),
    [events]
  );

  const severityCounts = useMemo(() => Object.fromEntries(
    SEVERITIES.map((severity) => [severity, events.filter((e) => e.severity === severity).length])
  ), [events]);
=======
  const loadDashboardData = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
    Papa.parse("/security_events.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {

        const data = results.data;  
        setEvents(results.data);

      setThreatSummary({
        totalEvents: data.length,

        // anomalies = Critical + High severity events
        anomaliesDetected: data.filter(
          (e) => e.severity === "Critical" || e.severity === "High"
        ).length,

        // normal events = Low severity
        normalEvents: data.filter((e) => e.severity === "Low").length,

        // High-risk events = High severity
        highRiskEvents: data.filter((e) => e.severity === "High").length,

        // Critical threats = Critical severity
        criticalThreats: data.filter((e) => e.severity === "Critical").length,
      });

        setLoading(false);
      },
    });
  } catch (err) {
    setError("Failed to load dashboard data.");
    setLoading(false);
  }
}, []);

useEffect(() => {
  loadDashboardData();
}, [loadDashboardData]);
>>>>>>> 782dd70ab0d199645c146adda816cab205fcfece

  const filteredEvents = useMemo(() => {
    const query = clean(searchQuery).toLowerCase();
    const ipQuery = clean(filters.ip).toLowerCase();

    return events.filter((event) => {
      const parts = eventDateParts(event.timestamp);
      const severityMatch = !filters.severity || event.severity === filters.severity;
      const eventTypeMatch = !filters.eventType || event.event_type === filters.eventType;

      let calendarMatch = true;
      if (filters.calendarMode === "date") {
        calendarMatch = !!parts && parts.date === filters.date;
      } else if (filters.calendarMode === "month") {
        calendarMatch = !!parts && parts.month === filters.month && (!filters.year || parts.year === filters.year);
      } else if (filters.calendarMode === "year") {
        calendarMatch = !!parts && parts.year === filters.year;
      }

      const sourceIp = clean(event.source_ip).toLowerCase();
      const destinationIp = clean(event.destination_ip).toLowerCase();
      const ipMatch = !ipQuery || sourceIp.includes(ipQuery) || destinationIp.includes(ipQuery);

      const globalSearchMatch =
        !query || Object.values(event).join(" ").toLowerCase().includes(query);

      return severityMatch && eventTypeMatch && calendarMatch && ipMatch && globalSearchMatch;
    });
  }, [events, filters, searchQuery]);

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  const clearFilters = () => setFilters({
    severity: "", eventType: "", calendarMode: "all",
    date: "", month: "", year: "", ip: "",
  });

  const calendarLabel = filters.calendarMode === "date"
    ? filters.date || "Choose a date"
    : filters.calendarMode === "month"
      ? `${MONTHS.find(([id]) => id === filters.month)?.[1] || "Choose month"} ${filters.year || ""}`.trim()
      : filters.calendarMode === "year"
        ? filters.year || "Choose year"
        : "All dates";

<<<<<<< HEAD
  const totalEvents = filteredEvents.length;
  const criticalThreats = filteredEvents.filter((e) => e.severity === "Critical").length;
  const highSeverityAlerts = filteredEvents.filter((e) => e.severity === "High").length;
  const vulnerabilities = filteredEvents.filter((e) => clean(e.vulnerability_id)).length;
  const activeIncidents = filteredEvents.filter((e) => ["Open", "Investigating", "Active"].includes(clean(e.event_status))).length;
=======
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
            <h2>{threatSummary.totalEvents}</h2>
          </div>
        </div>

        <div className="kpi-card">
          <ShieldAlert className="icon critical" />
          <div>
            <span>Anomalies Detected</span>
            <h2>{threatSummary.anomaliesDetected}</h2>
          </div>
        </div>

        <div className="kpi-card">
          <TriangleAlert className="icon high" />
          <div>
            <span>Normal Events</span>
            <h2>{threatSummary.normalEvents}</h2>
          </div>
        </div>

        <div className="kpi-card">
          <Bug className="icon warning" />
          <div>
            <span>High-Risk Events</span>
            <h2>{threatSummary.highRiskEvents}</h2>
          </div>
        </div>

        <div className="kpi-card">
          <Siren className="icon critical" />
          <div>
            <span>Critical Threats</span>
            <h2>{threatSummary.criticalThreats}</h2>
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
>>>>>>> 782dd70ab0d199645c146adda816cab205fcfece

  return (
    <DashboardLayout pageTitle="Overview">
      <div className="overview-page">
        <section className="overview-hero">
          <div>
            <span className="overview-eyebrow">SECURITY OPERATIONS CENTER</span>
            <h2>Live threat overview</h2>
            <p>Filter the shared security-event dataset by severity, event type, time period or IP address.</p>
          </div>
          <div className="overview-data-status">
            <span className="status-dot" />
            {loading ? "Loading telemetry…" : `${events.length.toLocaleString()} events loaded`}
          </div>
        </section>

        <section className="overview-filter-panel">
          <div className="filter-panel-heading">
            <div>
              <strong><SlidersHorizontal size={16} /> Investigation filters</strong>
              <span>{filteredEvents.length.toLocaleString()} matching events · {calendarLabel}</span>
            </div>
            <button className="clear-filters-btn" onClick={clearFilters} disabled={filters.severity === "" && filters.eventType === "" && filters.calendarMode === "all" && !filters.date && !filters.month && !filters.year && !filters.ip && !searchQuery}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <div className="severity-filter-row">
            <span className="filter-label">Severity</span>
            <button className={`severity-chip all ${!filters.severity ? "selected" : ""}`} onClick={() => updateFilter("severity", "")}>
              All <b>{events.length}</b>
            </button>
            {SEVERITIES.map((severity) => (
              <button
                key={severity}
                className={`severity-chip ${severity.toLowerCase()} ${filters.severity === severity ? "selected" : ""}`}
                onClick={() => updateFilter("severity", filters.severity === severity ? "" : severity)}
              >
                {severity} <b>{severityCounts[severity]}</b>
              </button>
            ))}
          </div>

          <div className="filter-controls-grid">
            <label>
              <span>Event Type</span>
              <select value={filters.eventType} onChange={(e) => updateFilter("eventType", e.target.value)}>
                <option value="">All Event Types</option>
                {eventTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>

            <label>
              <span>Calendar View</span>
              <select
                value={filters.calendarMode}
                onChange={(e) => updateFilter("calendarMode", e.target.value)}
              >
                <option value="all">All dates</option>
                <option value="date">Specific date</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </label>

            {filters.calendarMode === "date" && (
              <label>
                <span>Date</span>
                <input type="date" value={filters.date} onChange={(e) => updateFilter("date", e.target.value)} />
              </label>
            )}

            {filters.calendarMode === "month" && (
              <>
                <label>
                  <span>Month</span>
                  <select value={filters.month} onChange={(e) => updateFilter("month", e.target.value)}>
                    <option value="">Select month</option>
                    {MONTHS.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                  </select>
                </label>
                <label>
                  <span>Year</span>
                  <select value={filters.year} onChange={(e) => updateFilter("year", e.target.value)}>
                    <option value="">Select year</option>
                    {years.map((year) => <option key={year} value={year}>{year}</option>)}
                  </select>
                </label>
              </>
            )}

            {filters.calendarMode === "year" && (
              <label>
                <span>Year</span>
                <select value={filters.year} onChange={(e) => updateFilter("year", e.target.value)}>
                  <option value="">Select year</option>
                  {years.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </label>
            )}

            <label className="ip-filter-field">
              <span>Search IP Address</span>
              <div className="ip-input">
                <Search size={15} />
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Source or destination IP"
                  value={filters.ip}
                  onChange={(e) => updateFilter("ip", e.target.value)}
                />
                {filters.ip && <button onClick={() => updateFilter("ip", "")} aria-label="Clear IP search"><X size={14} /></button>}
              </div>
            </label>
          </div>
        </section>

        <section className="kpi-grid">
          <KpiCard icon={Activity} label="Total Events" value={totalEvents} tone="cyan" />
          <KpiCard icon={ShieldAlert} label="Critical Threats" value={criticalThreats} tone="critical" />
          <KpiCard icon={TriangleAlert} label="High Severity Alerts" value={highSeverityAlerts} tone="high" />
          <KpiCard icon={Bug} label="Vulnerabilities in Events" value={vulnerabilities} tone="medium" />
          <KpiCard icon={Siren} label="Active Incidents" value={activeIncidents} tone="critical" />
        </section>

        {filters.ip && (
          <section className="ip-result-banner">
            <div><Search size={17} /><strong>IP investigation</strong><span>Results for <b>{filters.ip}</b> across source and destination addresses.</span></div>
            {filteredEvents.length === 0 && <span className="no-match">No matching IP telemetry</span>}
          </section>
        )}

        <section className="charts-grid">
          <PieChartComponent events={filteredEvents} />
          <LineChartComponent events={filteredEvents} />
          <BarChartComponent events={filteredEvents} />
        </section>

        <SecurityEventsTable events={filteredEvents} searchQuery={searchQuery} />
      </div>
    </DashboardLayout>
  );
}
<<<<<<< HEAD

function KpiCard({ icon: Icon, label, value, tone }) {
  return (
    <div className={`kpi-card tone-${tone}`}>
      <div className="kpi-icon"><Icon size={20} /></div>
      <div className="kpi-body"><div className="kpi-value">{value.toLocaleString()}</div><div className="kpi-label">{label}</div></div>
    </div>
  );
}
=======
>>>>>>> 782dd70ab0d199645c146adda816cab205fcfece
