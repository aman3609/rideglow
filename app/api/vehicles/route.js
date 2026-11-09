
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";

export async function GET() {
  try {
    await connectDB();

    const vehicles = await Vehicle.find({
      status: "available",
    })
      .populate("owner", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      vehicles,
    });
  } catch (error) {
    console.error("Vehicle fetch error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}
