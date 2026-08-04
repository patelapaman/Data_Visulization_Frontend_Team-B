import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const DEFAULT_DATA = [
  { attack: "File Access", count: 198 },
  { attack: "SQL Injection Attempt", count: 195 },
  { attack: "Privilege Escalation", count: 191 },
  { attack: "Brute Force", count: 189 },
  { attack: "Login Success", count: 179 },
];

function BarChartComponent({ data }) {
  const chartData = data && data.length > 0 ? data : DEFAULT_DATA;

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#223049" />
          <XAxis
            dataKey="attack"
            stroke="#94a3b8"
            tick={{ fontSize: 9 }}
            interval={0}
            angle={-15}
            textAnchor="end"
          />
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
          <Bar dataKey="count" fill="#7c6cf5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartComponent;
