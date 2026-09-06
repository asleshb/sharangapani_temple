import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    todayPujas: 0,
    upcomingPujas: 0,
    thisMonthBookings: 0,
    totalBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const res = await fetch(`${apiUrl}/api/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="dashboard-view-container">
        {/* Welcome Banner */}
        <div className="dashboard-welcome-banner">
          <div className="welcome-banner-header">
            <span className="welcome-banner-om">ॐ</span>
            <div>
              <h2>Welcome, Admin</h2>
              <p>Temple Annual Puja Management</p>
            </div>
          </div>
        </div>

        {/* Dashboard Statistics Cards (2-column on Mobile) */}
        <div className="stats-grid-container">
          <div className="stat-metric-card">
            <div className="stat-info">
              <h3>Today's Annual Pujas</h3>
              <div className="stat-number">{loading ? "..." : stats.todayPujas}</div>
            </div>
            <div className="stat-icon-badge">🛕</div>
          </div>

          <div className="stat-metric-card">
            <div className="stat-info">
              <h3>Upcoming Annual Pujas</h3>
              <div className="stat-number">{loading ? "..." : stats.upcomingPujas}</div>
            </div>
            <div className="stat-icon-badge">📅</div>
          </div>

          <div className="stat-metric-card">
            <div className="stat-info">
              <h3>This Month</h3>
              <div className="stat-number">{loading ? "..." : stats.thisMonthBookings}</div>
            </div>
            <div className="stat-icon-badge">📊</div>
          </div>

          <div className="stat-metric-card">
            <div className="stat-info">
              <h3>Total Annual Pujas</h3>
              <div className="stat-number">{loading ? "..." : stats.totalBookings}</div>
            </div>
            <div className="stat-icon-badge">📜</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-card">
          <h3>Quick Actions</h3>
          <div className="action-buttons-grid">
            <Link to="/admin/pujas?tab=add" className="quick-action-btn">
              <span>➕</span> Add Annual Puja
            </Link>

            <Link to="/admin/pujas" className="quick-action-btn">
              <span>📋</span> All Annual Pujas
            </Link>

            <Link to="/admin/pujas/calendar" className="quick-action-btn full-mobile">
              <span>📅</span> Calendar View
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
