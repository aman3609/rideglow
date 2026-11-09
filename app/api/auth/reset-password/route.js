
import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectDB();

    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user || !user.resetPasswordOTPHash || !user.resetPasswordOTPExpires) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    if (user.resetPasswordOTPExpires.getTime() < Date.now()) {
      return NextResponse.json(
        { message: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const submittedHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest();

    const storedHash = Buffer.from(user.resetPasswordOTPHash, "hex");

    if (
      storedHash.length !== submittedHash.length ||
      !crypto.timingSafeEqual(storedHash, submittedHash)
    ) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordOTPHash = null;
    user.resetPasswordOTPExpires = null;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. Please login.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
