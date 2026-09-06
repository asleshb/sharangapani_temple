import jwt from "jsonwebtoken";

export const protectAdmin = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }

    const secret = process.env.JWT_SECRET || "CHANGE_THIS_TO_A_LONG_RANDOM_SECRET";
    const decoded = jwt.verify(token, secret);

    if (decoded.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized as admin",
      });
    }

    req.admin = {
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
