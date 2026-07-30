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

const data = [
  { attack: "File Access", count: 198 },
  { attack: "SQL Injection Attempt", count: 195 },
  { attack: "Privilege Escalation", count: 191 },
  { attack: "Brute Force", count: 189 },
  { attack: "Login Success", count: 179 },
];

function BarChartComponent() {
  return (
    <div style={{ width: "100%", height: 350 }}>
      <h2>Bar Chart (Top Attack Types)</h2>

      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="attack" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#52C41A" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartComponent;
