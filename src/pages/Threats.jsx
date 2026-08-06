import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PieChartComponent from "../components/layout/PieChart";
import { getThreats } from "../services/api";

export default function Threats() {
  const [threats, setThreats] = useState([]);

  useEffect(() => {
    async function loadThreats() {
      const data = await getThreats();
      console.log(data); // check what comes from API
      setThreats(data);
    }

    loadThreats();
  }, []);

  return (
    <DashboardLayout pageTitle="Threat Intelligence">
      <PieChartComponent events={threats} />
    </DashboardLayout>
  );
}