import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      try {
        setAdminUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored admin user data", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const adminName = adminUser?.name || "Temple Admin";

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <div className="dashboard-logo">
          <span className="dashboard-om">ॐ</span>
          <div className="dashboard-title">
            <h1>Temple Admin Dashboard</h1>
            <span>Sri Sharangapani Mahavishnu Temple</span>
          </div>
        </div>

        <div className="dashboard-user-info">
          <span className="admin-badge">👤 {adminName}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="welcome-card">
          <div className="welcome-header">
            <span className="welcome-om">ॐ</span>
            <div>
              <h2>Welcome, {adminName}</h2>
              <p>Logged in as: {adminUser?.email || "admin@temple.com"}</p>
            </div>
          </div>

          <div className="auth-success-badge">
            <span>✅</span> Authentication successful.
          </div>

          <div className="dashboard-grid">
            <div className="stat-card">
              <h3>Admin Session</h3>
              <p>Active secure token verified with JWT authentication protocol.</p>
            </div>
            <div className="stat-card">
              <h3>Temple Management System</h3>
              <p>Authorized access granted for administrative operations.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
