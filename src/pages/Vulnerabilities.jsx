import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getVulnerabilities } from "../services/api";

export default function Vulnerabilities() {
  const [vulnerabilities, setVulnerabilities] = useState([]);

  useEffect(() => {
    async function loadData() {
      const data = await getVulnerabilities();
      setVulnerabilities(data);
    }

    loadData();
  }, []);

  return (
    <DashboardLayout pageTitle="Vulnerabilities">
      <h2>Total Vulnerabilities: {vulnerabilities.length}</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Severity</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {vulnerabilities.map((item, index) => (
            <tr key={index}>
              <td>{item.vulnerability_id}</td>
              <td>{item.severity}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}