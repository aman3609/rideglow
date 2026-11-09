
import mongoose from "mongoose";
import connectDB from "../lib/mongodb.js";
import User from "../models/User.js";
import Wallet from "../models/Wallet.js";

const WELCOME_BONUS = 1000;

async function grantWelcomeBonus() {
  try {
    await connectDB();

    const users = await User.find().select("_id email").lean();

    let granted = 0;
    let skipped = 0;

    for (const user of users) {
      const existingWallet = await Wallet.findOne({
        user: user._id,
      });

      if (existingWallet?.welcomeBonusGranted) {
        skipped++;
        continue;
      }

      if (existingWallet) {
        const result = await Wallet.updateOne(
          {
            _id: existingWallet._id,
            welcomeBonusGranted: { $ne: true },
          },
          {
            $inc: { balance: WELCOME_BONUS },
            $set: { welcomeBonusGranted: true },
            $push: {
              transactions: {
                type: "credit",
                amount: WELCOME_BONUS,
                description: "RideGlow Welcome Bonus",
              },
            },
          }
        );

        if (result.modifiedCount === 1) {
          granted++;
        } else {
          skipped++;
        }
      } else {
        try {
          await Wallet.create({
            user: user._id,
            balance: WELCOME_BONUS,
            welcomeBonusGranted: true,
            transactions: [
              {
                type: "credit",
                amount: WELCOME_BONUS,
                description: "RideGlow Welcome Bonus",
              },
            ],
          });

          granted++;
        } catch (error) {
          if (error.code === 11000) {
            skipped++;
          } else {
            throw error;
          }
        }
      }
    }

    console.log("Welcome bonus migration completed!");
    console.log("Total users:", users.length);
    console.log("Bonus granted:", granted);
    console.log("Already received:", skipped);
  } catch (error) {
    console.error("Welcome bonus migration failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

grantWelcomeBonus();
