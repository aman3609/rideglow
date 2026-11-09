
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
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.isBlocked) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

// CREATE BOOKING
export async function POST(request) {
  const session = await mongoose.startSession();

  try {
    await connectDB();

    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { message: "Please login first" },
        { status: 401 }
      );
    }

    const { vehicleId, durationType, duration } = await request.json();

    if (
      !mongoose.Types.ObjectId.isValid(vehicleId) ||
      !["hourly", "daily"].includes(durationType) ||
      !Number.isInteger(duration) ||
      duration < 1 ||
      duration > 30
    ) {
      return NextResponse.json(
        { message: "Invalid booking details" },
        { status: 400 }
      );
    }

    let createdRental;

    await session.withTransaction(async () => {
      const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        status: "available",
      }).session(session);

      if (!vehicle) {
        throw new Error("Vehicle is not available");
      }

      if (vehicle.owner.toString() === user._id.toString()) {
        throw new Error("You cannot rent your own vehicle");
      }

      const startDate = new Date();
      const endDate = new Date(startDate);

      if (durationType === "hourly") {
        endDate.setHours(endDate.getHours() + duration);
      } else {
        endDate.setDate(endDate.getDate() + duration);
      }

      const existingBooking = await Rental.findOne({
        vehicle: vehicle._id,
        status: { $in: ["pending", "accepted", "active"] },
        startDate: { $lt: endDate },
        endDate: { $gt: startDate },
      }).session(session);

      if (existingBooking) {
        throw new Error("This vehicle already has a booking");
      }

      const price =
        durationType === "hourly"
          ? vehicle.pricePerHour
          : vehicle.pricePerDay;

      const totalAmount = price * duration;

      if (!Number.isFinite(totalAmount) || totalAmount < 1) {
        throw new Error("Invalid rental amount");
      }

      const wallet = await Wallet.findOneAndUpdate(
        {
          user: user._id,
          balance: { $gte: totalAmount },
        },
        {
          $inc: { balance: -totalAmount },
          $push: {
            transactions: {
              type: "debit",
              amount: totalAmount,
              description: `Rental payment for ${vehicle.name}`,
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
          "Insufficient wallet balance. Please add money to your wallet."
        );
      }

      const rentals = await Rental.create(
        [
          {
            user: user._id,
            vehicle: vehicle._id,
            seller: vehicle.owner,
            startDate,
            endDate,
            durationType,
            duration,
            totalAmount,
            status: "pending",
            paymentStatus: "held",
            sellerPaymentStatus: "pending",
          },
        ],
        { session }
      );

      createdRental = rentals[0];
    });

    return NextResponse.json(
      {
        success: true,
        message: "Booking submitted and payment held successfully",
        rental: createdRental,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking API error:", error);

    const knownErrors = [
      "Vehicle is not available",
      "You cannot rent your own vehicle",
      "This vehicle already has a booking",
      "Invalid rental amount",
      "Insufficient wallet balance. Please add money to your wallet.",
    ];

    const status = knownErrors.includes(error.message) ? 400 : 500;

    return NextResponse.json(
      {
        message:
          status === 500 ? "Failed to create booking" : error.message,
      },
      { status }
    );
  } finally {
    await session.endSession();
  }
}

