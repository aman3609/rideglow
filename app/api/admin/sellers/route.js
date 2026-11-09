import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

async function verifyAdmin(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.role !== "admin") {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function GET(request) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin) {
      return Response.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    const sellers = await User.find({
      sellerStatus: "pending",
    }).select("-password");

    return Response.json({
      success: true,
      sellers,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to fetch sellers" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin) {
      return Response.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    const { sellerId, action } = await request.json();

    if (!sellerId || !["approve", "reject"].includes(action)) {
      return Response.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    const seller = await User.findOne({
      _id: sellerId,
      sellerStatus: "pending",
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
    return Response.json(
      { success: false, message: "Seller approval failed" },
      { status: 500 }
    );
  }
}