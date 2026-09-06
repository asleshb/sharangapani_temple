import express from "express";
import {
  getPujaTypes,
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../controllers/pujaController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply admin protection middleware to all routes
router.use(protectAdmin);

router.get("/types", getPujaTypes);
router.get("/", getBookings);
router.post("/", createBooking);
router.get("/:id", getBookingById);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;
