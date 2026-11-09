
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Wallet from "@/models/Wallet";
import User from "@/models/User";

async function getAuthenticatedUser(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId) return null;

    const user = await User.findById(userId);

    if (!user || user.isBlocked) return null;

    return user;
  } catch {
    return null;
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized or account blocked" },
        { status: 401 }
      );
    }

    let wallet = await Wallet.findOne({ user: user._id });

    if (!wallet) {
      wallet = await Wallet.create({ user: user._id });
    }

    return NextResponse.json({
      success: true,
      balance: wallet.balance,
      transactions: wallet.transactions,
    });
  } catch (error) {
    console.error("Wallet GET error:", error);

    return NextResponse.json(
      { message: "Unable to fetch wallet" },
      { status: 500 }
    );
  }
}
