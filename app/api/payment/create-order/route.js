
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    await connectDB();

    const token = request.headers
      .get("authorization")
      ?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Please login first" },
        { status: 401 }
      );
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired session" },
        { status: 401 }
      );
    }

    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid user token" },
        { status: 401 }
      );
    }

    const { amount } = await request.json();
    const value = Number(amount);

    if (
      !Number.isSafeInteger(value) ||
      value < 1 ||
      value > 50000
    ) {
      return NextResponse.json(
        { message: "Amount must be between ₹1 and ₹50,000" },
        { status: 400 }
      );
    }

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      return NextResponse.json(
        { message: "Payment gateway is not configured" },
        { status: 500 }
      );
    }

    const order = await razorpay.orders.create({
      amount: value * 100,
      currency: "INR",
      receipt: `rg_${Date.now()}`,
      notes: {
        userId: String(userId),
        purpose: "wallet_recharge",
      },
    });

    return NextResponse.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create payment order error:", error);

    return NextResponse.json(
      { message: "Unable to create payment order" },
      { status: 500 }
    );
  }
}
