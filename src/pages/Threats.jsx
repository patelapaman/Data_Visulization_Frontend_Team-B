import DashboardLayout from "../components/layout/DashboardLayout";
import PieChartComponent from "../components/layout/PieChart";

export default function Threats() {
  return (
    <DashboardLayout pageTitle="Threat Intelligence">
      <PieChartComponent events={[]} />
    </DashboardLayout>
  );
}