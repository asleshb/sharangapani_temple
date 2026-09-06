import mongoose from "mongoose";

const pujaBookingSchema = new mongoose.Schema(
  {
    devoteeName: {
      type: String,
      required: [true, "Devotee name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    pujaType: {
      type: String,
      required: [true, "Puja type is required"],
      trim: true,
    },
    pujaDate: {
      type: String, // Stored as YYYY-MM-DD string to avoid timezone shifting
      required: [true, "Puja date is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const PujaBooking = mongoose.model("PujaBooking", pujaBookingSchema, "pujaBookings");

export default PujaBooking;
