import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Posts from "./pages/Posts";
import "./styles/Dashboard.css";
import Loader from "./components/Loader";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/auth/profile", {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/posts" element={<Posts />} />
      </Route>
    </Routes>
  );
}
