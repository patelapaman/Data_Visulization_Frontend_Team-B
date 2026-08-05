import DashboardLayout from "../components/layout/DashboardLayout";
import BarChartComponent from "../components/layout/BarChart";

export default function Reports() {
  return (
    <DashboardLayout pageTitle="Reports">
      <BarChartComponent events={[]} />
    </DashboardLayout>
  );
}