import connectDB from "@/lib/mongodb";
import Bike from "@/models/Bike";

export async function POST() {
  try {
    await connectDB();

    const existingBikes = await Bike.countDocuments();

    if (existingBikes > 0) {
      return Response.json({
        success: false,
        message: "Bikes already exist",
      });
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

    return Response.json({
      success: true,
      message: "Bikes added successfully",
      bikes,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}