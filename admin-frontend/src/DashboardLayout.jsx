import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import { ProfileProvider } from "./contexts/ProfileProvider";

export default function DashboardLayout() {
  return (
    <div className="dashboard">
      <ProfileProvider>
        <Sidebar />
        <div className="main-content">
          <DashboardHeader />
          <Outlet />
        </div>
      </ProfileProvider>
    </div>
  );
}
