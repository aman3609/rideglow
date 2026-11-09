
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    const genericResponse = {
      success: true,
      message: "If this email is registered, an OTP will be sent.",
    };

    if (!user) {
      return NextResponse.json(genericResponse);
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    const otpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.resetPasswordOTPHash = otpHash;
    user.resetPasswordOTPExpires = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await user.save();

    const { error } = await resend.emails.send({
      from: "RideGlow <onboarding@resend.dev>",
      to: [user.email],
      subject: "Your RideGlow Password Reset OTP",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:30px;color:#263b35">
          <h2>RideGlow Password Reset</h2>
          <p>Use the OTP below to reset your password.</p>
          <div style="font-size:32px;font-weight:bold;letter-spacing:8px;padding:20px;background:#eaf1e9;text-align:center;border-radius:12px">
            ${otp}
          </div>
          <p>This OTP expires in 5 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      user.resetPasswordOTPHash = null;
      user.resetPasswordOTPExpires = null;
      await user.save();

      console.error("Resend error:", error);

      return NextResponse.json(
        { message: "Unable to send OTP email. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(genericResponse);
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
