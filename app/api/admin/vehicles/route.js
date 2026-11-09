
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Vehicle from "@/models/Vehicle";

async function verifyAdmin(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== "admin") return null;

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
    }).populate("owner", "name email phone");

    return NextResponse.json({ vehicles });
  } catch (error) {
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

    if (!vehicleId || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { message: "Invalid request" },
        { status: 400 }
      );
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle || vehicle.approvalStatus !== "pending") {
      return NextResponse.json(
        { message: "Pending vehicle not found" },
        { status: 404 }
      );
    }

    vehicle.approvalStatus =
      action === "approve" ? "approved" : "rejected";

    await vehicle.save();

    return NextResponse.json({
      message: `Vehicle ${action}d successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update vehicle" },
      { status: 500 }
    );
  }
}
