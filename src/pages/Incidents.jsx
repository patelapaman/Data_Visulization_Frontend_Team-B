import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getIncidents } from "../services/api";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    async function loadData() {
      const data = await getIncidents();
      setIncidents(data);
    }

    loadData();
  }, []);

  return (
    <DashboardLayout pageTitle="Incidents">
      <h2>Total Incidents: {incidents.length}</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Severity</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {incidents.map((item, index) => (
            <tr key={index}>
              <td>{item.incident_id}</td>
              <td>{item.severity}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}