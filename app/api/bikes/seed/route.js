
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Bike from "@/models/Bike";
import User from "@/models/User";
import jwt from "jsonwebtoken";

async function verifyAdmin(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const decoded = jwt.verify(
      authHeader.split(" ")[1],
      process.env.JWT_SECRET
    );

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

export async function POST(request) {
  try {
    await connectDB();

    const admin = await verifyAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    const existingBikes = await Bike.countDocuments();

    if (existingBikes > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Bikes already exist",
        },
        { status: 409 }
      );
    }

    const bikes = await Bike.insertMany([
      {
        name: "Mountain Bike",
        model: "Hero Sprint",
        bikeNumber: "BR001",
        pricePerHour: 50,
        pricePerDay: 300,
        status: "available",
      },
      {
        name: "City Bike",
        model: "Firefox Roadster",
        bikeNumber: "BR002",
        pricePerHour: 40,
        pricePerDay: 250,
        status: "available",
      },
      {
        name: "Electric Bike",
        model: "Hero Lectro",
        bikeNumber: "BR003",
        pricePerHour: 80,
        pricePerDay: 500,
        status: "available",
      },
    ]);

    return NextResponse.json({
      success: true,
      message: "Bikes added successfully",
      bikes,
    });
  } catch (error) {
    console.error("Bike seed error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to seed bikes" },
      { status: 500 }
    );
  }
}
