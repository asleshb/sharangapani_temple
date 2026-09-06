import mongoose from "mongoose";

const annualPujaSchema = new mongoose.Schema(
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
    pujaMonth: {
      type: Number, // 1 - 12
      required: [true, "Puja month is required"],
      min: 1,
      max: 12,
    },
    pujaDay: {
      type: Number, // 1 - 31
      required: [true, "Puja day is required"],
      min: 1,
      max: 31,
    },
  },
  {
    timestamps: true, // Manages createdAt and updatedAt
  }
);

// Compound index to prevent exact duplicate Annual Pujas for the same devotee
annualPujaSchema.index(
  { devoteeName: 1, phone: 1, pujaType: 1, pujaMonth: 1, pujaDay: 1 },
  { unique: true }
);

const AnnualPuja = mongoose.model("AnnualPuja", annualPujaSchema, "annualPujas");

export default AnnualPuja;
