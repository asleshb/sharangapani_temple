import PujaBooking from "../models/PujaBooking.js";

// Allowed initial Puja types
const PUJA_TYPES = [
  "Special Pooja",
  "Archana",
  "Maha Pooja",
  "Ganapathi Pooja",
];

// Helper: Format Date to YYYY-MM-DD
const formatDateString = (dateObj) => {
  const d = new Date(dateObj);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// @desc    Get supported Puja types
// @route   GET /api/pujas/types
// @access  Private (Admin)
export const getPujaTypes = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      pujaTypes: PUJA_TYPES,
    });
  } catch (error) {
    console.error("getPujaTypes Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Create a new Puja Booking
// @route   POST /api/pujas
// @access  Private (Admin)
export const createBooking = async (req, res) => {
  try {
    const { devoteeName, phone, pujaType, pujaDate } = req.body;

    if (!devoteeName || !devoteeName.trim()) {
      return res.status(400).json({ success: false, message: "Please enter devotee name." });
    }

    const cleanPhone = phone ? String(phone).trim() : "";
    if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({ success: false, message: "Please enter a valid 10-digit phone number." });
    }

    if (!pujaType || !pujaType.trim()) {
      return res.status(400).json({ success: false, message: "Please select a puja type." });
    }

    if (!pujaDate || !pujaDate.trim()) {
      return res.status(400).json({ success: false, message: "Please select a puja date." });
    }

    const booking = await PujaBooking.create({
      devoteeName: devoteeName.trim(),
      phone: cleanPhone,
      pujaType: pujaType.trim(),
      pujaDate: pujaDate.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Booking saved successfully.",
      booking,
    });
  } catch (error) {
    console.error("createBooking Error:", error);
    return res.status(500).json({ success: false, message: "Failed to create booking." });
  }
};

// @desc    Get all Puja Bookings with optional search & date filters
// @route   GET /api/pujas
// @access  Private (Admin)
export const getBookings = async (req, res) => {
  try {
    const { search, date, filter } = req.query;

    let query = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { devoteeName: searchRegex },
        { phone: searchRegex },
      ];
    }

    if (date && date.trim()) {
      query.pujaDate = date.trim();
    } else if (filter) {
      const today = new Date();
      const todayStr = formatDateString(today);

      if (filter === "today") {
        query.pujaDate = todayStr;
      } else if (filter === "tomorrow") {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        query.pujaDate = formatDateString(tomorrow);
      } else if (filter === "thisWeek") {
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 7);
        const endStr = formatDateString(endOfWeek);
        query.pujaDate = { $gte: todayStr, $lte: endStr };
      } else if (filter === "thisMonth") {
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const monthPrefix = `${year}-${month}`;
        query.pujaDate = { $regex: `^${monthPrefix}` };
      }
    }

    const bookings = await PujaBooking.find(query).sort({ pujaDate: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("getBookings Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch bookings." });
  }
};

// @desc    Get single Puja Booking by ID
// @route   GET /api/pujas/:id
// @access  Private (Admin)
export const getBookingById = async (req, res) => {
  try {
    const booking = await PujaBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("getBookingById Error:", error);
    return res.status(500).json({ success: false, message: "Invalid booking ID." });
  }
};

// @desc    Update an existing Puja Booking
// @route   PUT /api/pujas/:id
// @access  Private (Admin)
export const updateBooking = async (req, res) => {
  try {
    const { devoteeName, phone, pujaType, pujaDate } = req.body;

    const booking = await PujaBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    if (!devoteeName || !devoteeName.trim()) {
      return res.status(400).json({ success: false, message: "Please enter devotee name." });
    }

    const cleanPhone = phone ? String(phone).trim() : "";
    if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({ success: false, message: "Please enter a valid 10-digit phone number." });
    }

    if (!pujaType || !pujaType.trim()) {
      return res.status(400).json({ success: false, message: "Please select a puja type." });
    }

    if (!pujaDate || !pujaDate.trim()) {
      return res.status(400).json({ success: false, message: "Please select a puja date." });
    }

    booking.devoteeName = devoteeName.trim();
    booking.phone = cleanPhone;
    booking.pujaType = pujaType.trim();
    booking.pujaDate = pujaDate.trim();
    booking.updatedAt = Date.now();

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully.",
      booking,
    });
  } catch (error) {
    console.error("updateBooking Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update booking." });
  }
};

// @desc    Delete a Puja Booking
// @route   DELETE /api/pujas/:id
// @access  Private (Admin)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await PujaBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    await PujaBooking.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully.",
    });
  } catch (error) {
    console.error("deleteBooking Error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete booking." });
  }
};