// GET ALL BOOKINGS
export async function GET(request) {
  try {
    await connectDB();

    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { message: "Please login first" },
        { status: 401 }
      );
    }

    const filter =
      user.role === "admin"
        ? {}
        : {
            $or: [
              { user: user._id },
              { seller: user._id },
            ],
          };

    const rentals = await Rental.find(filter)
      .populate("user", "name email")
      .populate("seller", "name email")
      .populate("vehicle", "name brand model vehicleType images")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      rentals,
    });
  } catch (error) {
    console.error("Fetch rentals error:", error);

    return NextResponse.json(
      { message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// UPDATE BOOKING, PICKUP, RETURN AND DISPUTE
export async function PATCH(request) {
  const session = await mongoose.startSession();

  try {
    await connectDB();

    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { message: "Please login first" },
        { status: 401 }
      );
    }

    const { rentalId, action, reason } = await request.json();

    const validActions = [
      "accept",
      "reject",
      "confirm-pickup",
      "confirm-return",
      "raise-dispute",
    ];

    if (
      !mongoose.Types.ObjectId.isValid(rentalId) ||
      !validActions.includes(action)
    ) {
      return NextResponse.json(
        { message: "Invalid booking request" },
        { status: 400 }
      );
    }

    let resultMessage = "";

    await session.withTransaction(async () => {
      const rental = await Rental.findById(rentalId).session(session);

      if (!rental) {
        throw new Error("Booking not found");
      }

      const isAdmin = user.role === "admin";
      const isRenter = rental.user.toString() === user._id.toString();
      const isSeller = rental.seller.toString() === user._id.toString();

      if (!isAdmin && !isRenter && !isSeller) {
        throw new Error("You cannot manage this booking");
      }

      // ACCEPT OR REJECT BOOKING
      if (action === "accept" || action === "reject") {
        if (!isAdmin && !isSeller) {
          throw new Error("Only seller can manage this booking");
        }

        if (rental.status !== "pending") {
          throw new Error("Booking already processed");
        }

        const deadline = rental.confirmationDeadline
          ? new Date(rental.confirmationDeadline)
          : new Date(rental.createdAt.getTime() + 60 * 60 * 1000);

        if (new Date() >= deadline) {
          if (rental.paymentStatus === "held") {
            const wallet = await Wallet.findOneAndUpdate(
              { user: rental.user },
              {
                $inc: { balance: rental.totalAmount },
                $push: {
                  transactions: {
                    type: "credit",
                    amount: rental.totalAmount,
                    description: `Refund for expired booking ${rental._id}`,
                  },
                },
              },
              { new: true, session }
            );

            if (!wallet) {
              throw new Error("Customer wallet not found. Refund failed.");
            }

            rental.paymentStatus = "refunded";
            rental.refundedAt = new Date();
          }

          rental.status = "rejected";
          await rental.save({ session });

          resultMessage = "Booking expired and customer refunded";
          return;
        }

        if (action === "reject" && rental.paymentStatus === "held") {
          const wallet = await Wallet.findOneAndUpdate(
            { user: rental.user },
            {
              $inc: { balance: rental.totalAmount },
              $push: {
                transactions: {
                  type: "credit",
                  amount: rental.totalAmount,
                  description: `Refund for rejected rental ${rental._id}`,
                },
              },
            },
            { new: true, session }
          );

          if (!wallet) {
            throw new Error("Customer wallet not found. Refund failed.");
          }

          rental.paymentStatus = "refunded";
          rental.refundedAt = new Date();
        }

        rental.status = action === "accept" ? "accepted" : "rejected";

        await rental.save({ session });

        resultMessage =
          action === "accept"
            ? "Booking accepted successfully"
            : "Booking rejected and customer refunded";

        return;
      }

      // CONFIRM VEHICLE PICKUP
      if (action === "confirm-pickup") {
        if (!isRenter && !isSeller) {
          throw new Error("Only renter and seller can confirm pickup");
        }

        if (rental.status !== "accepted") {
          throw new Error("Booking must be accepted before pickup");
        }

        if (rental.dispute?.status === "open") {
          throw new Error("Pickup is blocked while dispute is open");
        }

        if (isRenter) {
          if (rental.pickupConfirmation.renterConfirmed) {
            throw new Error("You have already confirmed pickup");
          }

          rental.pickupConfirmation.renterConfirmed = true;
          rental.pickupConfirmation.renterConfirmedAt = new Date();
        }

        if (isSeller) {
          if (rental.pickupConfirmation.sellerConfirmed) {
            throw new Error("You have already confirmed pickup");
          }

          rental.pickupConfirmation.sellerConfirmed = true;
          rental.pickupConfirmation.sellerConfirmedAt = new Date();
        }

        const bothConfirmed =
          rental.pickupConfirmation.renterConfirmed &&
          rental.pickupConfirmation.sellerConfirmed;

        if (bothConfirmed) {
          const vehicle = await Vehicle.findOneAndUpdate(
            {
              _id: rental.vehicle,
              status: "available",
            },
            {
              $set: { status: "rented" },
            },
            {
              new: true,
              session,
            }
          );

          if (!vehicle) {
            throw new Error(
              "Vehicle is not available for pickup. Please contact support."
            );
          }

          const actualStartAt = new Date();
          const actualEndAt = new Date(actualStartAt);

          if (rental.durationType === "hourly") {
            actualEndAt.setHours(
              actualEndAt.getHours() + rental.duration
            );
          } else {
            actualEndAt.setDate(
              actualEndAt.getDate() + rental.duration
            );
          }

          rental.actualStartAt = actualStartAt;
          rental.actualEndAt = actualEndAt;
          rental.status = "active";

          resultMessage =
            "Pickup confirmed by both. Rental started and vehicle is now marked as rented.";
        } else {
          resultMessage =
            "Your pickup confirmation is saved. Waiting for the other person.";
        }

        await rental.save({ session });
        return;
      }

      // CONFIRM VEHICLE RETURN
      if (action === "confirm-return") {
        if (!isRenter && !isSeller) {
          throw new Error("Only renter and seller can confirm return");
        }

        if (rental.status !== "active") {
          throw new Error("This rental is not active");
        }

        if (rental.dispute?.status === "open") {
          throw new Error("Return confirmation is blocked while dispute is open");
        }

        if (isRenter) {
          if (rental.returnConfirmation.renterConfirmed) {
            throw new Error("You have already confirmed vehicle return");
          }

          rental.returnConfirmation.renterConfirmed = true;
          rental.returnConfirmation.renterConfirmedAt = new Date();
        }

        if (isSeller) {
          if (rental.returnConfirmation.sellerConfirmed) {
            throw new Error("You have already confirmed vehicle return");
          }

          rental.returnConfirmation.sellerConfirmed = true;
          rental.returnConfirmation.sellerConfirmedAt = new Date();
        }

        const bothConfirmed =
          rental.returnConfirmation.renterConfirmed &&
          rental.returnConfirmation.sellerConfirmed;

        if (bothConfirmed) {
          const vehicle = await Vehicle.findById(rental.vehicle).session(session);

          if (!vehicle) {
            throw new Error("Vehicle not found");
          }

          const otherBooking = await Rental.findOne({
            _id: { $ne: rental._id },
            vehicle: rental.vehicle,
            status: { $in: ["accepted", "active"] },
          }).session(session);

          if (otherBooking) {
            resultMessage =
              "Return confirmed. Another booking is still active or accepted, so the vehicle was not made available.";
          } else if (["removed", "maintenance"].includes(vehicle.status)) {
            resultMessage =
              "Return confirmed. Vehicle remains unavailable for rent because its status is " +
              vehicle.status + ".";
          } else {
            vehicle.status = "available";
            await vehicle.save({ session });

            resultMessage =
              "Vehicle returned successfully. It is now available for rent again.";
          }

          rental.status = "completed";
          rental.completedAt = new Date();
        } else {
          resultMessage =
            "Your return confirmation is saved. Waiting for the other person.";
        }

        await rental.save({ session });
        return;
      }

      // RAISE DISPUTE
      if (action === "raise-dispute") {
        if (!isRenter && !isSeller) {
          throw new Error("Only renter or seller can raise a dispute");
        }

        if (!reason || !reason.trim()) {
          throw new Error("Please provide a dispute reason");
        }

        if (!["accepted", "active"].includes(rental.status)) {
          throw new Error("Dispute cannot be raised for this booking");
        }

        if (rental.dispute?.status === "open") {
          throw new Error("A dispute is already open");
        }

        rental.dispute.status = "open";
        rental.dispute.raisedBy = user._id;
        rental.dispute.reason = reason.trim();

        await rental.save({ session });

        resultMessage =
          "Dispute submitted. Admin review is required.";
      }
    });

    const updatedRental = await Rental.findById(rentalId);

    return NextResponse.json({
      success: true,
      message: resultMessage,
      rental: updatedRental,
    });
  } catch (error) {
    console.error("Update rental error:", error);

    const status =
      error.message.includes("Only") ||
      error.message.includes("cannot manage")
        ? 403
        : error.message.includes("not found") ||
            error.message.includes("already") ||
            error.message.includes("must be") ||
            error.message.includes("blocked") ||
            error.message.includes("not active") ||
            error.message.includes("cannot be raised") ||
            error.message.includes("Please provide") ||
            error.message.includes("not available for pickup") ||
            error.message.includes("status could not be updated")
          ? 400
          : 500;

    return NextResponse.json(
      {
        message:
          status === 500 ? "Failed to update booking" : error.message,
      },
      { status }
    );
  } finally {
    await session.endSession();
  }
}
