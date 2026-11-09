
import { NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Wallet from "@/models/Wallet";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Please login first" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

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

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: "User account not found" },
        { status: 404 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await request.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        { message: "Payment details are missing" },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpay_signature, "hex");

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return NextResponse.json(
        { message: "Payment verification failed" },
        { status: 400 }
      );
    }

    const Razorpay = (await import("razorpay")).default;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    if (
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured" ||
      payment.currency !== "INR" ||
      !Number.isSafeInteger(payment.amount) ||
      payment.amount < 100
    ) {
      return NextResponse.json(
        { message: "Payment is not successfully captured" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.fetch(razorpay_order_id);

    if (
      order.status !== "paid" ||
      order.amount !== payment.amount ||
      order.currency !== "INR" ||
      order.notes?.purpose !== "wallet_recharge" ||
      order.notes?.userId !== String(userId)
    ) {
      return NextResponse.json(
        { message: "Payment order details do not match" },
        { status: 400 }
      );
    }

    const amountInRupees = payment.amount / 100;

    const existingTransaction = await Wallet.findOne({
      user: userId,
      "transactions.paymentId": razorpay_payment_id,
    });

    if (existingTransaction) {
      return NextResponse.json({
        success: true,
        message: "Payment was already credited",
      });
    }

    const wallet = await Wallet.findOneAndUpdate(
      {
        user: userId,
        "transactions.paymentId": { $ne: razorpay_payment_id },
      },
      {
        $inc: { balance: amountInRupees },
        $push: {
          transactions: {
            type: "credit",
            amount: amountInRupees,
            description: "Wallet recharge",
            paymentId: razorpay_payment_id,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!wallet) {
      return NextResponse.json(
        { message: "Wallet not found. Please try again." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Money added to wallet successfully",
      balance: wallet.balance,
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return NextResponse.json(
      { message: "Unable to verify payment" },
      { status: 500 }
    );
  }
}
