import { Activity, AlertTriangle, ShieldCheck, Siren, ShieldAlert } from "lucide-react";

const ICONS = { Activity, AlertTriangle, ShieldCheck, Siren, ShieldAlert };

// Maps this component's existing tone names to the app-wide kpi tone classes.
const TONE_MAP = {
  "": "tone-cyan",
  warn: "tone-high",
  good: "tone-safe",
  danger: "tone-medium",
  critical: "tone-critical",
};

export default function StatCard({ title, value, icon = "Activity", tone = "" }) {
  const Icon = ICONS[icon] || Activity;
  const toneClass = TONE_MAP[tone] || "tone-cyan";

  return (
    <div className={`kpi-card ${toneClass}`}>
      <div className="kpi-icon">
        <Icon size={18} />
      </div>
      <div className="kpi-body">
        <span className="kpi-value">{value}</span>
        <span className="kpi-label">{title}</span>
      </div>
    </div>
  );
}
