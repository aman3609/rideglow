
import cron from "node-cron";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Rental from "@/models/Rental";
import Wallet from "@/models/Wallet";

export function startBookingCron() {
  if (globalThis.__rideGlowBookingCronStarted) return;

  globalThis.__rideGlowBookingCronStarted = true;

  cron.schedule("* * * * *", async () => {
    const session = await mongoose.startSession();

    try {
      await connectDB();

      const now = new Date();
      const fallbackDeadline = new Date(
        now.getTime() - 60 * 60 * 1000
      );

      const expiredBookings = await Rental.find({
        status: "pending",
        $or: [
          { confirmationDeadline: { $lte: now } },
          {
            confirmationDeadline: { $exists: false },
            createdAt: { $lte: fallbackDeadline },
          },
        ],
      }).select("_id");

      for (const booking of expiredBookings) {
        try {
          await session.withTransaction(async () => {
            const rental = await Rental.findOne({
              _id: booking._id,
              status: "pending",
              $or: [
                { confirmationDeadline: { $lte: now } },
                {
                  confirmationDeadline: { $exists: false },
                  createdAt: { $lte: fallbackDeadline },
                },
              ],
            }).session(session);

            if (!rental) return;

            if (rental.paymentStatus === "held") {
              const wallet = await Wallet.findOneAndUpdate(
                { user: rental.user },
                {
                  $inc: { balance: rental.totalAmount },
                  $push: {
                    transactions: {
                      type: "credit",
                      amount: rental.totalAmount,
                      description: `Automatic refund for expired booking ${rental._id}`,
                    },
                  },
                },
                { new: true, session }
              );

              if (!wallet) {
                throw new Error(
                  `Wallet not found for booking ${rental._id}`
                );
              }

              rental.paymentStatus = "refunded";
              rental.refundedAt = new Date();
            }

            rental.status = "rejected";
            await rental.save({ session });

            console.log(
              `Booking ${rental._id} automatically rejected.`
            );
          });
        } catch (error) {
          console.error(
            `Failed to process booking ${booking._id}:`,
            error
          );
        }
      }
    } catch (error) {
      console.error("Booking cron error:", error);
    } finally {
      await session.endSession();
    }
  });

  console.log("RideGlow booking cron started.");
}
