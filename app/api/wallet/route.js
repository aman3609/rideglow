
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Wallet from "@/models/Wallet";

async function getAuthenticatedUser(request) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch {
    return null;
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const decoded = await getAuthenticatedUser(request);

    if (!decoded) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid authentication token" },
        { status: 401 }
      );
    }

    let wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      wallet = await Wallet.create({ user: userId });
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
