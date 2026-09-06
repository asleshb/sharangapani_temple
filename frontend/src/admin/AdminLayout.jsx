import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const isActive = (path) => location.pathname === path || (path === "/admin/pujas" && location.pathname.startsWith("/admin/pujas"));

  return (
    <div className="admin-app-layout">
      <header className="admin-header-nav">
        <div className="admin-header-top-bar">
          <Link to="/admin/dashboard" className="admin-brand">
            <span className="admin-brand-om">ॐ</span>
            <div className="admin-brand-text">
              <h1>Temple Admin Portal</h1>
              <span>Sri Sharangapani Temple</span>
            </div>
          </Link>

          <button className="admin-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>

        <nav className="admin-main-menu">
          <Link
            to="/admin/dashboard"
            className={`admin-menu-item ${location.pathname === "/admin/dashboard" ? "active" : ""}`}
          >
            <span>🏠</span> Dashboard
          </Link>

          <Link
            to="/admin/pujas"
            className={`admin-menu-item ${isActive("/admin/pujas") ? "active" : ""}`}
          >
            <span>📅</span> Pujas
          </Link>

          <span className="admin-menu-item disabled" title="Coming in future update">
            <span>🔔</span> Reminders
          </span>
        </nav>
      </header>

      <main className="admin-content-area">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
