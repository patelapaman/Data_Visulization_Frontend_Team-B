import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Critical", value: 50 },
  { name: "High", value: 80 },
  { name: "Medium", value: 150 },
  { name: "Low", value: 100 },
];

const COLORS = ["#FF4C4C", "#FF9F43", "#FFD93D", "#4CAF50"];

const PieChartComponent = () => {
  return (
    <div style={{ width: "100%", height: 350 }}>
      <h2>Threat Distribution</h2>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
