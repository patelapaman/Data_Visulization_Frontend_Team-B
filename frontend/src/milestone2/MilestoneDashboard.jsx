import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Zap, Gauge, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useMilestone2 } from "../context/Milestone2Context";
import StatCard from "./components/StatCard";
import ThreatTable from "./components/ThreatTable";
import { AnomalyChart, ThreatTypeChart, TrendChart } from "./charts/Charts";
import "./milestone2.css";

export default function Dashboard() {
  const { predictions: pred, summary, performance, health, loading, error, refresh } = useMilestone2();
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("");
  const nav = useNavigate();

  useEffect(() => { refresh(); }, [refresh]);

  const filtered = useMemo(() => pred.filter((x) =>
    (!severity || x?.severity === severity) &&
    (!search || JSON.stringify(x ?? {}).toLowerCase().includes(search.toLowerCase()))
  ), [pred, search, severity]);

  const kpis = summary?.kpis || {};
  const distribution = [
    { name: "Normal", value: summary?.prediction_distribution?.Normal || 0 },
    { name: "Suspicious", value: summary?.prediction_distribution?.Suspicious || 0 },
    { name: "Critical", value: kpis.critical_threats || 0 },
  ];
  const types = Object.entries(summary?.threat_types || {})
    .filter(([name]) => name !== "Normal")
    .map(([name, value]) => ({ name, value }));

  // Bucket predictions by hour so the trend line shows a real
  // time series (Time -> Number of detected anomalies) instead of
  // one point per raw event index.
  const trend = useMemo(() => {
    const buckets = new Map();
    pred.forEach((x) => {
      const ts = x?.prediction_timestamp || x?.event?.timestamp;
      if (!ts) return;
      const date = new Date(ts);
      if (Number.isNaN(date.getTime())) return;
      date.setMinutes(0, 0, 0);
      const key = date.toISOString();
      const isAnomaly = x?.prediction && x.prediction !== "Normal";
      const bucket = buckets.get(key) || { anomalies: 0 };
      if (isAnomaly) bucket.anomalies += 1;
      buckets.set(key, bucket);
    });

    return Array.from(buckets.entries())
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([key, val]) => ({
        label: new Date(key).toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
        }),
        anomalies: val.anomalies,
      }));
  }, [pred]);

  function exportCsv() {
    const header = ["Event ID", "Event Type", "Prediction", "Confidence", "Severity", "Source IP", "Timestamp"];
    const rows = filtered.map((x) => [
      x.event_id,
      x.event?.event_type || "",
      x.prediction,
      `${x.confidence_score}%`,
      x.severity,
      x.event?.source_ip || "",
      x.prediction_timestamp,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `threat-predictions-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DashboardLayout pageTitle="AI Threat Detection">
      <div className="m2-content">
        <section className="m2-hero">
          <div>
            <div className="m2-eyebrow">
              <Zap size={15} /> AI SECURITY OPERATIONS
            </div>
            <h1>
              Threat Detection <span>Dashboard</span>
            </h1>
            <p>AI anomaly detection over the same security-event dataset used by the Overview dashboard.</p>
          </div>
          <div className="m2-status">
            <i />
            {health?.status === "ok"
              ? `Engine online · ${health.processed_events || 0} shared events`
              : loading
              ? "Checking engine"
              : "Engine unavailable"}
          </div>
        </section>

        <div className="m2-toolbar">
          <button className="m2-ghost-btn" onClick={() => nav("/dashboard/ai-detection/live")}>
            Live Prediction
          </button>
          <button className="m2-ghost-btn" onClick={exportCsv} disabled={!filtered.length}>
            <Download size={16} /> Export CSV
          </button>
          <button className="m2-ghost-btn" onClick={refresh} disabled={loading}>
            <RefreshCw size={16} className={loading ? "m2-spin" : ""} /> Refresh
          </button>
        </div>

        {error && (
          <div className="m2-error" role="alert">
            {error}
            <button className="m2-ghost-btn" onClick={refresh}>
              Retry
            </button>
          </div>
        )}

        {loading && pred.length === 0 ? (
          <div className="m2-loading">Loading threat intelligence…</div>
        ) : (
          <>
            <section className="m2-shared-dataset-note">
              <span>SHARED TELEMETRY</span>
              <b>{kpis.total_events || 0} events</b>
              <p>AI analysis is synchronized with the Overview security_events dataset.</p>
            </section>

            <section className="m2-stats">
              <StatCard title="Total Events" value={kpis.total_events || 0} icon="Activity" />
              <StatCard
                title="Anomalies Detected"
                value={kpis.anomalies_detected || 0}
                icon="AlertTriangle"
                tone="warn"
              />
              <StatCard title="Normal Events" value={kpis.normal_events || 0} icon="ShieldCheck" tone="good" />
              <StatCard title="High-Risk Events" value={kpis.high_risk_events || 0} icon="Siren" tone="danger" />
              <StatCard
                title="Critical Threats"
                value={kpis.critical_threats || 0}
                icon="ShieldAlert"
                tone="critical"
              />
            </section>

            <section className="m2-charts-grid">
              <AnomalyChart data={distribution} />
              <ThreatTypeChart data={types} />
              <TrendChart data={trend} />
            </section>

            <section className="m2-model-strip m2-panel">
              <div>
                <Gauge size={18} />
                <div>
                  <b>Isolation Forest · {health?.model_version || "IF_SHARED_V2"}</b>
                  <span>300 estimators · hybrid rule engine · detection confidence, not attack probability</span>
                </div>
              </div>
              <div className="m2-model-metrics">
                {performance?.available ? (
                  <>
                    <span>
                      Precision <b>{Math.round((performance.precision || 0) * 100)}%</b>
                    </span>
                    <span>
                      Recall <b>{Math.round((performance.recall || 0) * 100)}%</b>
                    </span>
                    <span>
                      F1 <b>{Math.round((performance.f1 || 0) * 100)}%</b>
                    </span>
                  </>
                ) : (
                  <span>
                    Evaluation: <b>Unsupervised / no reliable labels</b>
                  </span>
                )}
              </div>
            </section>

            <ThreatTable
              data={filtered}
              onSelect={(id) => nav(`/dashboard/ai-detection/events/${encodeURIComponent(id)}`)}
              search={search}
              setSearch={setSearch}
              severity={severity}
              setSeverity={setSeverity}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
