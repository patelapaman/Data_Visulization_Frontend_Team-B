import React from "react";
import { getThreats } from "../../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#FF4D4F",
  "#FAAD14",
  "#1890FF",
  "#52C41A",
];

export default function PieChartComponent({ events = [] }) {

  const pieData = [
    {
      name: "Critical",
      value: events.filter(e => e.severity === "Critical").length,
    },
    {
      name: "High",
      value: events.filter(e => e.severity === "High").length,
    },
    {
      name: "Medium",
      value: events.filter(e => e.severity === "Medium").length,
    },
    {
      name: "Low",
      value: events.filter(e => e.severity === "Low").length,
    },
  ];

  return (
    <div style={{ width: "100%", height: 350 }}>
      <h2>Threat Distribution</h2>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {pieData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />

        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}