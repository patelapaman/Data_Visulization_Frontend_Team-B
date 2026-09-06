import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from "recharts";

// Matches the same semantic colors used everywhere else in the app
// (KPI cards, severity badges): safe/warn/critical signal tones.
const DISTRIBUTION_COLORS = {
  Normal: "#35d399",
  Suspicious: "#f5a623",
  Critical: "#f0475d",
};
const TYPE_COLORS = ["#22d3ee", "#7c6cf5", "#f5a623", "#f0475d", "#35d399", "#3b82f6"];

export function AnomalyChart({ data }) {
  return (
    <div className="m2-panel chart-panel">
      <div className="m2-panel-head">
        <div>
          <h2>Anomaly Distribution</h2>
          <p>Normal, suspicious and critical outcomes</p>
        </div>
      </div>
      <div className="m2-chart">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} paddingAngle={4}>
              {data.map((item) => (
                <Cell key={item.name} fill={DISTRIBUTION_COLORS[item.name] || "#22d3ee"} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ThreatTypeChart({ data }) {
  return (
    <div className="m2-panel chart-panel">
      <div className="m2-panel-head">
        <div>
          <h2>Threat Types</h2>
          <p>Detected security patterns</p>
        </div>
      </div>
      <div className="m2-chart">
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 12 }}>
            <CartesianGrid strokeDasharray="3 3" opacity=".15" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {data.map((item, i) => (
                <Cell key={item.name} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TrendChart({ data }) {
  return (
    <div className="m2-panel chart-panel">
      <div className="m2-panel-head">
        <div>
          <h2>Anomaly Trend</h2>
          <p>Detected anomalies across recent events</p>
        </div>
      </div>
      <div className="m2-chart">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ left: 4, right: 12 }}>
            <CartesianGrid strokeDasharray="3 3" opacity=".15" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="anomalies" stroke="#22d3ee" strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
