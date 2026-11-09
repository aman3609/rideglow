
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Vehicle from "@/models/Vehicle";

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
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    const vehicles = await Vehicle.find({
      approvalStatus: "pending",
    })
      .populate("owner", "name email phone isBlocked")
      .sort({ createdAt: -1 });

    const filteredVehicles = vehicles.filter(
      (vehicle) => vehicle.owner && !vehicle.owner.isBlocked
    );

    return NextResponse.json({
      success: true,
      vehicles: filteredVehicles,
    });
  } catch (error) {
    console.error("Admin vehicles GET:", error);

    return NextResponse.json(
      { message: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    const admin = await verifyAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    const { vehicleId, action } = await request.json();

    if (
      !vehicleId ||
      !mongoose.Types.ObjectId.isValid(vehicleId) ||
      !["approve", "reject"].includes(action)
    ) {
      return NextResponse.json(
        { message: "Invalid request" },
        { status: 400 }
      );
    }

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      approvalStatus: "pending",
    });

    if (!vehicle) {
      return NextResponse.json(
        { message: "Pending vehicle not found" },
        { status: 404 }
      );
    }

    const owner = await User.findById(vehicle.owner);

    if (!owner || owner.isBlocked) {
      return NextResponse.json(
        { message: "Vehicle owner is blocked or unavailable" },
        { status: 403 }
      );
    }

    vehicle.approvalStatus =
      action === "approve" ? "approved" : "rejected";

    await vehicle.save();

    return NextResponse.json({
      success: true,
      message: `Vehicle ${action}d successfully`,
    });
  } catch (error) {
    console.error("Admin vehicles PATCH:", error);

    return NextResponse.json(
      { message: "Failed to update vehicle" },
      { status: 500 }
    );
  }
}
