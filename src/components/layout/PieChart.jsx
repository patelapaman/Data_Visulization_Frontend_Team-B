import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DEFAULT_DATA = [
  { name: "Critical", value: 346 },
  { name: "High", value: 573 },
  { name: "Medium", value: 437 },
  { name: "Low", value: 444 },
];

const COLORS = {
  Critical: "#f0475d",
  High: "#f5a623",
  Medium: "#7c6cf5",
  Low: "#35d399",
};

const DEFAULT_COLORS = ["#f0475d", "#f5a623", "#7c6cf5", "#35d399"];

function PieChartComponent({ data }) {
  const chartData = data && data.length > 0 ? data : DEFAULT_DATA;

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={70}
            innerRadius={35}
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#172038",
              borderColor: "#2c3b5c",
              color: "#e7ecf5",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartComponent;
