import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import "./PujaCalendar.css";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_HEADER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Helper: Check if year is leap year
const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const PujaCalendar = () => {
  const navigate = useNavigate();

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [bookings, setBookings] = useState([]);
  const [selectedDateStr, setSelectedDateStr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMonthBookings();
  }, [currentYear, currentMonth]);

  const getHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const getApiUrl = () => import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchMonthBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${getApiUrl()}/api/annual-pujas?filter=thisMonth&year=${currentYear}`,
        {
          headers: getHeaders(),
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error("Failed to load month bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDateStr("");
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDateStr("");
  };

  const handlePrevYear = () => {
    setCurrentYear(currentYear - 1);
    setSelectedDateStr("");
  };

  const handleNextYear = () => {
    setCurrentYear(currentYear + 1);
    setSelectedDateStr("");
  };

  // Days in month calculation for selected year/month
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Map annual pujas by day for selected month
  const targetMonthNum = currentMonth + 1;
  const bookingsByDayMap = {};
  bookings.forEach((b) => {
    if (b.pujaMonth === targetMonthNum) {
      let dayKey = b.pujaDay;
      // Feb 29 non-leap year mapping to Feb 28 display
      if (targetMonthNum === 2 && b.pujaDay === 29 && !isLeapYear(currentYear)) {
        dayKey = 28;
      }
      if (!bookingsByDayMap[dayKey]) {
        bookingsByDayMap[dayKey] = [];
      }
      bookingsByDayMap[dayKey].push(b);
    }
  });

  const selectedDayNum = selectedDateStr ? parseInt(selectedDateStr.split("-")[2], 10) : 0;
  const selectedDayBookings = selectedDayNum ? bookingsByDayMap[selectedDayNum] || [] : [];

  return (
    <AdminLayout>
      <div className="calendar-view-container">
        <div style={{ display: "flex", gap: "12px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="tab-btn" onClick={() => navigate("/admin/pujas")}>
              📋 All Annual Pujas
            </button>
            <button className="tab-btn" onClick={() => navigate("/admin/pujas?tab=add")}>
              ➕ Add Annual Puja
            </button>
          </div>

          {/* Year Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--admin-card)", padding: "4px 12px", borderRadius: "8px", border: "1px solid var(--admin-gold-border)" }}>
            <button className="calendar-nav-btn" style={{ padding: "4px 10px", fontSize: "0.8rem" }} onClick={handlePrevYear}>
              ‹
            </button>
            <span style={{ fontWeight: "700", color: "var(--admin-maroon)", fontSize: "1rem" }}>
              {currentYear}
            </span>
            <button className="calendar-nav-btn" style={{ padding: "4px 10px", fontSize: "0.8rem" }} onClick={handleNextYear}>
              ›
            </button>
          </div>
        </div>

        <div className="calendar-card-wrapper">
          {/* Month Header Controls */}
          <div className="calendar-header-controls">
            <button className="calendar-nav-btn" onClick={handlePrevMonth}>
              ◄ Prev
            </button>

            <h2 className="calendar-month-title">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>

            <button className="calendar-nav-btn" onClick={handleNextMonth}>
              Next ►
            </button>
          </div>

          {/* Days Header */}
          <div className="calendar-grid-table">
            {DAYS_HEADER.map((day, idx) => (
              <div key={idx} className="calendar-day-header">
                {day}
              </div>
            ))}

            {/* Empty offset cells */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="calendar-day-cell empty"></div>
            ))}

            {/* Month Day Cells */}
            {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const dayBookings = bookingsByDayMap[dayNum] || [];
              const count = dayBookings.length;
              const isSelected = selectedDateStr === dateStr;

              return (
                <div
                  key={dayNum}
                  className={`calendar-day-cell ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedDateStr(dateStr)}
                >
                  <div className="calendar-day-number">{dayNum}</div>
                  {count > 0 && (
                    <div className="booking-badge-indicator">
                      <span>•</span> {count} {count === 1 ? "Annual" : "Annuals"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details Panel */}
        {selectedDateStr && (
          <div className="day-details-panel">
            <h3>
              Annual Pujas on {MONTH_NAMES[currentMonth]} {selectedDayNum}, {currentYear} ({selectedDayBookings.length})
            </h3>

            {selectedDayBookings.length === 0 ? (
              <p style={{ color: "var(--admin-text-muted)" }}>No Annual Pujas scheduled on this calendar date.</p>
            ) : (
              <div className="day-bookings-list">
                {selectedDayBookings.map((b) => (
                  <div key={b._id} className="day-booking-item">
                    <div className="day-booking-info">
                      <strong>{b.devoteeName}</strong>
                      <span>📞 {b.phone}</span>
                      {currentMonth === 1 && b.pujaDay === 29 && !isLeapYear(currentYear) && (
                        <span style={{ color: "#b91c1c", fontSize: "0.78rem" }}>
                          (Annual date: Feb 29 — Observed Feb 28 in non-leap years)
                        </span>
                      )}
                    </div>
                    <div className="day-booking-type">{b.pujaType}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PujaCalendar;
