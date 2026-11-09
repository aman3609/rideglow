
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Vehicle from "@/models/Vehicle";
import Rental from "@/models/Rental";
import Wallet from "@/models/Wallet";

async function getAuthenticatedUser(request) {
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

    if (!user || user.isBlocked) return null;

    return user;
  } catch {
    return null;
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { message: "Please login first or check your account status" },
        { status: 401 }
      );
    }

    const vehicles = await Vehicle.find({
      owner: user._id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, vehicles });
  } catch (error) {
    console.error("My vehicles error:", error);

    return NextResponse.json(
      { message: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { message: "Please login first or check your account status" },
        { status: 401 }
      );
    }

    const {
      vehicleType,
      name,
      brand,
      model,
      registrationNumber,
      description,
      images,
      pricePerHour,
      pricePerDay,
      location,
    } = await request.json();

    if (
      !["bike", "car"].includes(vehicleType) ||
      !name?.trim() ||
      !brand?.trim() ||
      !model?.trim() ||
      !registrationNumber?.trim() ||
      !location?.trim() ||
      !Number.isFinite(Number(pricePerHour)) ||
      !Number.isFinite(Number(pricePerDay)) ||
      Number(pricePerHour) < 1 ||
      Number(pricePerDay) < 1
    ) {
      return NextResponse.json(
        { message: "Please provide valid vehicle details" },
        { status: 400 }
      );
    }

    const vehicle = await Vehicle.create({
      owner: user._id,
      vehicleType,
      name: name.trim(),
      brand: brand.trim(),
      model: model.trim(),
      registrationNumber: registrationNumber.trim().toUpperCase(),
      description: description || "",
      images: Array.isArray(images) ? images : [],
      pricePerHour: Number(pricePerHour),
      pricePerDay: Number(pricePerDay),
      location: location.trim(),
      status: "available",
      approvalStatus: "approved",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Vehicle listed successfully!",
        vehicle,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add vehicle error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { message: "This registration number is already listed" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Failed to add vehicle" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { message: "Please login first or check your account status" },
        { status: 401 }
      );
    }

    const { vehicleId, status } = await request.json();

    if (
      !mongoose.Types.ObjectId.isValid(vehicleId) ||
      !["available", "maintenance"].includes(status)
    ) {
      return NextResponse.json(
        { message: "Invalid vehicle or status" },
        { status: 400 }
      );
    }

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      owner: user._id,
    });

    if (!vehicle) {
      return NextResponse.json(
        { message: "Vehicle not found or access denied" },
        { status: 404 }
      );
    }

    if (vehicle.status === "removed") {
      return NextResponse.json(
        {
          message:
            "This listing has been removed and cannot be reactivated. Create a new listing instead.",
        },
        { status: 409 }
      );
    }

    if (status === "available") {
      const activeBooking = await Rental.findOne({
        vehicle: vehicle._id,
        status: { $in: ["pending", "accepted", "active"] },
        endDate: { $gt: new Date() },
      });

      if (activeBooking) {
        return NextResponse.json(
          { message: "Vehicle has an active or pending booking" },
          { status: 409 }
        );
      }
    }

    vehicle.status = status;
    await vehicle.save();

    return NextResponse.json({
      success: true,
      message: `Vehicle is now ${status}`,
      vehicle,
    });
  } catch (error) {
    console.error("Update vehicle status error:", error);

    return NextResponse.json(
      { message: "Unable to update vehicle status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const session = await mongoose.startSession();

  try {
    await connectDB();

    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { message: "Please login first or check your account status" },
        { status: 401 }
      );
    }

    const { vehicleId } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
      return NextResponse.json(
        { message: "Invalid vehicle ID" },
        { status: 400 }
      );
    }

    let refundedCount = 0;

    await session.withTransaction(async () => {
      const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        owner: user._id,
      }).session(session);

      if (!vehicle) {
        throw new Error("Vehicle not found or access denied");
      }

      if (vehicle.status === "removed") {
        throw new Error("This vehicle listing has already been removed");
      }

      if (vehicle.status === "rented") {
        throw new Error(
          "This vehicle is currently rented and cannot be removed"
        );
      }

      const activeRental = await Rental.findOne({
        vehicle: vehicle._id,
        status: { $in: ["accepted", "active"] },
        endDate: { $gt: new Date() },
      }).session(session);

      if (activeRental) {
        throw new Error(
          "This vehicle has an accepted or active rental. Remove it after the rental ends."
        );
      }

      const pendingRentals = await Rental.find({
        vehicle: vehicle._id,
        status: "pending",
      }).session(session);

      for (const rental of pendingRentals) {
        if (rental.paymentStatus === "held") {
          const wallet = await Wallet.findOneAndUpdate(
            { user: rental.user },
            {
              $inc: { balance: rental.totalAmount },
              $push: {
                transactions: {
                  type: "credit",
                  amount: rental.totalAmount,
                  description: `Refund for removed vehicle listing ${vehicle.name}`,
                },
              },
            },
            {
              new: true,
              session,
            }
          );

          if (!wallet) {
            throw new Error(
              `Customer wallet not found for booking ${rental._id}`
            );
          }

          rental.paymentStatus = "refunded";
          rental.refundedAt = new Date();
          refundedCount++;
        }

        rental.status = "rejected";
        await rental.save({ session });
      }

      vehicle.status = "removed";
      await vehicle.save({ session });
    });

    return NextResponse.json({
      success: true,
      message: `Vehicle removed from marketplace. ${refundedCount} customer refund(s) processed.`,
      refundedCount,
    });
  } catch (error) {
    console.error("Remove vehicle error:", error);

    const status =
      error.message.includes("not found") ||
      error.message.includes("cannot be removed") ||
      error.message.includes("rental ends") ||
      error.message.includes("already been removed")
        ? 400
        : 500;

    return NextResponse.json(
      {
        message:
          status === 500
            ? "Failed to remove vehicle"
            : error.message,
      },
      { status }
    );
  } finally {
    await session.endSession();
  }
}
