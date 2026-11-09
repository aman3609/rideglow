import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    bikeNumber: {
      type: String,
      required: true,
      unique: true,
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["available", "rented", "maintenance"],
      default: "available",
    },
  },
  { timestamps: true }
);

const Bike = mongoose.models.Bike || mongoose.model("Bike", bikeSchema);

export default Bike;
