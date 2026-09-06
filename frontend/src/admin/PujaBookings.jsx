import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import "./PujaBookings.css";

const DEFAULT_PUJA_TYPES = [
  "Special Pooja",
  "Archana",
  "Maha Pooja",
  "Ganapathi Pooja",
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const PujaBookings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeTab = searchParams.get("tab") === "add" ? "add" : "list";

  // Data state
  const [bookings, setBookings] = useState([]);
  const [pujaTypes, setPujaTypes] = useState(DEFAULT_PUJA_TYPES);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Form State (4 fields ONLY)
  const [formData, setFormData] = useState({
    devoteeName: "",
    phone: "",
    pujaType: "",
    pujaDate: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [customDate, setCustomDate] = useState("");

  // Modals State
  const [viewingBooking, setViewingBooking] = useState(null);
  const [deletingBooking, setDeletingBooking] = useState(null);

  useEffect(() => {
    fetchPujaTypes();
    fetchBookings();
  }, [searchQuery, dateFilter, customDate]);

  const getHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const getApiUrl = () => import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchPujaTypes = async () => {
    try {
      const res = await fetch(`${getApiUrl()}/api/annual-pujas/types`, {
        headers: getHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success && data.pujaTypes) {
        setPujaTypes(data.pujaTypes);
      }
    } catch (err) {
      console.error("Failed to load puja types", err);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let url = `${getApiUrl()}/api/annual-pujas?`;
      if (searchQuery.trim()) {
        url += `search=${encodeURIComponent(searchQuery.trim())}&`;
      }
      if (dateFilter === "custom" && customDate) {
        url += `date=${customDate}&`;
      } else if (dateFilter !== "all") {
        url += `filter=${dateFilter}&`;
      }

      const res = await fetch(url, { headers: getHeaders() });
      const data = await res.json();

      if (res.ok && data.success) {
        setBookings(data.bookings || []);
      } else {
        showAlert("error", data.message || "Failed to fetch Annual Pujas");
      }
    } catch (err) {
      showAlert("error", "Server unavailable. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert({ type: "", message: "" });
    }, 4000);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    // Validation
    if (!formData.devoteeName.trim()) {
      showAlert("error", "Please enter devotee name.");
      return;
    }

    const cleanPhone = formData.phone.trim();
    if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      showAlert("error", "Please enter a valid 10-digit phone number.");
      return;
    }

    if (!formData.pujaType) {
      showAlert("error", "Please select a puja type.");
      return;
    }

    if (!formData.pujaDate) {
      showAlert("error", "Please select an annual puja date.");
      return;
    }

    try {
      const isEdit = Boolean(editingId);
      const url = isEdit
        ? `${getApiUrl()}/api/annual-pujas/${editingId}`
        : `${getApiUrl()}/api/annual-pujas`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save Annual Puja");
      }

      showAlert(
        "success",
        isEdit ? "Annual Puja updated successfully." : "Annual Puja saved successfully."
      );

      // Reset form
      setFormData({ devoteeName: "", phone: "", pujaType: "", pujaDate: "" });
      setEditingId(null);

      // Switch to list tab & refresh data
      setSearchParams({});
      fetchBookings();
    } catch (err) {
      showAlert("error", err.message || "Something went wrong.");
    }
  };

  const handleEditClick = (booking) => {
    setEditingId(booking._id);
    setFormData({
      devoteeName: booking.devoteeName,
      phone: booking.phone,
      pujaType: booking.pujaType,
      pujaDate: booking.pujaDate || `2026-${String(booking.pujaMonth).padStart(2, "0")}-${String(booking.pujaDay).padStart(2, "0")}`,
    });
    setSearchParams({ tab: "add" });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBooking) return;

    try {
      const res = await fetch(`${getApiUrl()}/api/annual-pujas/${deletingBooking._id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showAlert("success", "Annual Puja deleted successfully.");
        setDeletingBooking(null);
        fetchBookings();
      } else {
        showAlert("error", data.message || "Failed to delete Annual Puja.");
      }
    } catch (err) {
      showAlert("error", "Failed to delete Annual Puja. Server unavailable.");
    }
  };

  const formatAnnualDateDisplay = (booking) => {
    if (booking.annualDateText) return booking.annualDateText;
    if (booking.pujaMonth && booking.pujaDay) {
      return `${MONTH_NAMES[booking.pujaMonth - 1]} ${booking.pujaDay}`;
    }
    if (booking.pujaDate && booking.pujaDate.includes("-")) {
      const parts = booking.pujaDate.split("-");
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      return `${MONTH_NAMES[m - 1]} ${d}`;
    }
    return booking.pujaDate || "";
  };

  return (
    <AdminLayout>
      <div className="pujas-management-container">
        {/* Navigation Tabs */}
        <div className="pujas-header-tabs">
          <div className="tab-buttons-group">
            <button
              className={`tab-btn ${activeTab === "list" ? "active" : ""}`}
              onClick={() => {
                setEditingId(null);
                setFormData({ devoteeName: "", phone: "", pujaType: "", pujaDate: "" });
                setSearchParams({});
              }}
            >
              📋 All Annual Pujas
            </button>

            <button
              className={`tab-btn ${activeTab === "add" ? "active" : ""}`}
              onClick={() => setSearchParams({ tab: "add" })}
            >
              ➕ {editingId ? "Edit Annual Puja" : "Add Annual Puja"}
            </button>

            <button
              className="tab-btn"
              onClick={() => navigate("/admin/pujas/calendar")}
            >
              📅 Calendar
            </button>
          </div>
        </div>

        {/* Global Alert Notification */}
        {alert.message && (
          <div className={`booking-alert-box ${alert.type}`}>
            <span>{alert.type === "success" ? "✅" : "⚠️"}</span> {alert.message}
          </div>
        )}

        {/* Tab 1: ADD / EDIT FORM */}
        {activeTab === "add" && (
          <div className="puja-form-card">
            <h2>{editingId ? "Edit Annual Puja" : "Add Annual Puja"}</h2>

            <form className="puja-form" onSubmit={handleFormSubmit}>
              <div className="form-field-group">
                <label htmlFor="devoteeName">Devotee Name *</label>
                <input
                  id="devoteeName"
                  type="text"
                  placeholder="Ravi Kumar"
                  value={formData.devoteeName}
                  onChange={(e) => setFormData({ ...formData, devoteeName: e.target.value })}
                  required
                />
              </div>

              <div className="form-field-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                  required
                />
              </div>

              <div className="form-field-group">
                <label htmlFor="pujaType">Puja Type *</label>
                <select
                  id="pujaType"
                  value={formData.pujaType}
                  onChange={(e) => setFormData({ ...formData, pujaType: e.target.value })}
                  required
                >
                  <option value="">Select Puja ▼</option>
                  {pujaTypes.map((type, idx) => (
                    <option key={idx} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field-group">
                <label htmlFor="pujaDate">Annual Puja Date *</label>
                <input
                  id="pujaDate"
                  type="date"
                  value={formData.pujaDate}
                  onChange={(e) => setFormData({ ...formData, pujaDate: e.target.value })}
                  required
                />
                <span style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)", marginTop: "2px" }}>
                  ℹ️ This Annual Puja will be observed every year on this date.
                </span>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button type="submit" className="form-submit-btn" style={{ flex: 1 }}>
                  {editingId ? "UPDATE ANNUAL PUJA" : "SAVE ANNUAL PUJA"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="form-cancel-btn"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ devoteeName: "", phone: "", pujaType: "", pujaDate: "" });
                      setSearchParams({});
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: ALL ANNUAL PUJAS LIST */}
        {activeTab === "list" && (
          <div className="pujas-table-card">
            {/* Filters Bar */}
            <div className="filters-bar">
              <div className="search-input-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="date-filter-group">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">📅 All Dates</option>
                  <option value="today">Today's Pujas</option>
                  <option value="upcoming">Upcoming (30 Days)</option>
                  <option value="thisMonth">This Month</option>
                  <option value="custom">Custom Date</option>
                </select>

                {dateFilter === "custom" && (
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                  />
                )}
              </div>
            </div>

            {loading ? (
              <p style={{ padding: "20px", textAlign: "center", color: "var(--admin-text-muted)" }}>
                Loading Annual Pujas...
              </p>
            ) : bookings.length === 0 ? (
              <p style={{ padding: "24px", textAlign: "center", color: "var(--admin-text-muted)" }}>
                No Annual Pujas found.
              </p>
            ) : (
              <>
                {/* Desktop View: Table */}
                <div className="desktop-table-container">
                  <div className="table-responsive-wrapper">
                    <table className="bookings-data-table">
                      <thead>
                        <tr>
                          <th>Annual Date</th>
                          <th>Devotee Name</th>
                          <th>Phone</th>
                          <th>Puja Type</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking._id}>
                            <td style={{ fontWeight: 700, color: "var(--admin-maroon)" }}>
                              {formatAnnualDateDisplay(booking)}
                            </td>
                            <td style={{ fontWeight: 600 }}>{booking.devoteeName}</td>
                            <td>{booking.phone}</td>
                            <td>
                              <span className="mobile-card-type">
                                {booking.pujaType}
                              </span>
                            </td>
                            <td>
                              <div className="action-btns-cell">
                                <button
                                  className="action-btn view"
                                  onClick={() => setViewingBooking(booking)}
                                >
                                  View
                                </button>
                                <button
                                  className="action-btn edit"
                                  onClick={() => handleEditClick(booking)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="action-btn delete"
                                  onClick={() => setDeletingBooking(booking)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile View: Dedicated Annual Puja Cards */}
                <div className="mobile-booking-cards-container">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="mobile-booking-card">
                      <div className="mobile-card-header">
                        <span className="mobile-card-date">
                          📅 {formatAnnualDateDisplay(booking)}
                        </span>
                        <span className="mobile-card-type">{booking.pujaType}</span>
                      </div>

                      <div className="mobile-card-body">
                        <div className="mobile-card-field">
                          <span>👤</span> <strong>{booking.devoteeName}</strong>
                        </div>
                        <div className="mobile-card-field">
                          <span>📱</span> {booking.phone}
                        </div>
                      </div>

                      <div className="mobile-card-actions">
                        <button
                          className="action-btn view"
                          onClick={() => setViewingBooking(booking)}
                        >
                          View
                        </button>
                        <button
                          className="action-btn edit"
                          onClick={() => handleEditClick(booking)}
                        >
                          Edit
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => setDeletingBooking(booking)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* View Booking Details Modal */}
        {viewingBooking && (
          <div className="modal-backdrop-overlay" onClick={() => setViewingBooking(null)}>
            <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
              <h3>Annual Puja Details</h3>

              <div className="detail-row">
                <strong>Devotee Name:</strong>
                <span>{viewingBooking.devoteeName}</span>
              </div>

              <div className="detail-row">
                <strong>Phone Number:</strong>
                <span>{viewingBooking.phone}</span>
              </div>

              <div className="detail-row">
                <strong>Puja Type:</strong>
                <span>{viewingBooking.pujaType}</span>
              </div>

              <div className="detail-row">
                <strong>Annual Date:</strong>
                <span>{formatAnnualDateDisplay(viewingBooking)}</span>
              </div>

              <div className="detail-row">
                <strong>Registered On:</strong>
                <span>
                  {viewingBooking.createdAt
                    ? new Date(viewingBooking.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>

              <div className="modal-actions-footer">
                <button
                  className="action-btn edit"
                  style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                  onClick={() => {
                    const target = viewingBooking;
                    setViewingBooking(null);
                    handleEditClick(target);
                  }}
                >
                  EDIT
                </button>

                <button
                  className="action-btn delete"
                  style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                  onClick={() => {
                    const target = viewingBooking;
                    setViewingBooking(null);
                    setDeletingBooking(target);
                  }}
                >
                  DELETE
                </button>

                <button
                  className="form-cancel-btn"
                  onClick={() => setViewingBooking(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingBooking && (
          <div className="modal-backdrop-overlay" onClick={() => setDeletingBooking(null)}>
            <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: "var(--admin-error-text)" }}>Confirm Deletion</h3>
              <p style={{ margin: "14px 0", color: "var(--admin-text)", fontSize: "0.9rem" }}>
                Are you sure you want to delete the Annual Puja for{" "}
                <strong>{deletingBooking.devoteeName}</strong> on{" "}
                <strong>{formatAnnualDateDisplay(deletingBooking)}</strong>?
              </p>

              <div className="modal-actions-footer">
                <button
                  className="form-cancel-btn"
                  onClick={() => setDeletingBooking(null)}
                >
                  Cancel
                </button>
                <button
                  className="action-btn delete"
                  style={{ padding: "8px 18px", fontSize: "0.85rem" }}
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PujaBookings;
