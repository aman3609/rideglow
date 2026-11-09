
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Wallet from "@/models/Wallet";
import bcrypt from "bcryptjs";

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
        { success: false, message: "Password must be at least 6 characters" },
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

      await Wallet.create(
        [
          {
            user: user._id,
            balance: 0,
            welcomeBonusGranted: false,
            transactions: [],
          },
        ],
        { session }
      );
    });

    return Response.json(
      {
        success: true,
        message: "Registration successful!",
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
