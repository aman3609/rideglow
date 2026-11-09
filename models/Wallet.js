
import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    balance: {
      type: Number,
      default: 0,
      min: 0,
    },

    welcomeBonusGranted: {
      type: Boolean,
      default: false,
    },

    transactions: [
      {
        type: {
          type: String,
          enum: ["credit", "debit"],
          required: true,
        },

        amount: {
          type: Number,
          required: true,
          min: 1,
        },

        description: {
          type: String,
          required: true,
        },

        paymentId: {
          type: String,
          default: null,
        },

        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Wallet =
  mongoose.models.Wallet || mongoose.model("Wallet", walletSchema);

export default Wallet;
