import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.role === "admin" || user.role === "seller") {
      return Response.json(
        { success: false, message: "You cannot apply as a seller" },
        { status: 400 }
      );
    }

    if (user.sellerStatus === "pending") {
      return Response.json(
        { success: false, message: "Application already submitted" },
        { status: 400 }
      );
    }

    if (user.sellerStatus === "approved") {
      return Response.json(
        { success: false, message: "You are already an approved seller" },
        { status: 400 }
      );
    }

    user.sellerStatus = "pending";

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Seller application submitted successfully",
        sellerStatus: user.sellerStatus,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
