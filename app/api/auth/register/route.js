
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Wallet from "@/models/Wallet";
import bcrypt from "bcryptjs";

const WELCOME_BONUS = 1000;
const WELCOME_BONUS_ENABLED = true;

export async function POST(request) {
  const session = await mongoose.startSession();

  try {
    await connectDB();

    const { name, email, password, phone } = await request.json();

    if (!name?.trim() || !email?.trim() || !password || !phone?.trim()) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        {
          success: false,
          message: "Password must be at least 6 characters",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return Response.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let createdUser;

    await session.withTransaction(async () => {
      const [user] = await User.create(
        [
          {
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            phone: phone.trim(),
          },
        ],
        { session }
      );

      createdUser = user;

      const bonusEnabled = WELCOME_BONUS_ENABLED;

      await Wallet.create(
        [
          {
            user: user._id,
            balance: bonusEnabled ? WELCOME_BONUS : 0,
            welcomeBonusGranted: bonusEnabled,
            transactions: bonusEnabled
              ? [
                  {
                    type: "credit",
                    amount: WELCOME_BONUS,
                    description: "RideGlow Welcome Bonus",
                  },
                ]
              : [],
          },
        ],
        { session }
      );
    });

    return Response.json(
      {
        success: true,
        message: "Registration successful. ₹1,000 welcome bonus added!",
        user: {
          id: createdUser._id,
          name: createdUser.name,
          email: createdUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      return Response.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    return Response.json(
      { success: false, message: "Registration failed. Please try again." },
      { status: 500 }
    );
  } finally {
    await session.endSession();
  }
}
