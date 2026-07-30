import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Critical", value: 346 },
  { name: "High", value: 573 },
  { name: "Medium", value: 437 },
  { name: "Low", value: 444 },
];

const COLORS = ["#FF4D4F", "#FAAD14", "#1890FF", "#52C41A"];

function PieChartComponent() {
  return (
    <div style={{ width: "100%", height: 350 }}>
      <h2>Threat Distribution</h2>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={110}
            label
          >
            {data.map((entry, index) => (
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

export default PieChartComponent;
