import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const DEFAULT_DATA = [
  { time: "00:00", events: 85 },
  { time: "01:00", events: 84 },
  { time: "02:00", events: 84 },
  { time: "03:00", events: 84 },
  { time: "04:00", events: 84 },
  { time: "05:00", events: 84 },
  { time: "06:00", events: 72 },
  { time: "07:00", events: 72 },
];

function LineChartComponent({ data }) {
  const chartData = data && data.length > 0 ? data : DEFAULT_DATA;

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#223049" />
          <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 10 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#172038",
              borderColor: "#2c3b5c",
              color: "#e7ecf5",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="events"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={{ r: 2, fill: "#22d3ee" }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChartComponent;
