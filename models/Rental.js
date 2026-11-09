
import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    durationType: {
      type: String,
      enum: ["hourly", "daily"],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "active",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "held", "refunded", "released"],
      default: "unpaid",
    },
    sellerPaymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    confirmationDeadline: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 60 * 1000),
    },
    refundedAt: {
      type: Date,
      default: null,
    },
    releasedAt: {
      type: Date,
      default: null,
    },
    qrCode: {
      type: String,
      default: "",
    },

    // Actual pickup and rental timing
    pickupConfirmation: {
      renterConfirmed: { type: Boolean, default: false },
      sellerConfirmed: { type: Boolean, default: false },
      renterConfirmedAt: { type: Date, default: null },
      sellerConfirmedAt: { type: Date, default: null },
    },
    actualStartAt: {
      type: Date,
      default: null,
    },
    actualEndAt: {
      type: Date,
      default: null,
    },

    // Vehicle return confirmation
    returnConfirmation: {
      renterConfirmed: { type: Boolean, default: false },
      sellerConfirmed: { type: Boolean, default: false },
      renterConfirmedAt: { type: Date, default: null },
      sellerConfirmedAt: { type: Date, default: null },
    },
    completedAt: {
      type: Date,
      default: null,
    },

    // Late return charges
    lateFee: {
      hourlyRate: { type: Number, default: 0, min: 0 },
      totalAmount: { type: Number, default: 0, min: 0 },
      paidToSeller: { type: Number, default: 0, min: 0 },
      lastCalculatedAt: { type: Date, default: null },
    },

    // Dispute and evidence
    dispute: {
      status: {
        type: String,
        enum: ["none", "open", "resolved"],
        default: "none",
      },
      raisedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      reason: {
        type: String,
        default: "",
      },
      renterEvidence: {
        type: [String],
        default: [],
      },
      sellerEvidence: {
        type: [String],
        default: [],
      },
      adminDecision: {
        type: String,
        enum: ["pending", "renter", "seller"],
        default: "pending",
      },
      adminNote: {
        type: String,
        default: "",
      },
      resolvedAt: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true }
);

const Rental =
  mongoose.models.Rental || mongoose.model("Rental", rentalSchema);

export default Rental;
