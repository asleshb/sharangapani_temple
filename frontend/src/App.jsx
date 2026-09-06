import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./admin/Dashboard";
import PujaBookings from "./admin/PujaBookings";
import PujaCalendar from "./admin/PujaCalendar";
import WhatsAppBannerDemo from "./pages/WhatsAppBannerDemo";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Temple Website */}
        <Route path="/" element={<Home />} />

        {/* Live Temple WhatsApp Banner Preview & Demo Route */}
        <Route path="/whatsapp-banner" element={<WhatsAppBannerDemo />} />

        {/* Admin Authentication Routes */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Dashboard & Management Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pujas"
          element={
            <ProtectedRoute>
              <PujaBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pujas/calendar"
          element={
            <ProtectedRoute>
              <PujaCalendar />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;