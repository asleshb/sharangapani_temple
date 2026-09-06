import AnnualPuja from "../models/AnnualPuja.js";
import PujaBooking from "../models/PujaBooking.js";

const PUJA_TYPES = [
  "Special Pooja",
  "Archana",
  "Maha Pooja",
  "Ganapathi Pooja",
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Helper: Migrate any legacy PujaBooking records to AnnualPuja collection
const migrateLegacyRecords = async () => {
  try {
    const legacyRecords = await PujaBooking.find({});
    if (legacyRecords.length > 0) {
      for (const rec of legacyRecords) {
        if (rec.pujaDate && rec.pujaDate.includes("-")) {
          const parts = rec.pujaDate.split("-");
          const m = parseInt(parts[1], 10);
          const d = parseInt(parts[2], 10);
          if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
            await AnnualPuja.updateOne(
              {
                devoteeName: rec.devoteeName,
                phone: rec.phone,
                pujaType: rec.pujaType,
                pujaMonth: m,
                pujaDay: d,
              },
              {
                $setOnInsert: {
                  devoteeName: rec.devoteeName,
                  phone: rec.phone,
                  pujaType: rec.pujaType,
                  pujaMonth: m,
                  pujaDay: d,
                  createdAt: rec.createdAt || new Date(),
                },
              },
              { upsert: true }
            );
          }
        }
      }
      // Clean up legacy collection after successful migration
      await PujaBooking.deleteMany({});
    }
  } catch (err) {
    console.error("Migration error (non-fatal):", err.message);
  }
};

// @desc    Get supported Puja types
// @route   GET /api/annual-pujas/types
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

