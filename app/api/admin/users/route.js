
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

async function verifyAdmin(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) return null;

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

    const users = await User.find({ _id: { $ne: admin._id } })
      .select("-password -resetPasswordOTPHash -resetPasswordOTPExpires")
      .sort({ createdAt: -1 });

    return Response.json({ success: true, users });
  } catch (error) {
    console.error("Admin users GET:", error);

    return Response.json(
      { success: false, message: "Failed to fetch users" },
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

    const { userId, action } = await request.json();

    if (
      !userId ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !["block", "unblock"].includes(action)
    ) {
      return Response.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    if (userId === admin._id.toString()) {
      return Response.json(
        { success: false, message: "You cannot block yourself" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user || user.role === "admin") {
      return Response.json(
        { success: false, message: "User not found or not allowed" },
        { status: 404 }
      );
    }

    user.isBlocked = action === "block";
    await user.save();

    return Response.json({
      success: true,
      message: `User ${action === "block" ? "blocked" : "unblocked"} successfully`,
    });
  } catch (error) {
    console.error("Admin users PATCH:", error);

    return Response.json(
      { success: false, message: "User action failed" },
      { status: 500 }
    );
  }
}
