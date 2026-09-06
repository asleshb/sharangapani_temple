import AnnualPuja from "../models/AnnualPuja.js";

// @desc    Get Admin Dashboard Statistics for Annual Pujas from MongoDB
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const curMonth = today.getMonth() + 1;
    const curDay = today.getDate();

    const allBookings = await AnnualPuja.find({});

    const todayPujas = allBookings.filter(
      (b) => b.pujaMonth === curMonth && b.pujaDay === curDay
    ).length;

    const thisMonthBookings = allBookings.filter(
      (b) => b.pujaMonth === curMonth
    ).length;

    const upcomingPujas = allBookings.filter((b) => {
      const diffDays = (b.pujaMonth - curMonth) * 30 + (b.pujaDay - curDay);
      return diffDays >= 0 && diffDays <= 30;
    }).length;

    const totalBookings = allBookings.length;

    return res.status(200).json({
      success: true,
      stats: {
        todayPujas,
        upcomingPujas,
        thisMonthBookings,
        totalBookings,
      },
    });
  } catch (error) {
    console.error("getDashboardStats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics",
    });
  }
};