// @desc    Create a new Annual Puja
// @route   POST /api/annual-pujas
// @access  Private (Admin)
export const createAnnualPuja = async (req, res) => {
  try {
    await migrateLegacyRecords();

    const { devoteeName, phone, pujaType, pujaDate, pujaMonth, pujaDay } = req.body;

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

    let m = parseInt(pujaMonth, 10);
    let d = parseInt(pujaDay, 10);

    // Parse date if string YYYY-MM-DD provided
    if ((!m || !d) && pujaDate) {
      const parts = String(pujaDate).split("-");
      if (parts.length === 3) {
        m = parseInt(parts[1], 10);
        d = parseInt(parts[2], 10);
      }
    }

    if (!m || !d || m < 1 || m > 12 || d < 1 || d > 31) {
      return res.status(400).json({ success: false, message: "Please select a valid annual puja date." });
    }

    const cleanName = devoteeName.trim();
    const cleanType = pujaType.trim();

    // Check for accidental exact duplicate Annual Puja
    const existing = await AnnualPuja.findOne({
      devoteeName: cleanName,
      phone: cleanPhone,
      pujaType: cleanType,
      pujaMonth: m,
      pujaDay: d,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This Annual Puja already exists.",
      });
    }

    const booking = await AnnualPuja.create({
      devoteeName: cleanName,
      phone: cleanPhone,
      pujaType: cleanType,
      pujaMonth: m,
      pujaDay: d,
    });

    // Helper formatted annual text
    const formattedBooking = booking.toObject();
    formattedBooking.pujaDate = `2026-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    formattedBooking.annualDateText = `${MONTH_NAMES[m - 1]} ${d}`;

    return res.status(201).json({
      success: true,
      message: "Annual Puja saved successfully.",
      booking: formattedBooking,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "This Annual Puja already exists." });
    }
    console.error("createAnnualPuja Error:", error);
    return res.status(500).json({ success: false, message: "Failed to save Annual Puja." });
  }
};

// @desc    Get all Annual Pujas with search & filters
// @route   GET /api/annual-pujas
// @access  Private (Admin)
export const getAnnualPujas = async (req, res) => {
  try {
    await migrateLegacyRecords();

    const { search, filter, date, year } = req.query;

    let query = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { devoteeName: searchRegex },
        { phone: searchRegex },
      ];
    }

    const today = new Date();
    const curMonth = today.getMonth() + 1;
    const curDay = today.getDate();

    if (date && date.trim()) {
      const parts = date.trim().split("-");
      if (parts.length === 3) {
        query.pujaMonth = parseInt(parts[1], 10);
        query.pujaDay = parseInt(parts[2], 10);
      }
    } else if (filter) {
      if (filter === "today") {
        query.pujaMonth = curMonth;
        query.pujaDay = curDay;
      } else if (filter === "thisMonth") {
        query.pujaMonth = curMonth;
      }
    }

    let bookings = await AnnualPuja.find(query).sort({ pujaMonth: 1, pujaDay: 1, createdAt: -1 });

    const reqYear = year ? parseInt(year, 10) : today.getFullYear();

    // Map bookings with formatted date text
    let formattedBookings = bookings.map((b) => {
      const obj = b.toObject();
      const mStr = String(obj.pujaMonth).padStart(2, "0");
      const dStr = String(obj.pujaDay).padStart(2, "0");
      obj.pujaDate = `${reqYear}-${mStr}-${dStr}`;
      obj.annualDateText = `${MONTH_NAMES[obj.pujaMonth - 1]} ${obj.pujaDay}`;
      return obj;
    });

    if (filter === "tomorrow") {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const tMonth = tomorrow.getMonth() + 1;
      const tDay = tomorrow.getDate();
      formattedBookings = formattedBookings.filter(
        (b) => b.pujaMonth === tMonth && b.pujaDay === tDay
      );
    } else if (filter === "upcoming") {
      // Upcoming in next 30 days
      formattedBookings = formattedBookings.filter((b) => {
        const diffDays = (b.pujaMonth - curMonth) * 30 + (b.pujaDay - curDay);
        return diffDays >= 0 && diffDays <= 30;
      });
    }

    return res.status(200).json({
      success: true,
      count: formattedBookings.length,
      bookings: formattedBookings,
    });
  } catch (error) {
    console.error("getAnnualPujas Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch Annual Pujas." });
  }
};

// @desc    Get single Annual Puja by ID
// @route   GET /api/annual-pujas/:id
// @access  Private (Admin)
export const getAnnualPujaById = async (req, res) => {
  try {
    const booking = await AnnualPuja.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Annual Puja not found." });
    }

    const obj = booking.toObject();
    const mStr = String(obj.pujaMonth).padStart(2, "0");
    const dStr = String(obj.pujaDay).padStart(2, "0");
    obj.pujaDate = `2026-${mStr}-${dStr}`;
    obj.annualDateText = `${MONTH_NAMES[obj.pujaMonth - 1]} ${obj.pujaDay}`;

    return res.status(200).json({
      success: true,
      booking: obj,
    });
  } catch (error) {
    console.error("getAnnualPujaById Error:", error);
    return res.status(500).json({ success: false, message: "Invalid ID." });
  }
};

// @desc    Update an existing Annual Puja
// @route   PUT /api/annual-pujas/:id
// @access  Private (Admin)
export const updateAnnualPuja = async (req, res) => {
  try {
    const { devoteeName, phone, pujaType, pujaDate, pujaMonth, pujaDay } = req.body;

    const booking = await AnnualPuja.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Annual Puja not found." });
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

    let m = parseInt(pujaMonth, 10);
    let d = parseInt(pujaDay, 10);

    if ((!m || !d) && pujaDate) {
      const parts = String(pujaDate).split("-");
      if (parts.length === 3) {
        m = parseInt(parts[1], 10);
        d = parseInt(parts[2], 10);
      }
    }

    if (!m || !d || m < 1 || m > 12 || d < 1 || d > 31) {
      return res.status(400).json({ success: false, message: "Please select a valid annual puja date." });
    }

    booking.devoteeName = devoteeName.trim();
    booking.phone = cleanPhone;
    booking.pujaType = pujaType.trim();
    booking.pujaMonth = m;
    booking.pujaDay = d;

    await booking.save();

    const obj = booking.toObject();
    obj.pujaDate = `2026-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    obj.annualDateText = `${MONTH_NAMES[m - 1]} ${d}`;

    return res.status(200).json({
      success: true,
      message: "Annual Puja updated successfully.",
      booking: obj,
    });
  } catch (error) {
    console.error("updateAnnualPuja Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update Annual Puja." });
  }
};

// @desc    Delete an Annual Puja
// @route   DELETE /api/annual-pujas/:id
// @access  Private (Admin)
export const deleteAnnualPuja = async (req, res) => {
  try {
    const booking = await AnnualPuja.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Annual Puja not found." });
    }

    await AnnualPuja.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Annual Puja deleted successfully.",
    });
  } catch (error) {
    console.error("deleteAnnualPuja Error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete Annual Puja." });
  }
};
