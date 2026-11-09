
import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ["bike", "car"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    description: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    pricePerHour: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 1,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "rented", "maintenance", "removed"],
      default: "available",
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Vehicle =
  mongoose.models.Vehicle ||
  mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
