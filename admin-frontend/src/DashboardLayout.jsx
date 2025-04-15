import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";

export default function DashboardLayout() {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <DashboardHeader />
        <Outlet />
      </div>
    </div>
  );
}
