
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

async function verifyAdmin(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId) return null;

    const user = await User.findById(userId);

    if (!user || user.role !== "admin" || user.isBlocked) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const admin = await verifyAdmin(request);

    if (!admin) {
      return Response.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    const sellers = await User.find({
      sellerStatus: "pending",
      isBlocked: { $ne: true },
    }).select("-password -resetPasswordOTPHash -resetPasswordOTPExpires");

    return Response.json({
      success: true,
      sellers,
    });
  } catch (error) {
    console.error("Admin sellers GET:", error);

    return Response.json(
      { success: false, message: "Failed to fetch sellers" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    const admin = await verifyAdmin(request);

    if (!admin) {
      return Response.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    const { sellerId, action } = await request.json();

    if (
      !sellerId ||
      !mongoose.Types.ObjectId.isValid(sellerId) ||
      !["approve", "reject"].includes(action)
    ) {
      return Response.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    const seller = await User.findOne({
      _id: sellerId,
      sellerStatus: "pending",
      isBlocked: { $ne: true },
    });

    if (!seller) {
      return Response.json(
        { success: false, message: "Pending seller not found" },
        { status: 404 }
      );
    }

    if (action === "approve") {
      seller.role = "seller";
      seller.sellerStatus = "approved";
    } else {
      seller.role = "customer";
      seller.sellerStatus = "rejected";
    }

    await seller.save();

    return Response.json({
      success: true,
      message: `Seller ${action}d successfully`,
      sellerStatus: seller.sellerStatus,
    });
  } catch (error) {
    console.error("Admin sellers PATCH:", error);

    return Response.json(
      { success: false, message: "Seller approval failed" },
      { status: 500 }
    );
  }
}
