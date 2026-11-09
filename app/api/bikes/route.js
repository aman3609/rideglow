import connectDB from "@/lib/mongodb";
import Bike from "@/models/Bike";

export async function GET() {
  try {
    await connectDB();

    const bikes = await Bike.find().sort({ createdAt: -1 });

    return Response.json({
      success: true,
      bikes,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}