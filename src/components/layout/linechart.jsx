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

const data = [
  { time: "00:00", events: 85 },
  { time: "01:00", events: 84 },
  { time: "02:00", events: 84 },
  { time: "03:00", events: 84 },
  { time: "04:00", events: 84 },
  { time: "05:00", events: 84 },
  { time: "06:00", events: 72 },
  { time: "07:00", events: 72 },
  { time: "08:00", events: 72 },
  { time: "09:00", events: 72 },
  { time: "10:00", events: 72 },
  { time: "11:00", events: 72 },
  { time: "12:00", events: 72 },
  { time: "13:00", events: 72 },
  { time: "14:00", events: 72 },
  { time: "15:00", events: 72 },
  { time: "16:00", events: 72 },
  { time: "17:00", events: 72 },
  { time: "18:00", events: 72 },
  { time: "19:00", events: 72 },
  { time: "20:00", events: 72 },
  { time: "21:00", events: 72 },
  { time: "22:00", events: 72 },
  { time: "23:00", events: 72 },
];

function LineChartComponent() {
  return (
    <div style={{ width: "100%", height: 350 }}>
      <h2>Event Trend</h2>

      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="events"
            stroke="#1890FF"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChartComponent;
