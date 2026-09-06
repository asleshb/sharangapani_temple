import jwt from "jsonwebtoken";

// @desc    Authenticate admin & generate JWT token
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const envEmail = (process.env.ADMIN_EMAIL || "admin@temple.com").toLowerCase().trim();
    const envPassword = process.env.ADMIN_PASSWORD || "123";

    const inputEmail = email.toLowerCase().trim();

    // Check credentials against environment variables
    if (inputEmail !== envEmail || password !== envPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const secret = process.env.JWT_SECRET || "CHANGE_THIS_TO_A_LONG_RANDOM_SECRET";

    // Generate JWT token containing role and email
    const token = jwt.sign(
      { role: "admin", email: envEmail },
      secret,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        email: envEmail,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server unavailable. Please try again later.",
    });
  }
};

// @desc    Get authenticated admin profile
// @route   GET /api/auth/me
// @access  Private (Admin)
export const getMe = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    return res.status(200).json({
      success: true,
      admin: {
        email: req.admin.email,
        role: req.admin.role,
      },
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
