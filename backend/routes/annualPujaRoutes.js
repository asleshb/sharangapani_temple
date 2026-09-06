import express from "express";
import {
  getPujaTypes,
  createAnnualPuja,
  getAnnualPujas,
  getAnnualPujaById,
  updateAnnualPuja,
  deleteAnnualPuja,
} from "../controllers/annualPujaController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply admin protection middleware to all routes
router.use(protectAdmin);

router.get("/types", getPujaTypes);
router.get("/", getAnnualPujas);
router.post("/", createAnnualPuja);
router.get("/:id", getAnnualPujaById);
router.put("/:id", updateAnnualPuja);
router.delete("/:id", deleteAnnualPuja);

export default router;
