
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaClipboardList,
} from "react-icons/fa";

export default function BookingsPage() {
  const router = useRouter();

  const [rentals, setRentals] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const currentUserId = String(user?._id || user?.id || "");
  const isAdmin = user?.role === "admin";

  const fetchBookings = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token || !savedUser) {
        router.push("/login");
        return;
      }

      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      const response = await fetch("/api/rentals", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load bookings");
      }

      setRentals(data.rentals || []);
      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleAction = async (rentalId, action) => {
    const labels = {
      accept: "accept this booking",
      reject: "reject this booking",
      "confirm-pickup": "confirm vehicle pickup",
      "confirm-return": "confirm vehicle return",
    };

    const confirmed = window.confirm(
      `Are you sure you want to ${labels[action] || action}?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(rentalId);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch("/api/rentals", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rentalId, action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Action failed");
      }

      window.alert(data.message || "Action completed successfully");
      await fetchBookings();
    } catch (err) {
      window.alert(err.message || "Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDispute = async (rentalId) => {
    const reason = window.prompt("Please explain the dispute:");

    if (!reason?.trim()) return;

    try {
      setProcessingId(rentalId);

      const token = localStorage.getItem("token");

      const response = await fetch("/api/rentals", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rentalId,
          action: "raise-dispute",
          reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to raise dispute");
      }

      window.alert(data.message);
      await fetchBookings();
    } catch (err) {
      window.alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const myRentals = rentals.filter((rental) => {
    const renterId = String(rental.user?._id || rental.user || "");
    return renterId === currentUserId;
  });

  const bookingRequests = rentals.filter((rental) => {
    const sellerId = String(rental.seller?._id || rental.seller || "");
    return sellerId === currentUserId;
  });

  const displayedRentals = isAdmin
    ? rentals
    : activeTab === "rentals"
      ? myRentals
      : activeTab === "requests"
        ? bookingRequests
        : rentals;

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      accepted: "bg-blue-50 text-blue-700 border-blue-200",
      active: "bg-green-50 text-green-700 border-green-200",
      completed: "bg-gray-100 text-gray-700 border-gray-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
      cancelled: "bg-gray-100 text-gray-600 border-gray-200",
    };

    return styles[status] || styles.pending;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f8f5]">
        <p className="font-semibold text-[#30483d]">
          Loading your bookings...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f5] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2rem] bg-[#263b35] p-7 text-white shadow-xl sm:p-10">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#a9c5ad]/20 blur-3xl" />

          <div className="relative z-10">
            <button
              onClick={() => router.push("/dashboard")}
              className="mb-7 flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
            >
              <FaArrowLeft /> Back to Dashboard
            </button>

            <p className="text-sm font-semibold tracking-widest text-[#c8dfcc]">
              RIDEGLOW ACCOUNT
            </p>

            <h1 className="mt-3 text-3xl font-bold sm:text-5xl">
              {isAdmin ? "All Bookings" : "Booking Center"}
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
              Track your rentals, manage booking requests and stay updated on
              every journey.
            </p>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        <section className="mt-9 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Bookings</p>
            <h2 className="mt-2 text-3xl font-bold text-[#263b35]">
              {rentals.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-white bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              {isAdmin ? "Pending Bookings" : "My Rentals"}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#496d50]">
              {isAdmin
                ? rentals.filter((r) => r.status === "pending").length
                : myRentals.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-white bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              {isAdmin ? "Accepted Bookings" : "Booking Requests"}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#a65f76]">
              {isAdmin
                ? rentals.filter((r) => r.status === "accepted").length
                : bookingRequests.length}
            </h2>
          </div>
        </section>

        {!isAdmin && (
          <section className="mt-9 flex flex-wrap gap-3">
            {[
              { id: "all", label: "All Activity" },
              { id: "rentals", label: "My Rentals" },
              { id: "requests", label: "Booking Requests" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-[#30483d] text-white shadow-md"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-[#78917b]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </section>
        )}

        <section className="mb-6 mt-10 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold tracking-widest text-[#78917b]">
              YOUR ACTIVITY
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#263b35]">
              {isAdmin
                ? "Platform Bookings"
                : activeTab === "rentals"
                  ? "Vehicles I've Rented"
                  : activeTab === "requests"
                    ? "Requests for My Vehicles"
                    : "All Booking Activity"}
            </h2>
          </div>

          <button
            onClick={fetchBookings}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#30483d] hover:bg-gray-50"
          >
            Refresh
          </button>
        </section>

        {displayedRentals.length === 0 ? (
          <div className="rounded-[1.7rem] border border-white bg-white px-6 py-16 text-center shadow-sm">
            <FaClipboardList className="mx-auto text-5xl text-[#a9bba9]" />
            <h3 className="mt-5 text-xl font-bold text-[#263b35]">
              No bookings found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Your booking activity will appear here.
            </p>

            <button
              onClick={() => router.push("/bikes")}
              className="mt-6 rounded-full bg-[#30483d] px-7 py-3 text-sm font-semibold text-white hover:bg-[#20352b]"
            >
              Explore Vehicles
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {displayedRentals.map((rental) => {
              const renterId = String(
                rental.user?._id || rental.user || ""
              );

              const sellerId = String(
                rental.seller?._id || rental.seller || ""
              );

              const isOwner = sellerId === currentUserId;
              const isCustomer = renterId === currentUserId;
              const canManage = isAdmin || isOwner;

              const pickup = rental.pickupConfirmation || {};
              const vehicleReturn = rental.returnConfirmation || {};

              const pickupDone =
                pickup.renterConfirmed && pickup.sellerConfirmed;

              const returnDone =
                vehicleReturn.renterConfirmed &&
                vehicleReturn.sellerConfirmed;

              const disputeOpen = rental.dispute?.status === "open";

              return (
                <article
                  key={rental._id}
                  className="overflow-hidden rounded-[1.7rem] border border-white bg-white shadow-md shadow-gray-200/40"
                >
                  <div className="relative h-52 bg-[#edf0eb]">
                    {rental.vehicle?.images?.[0] ? (
                      <img
                        src={rental.vehicle.images[0]}
                        alt={rental.vehicle.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-7xl">
                        {rental.vehicle?.vehicleType === "car" ? "🚗" : "🏍️"}
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs font-bold capitalize text-[#30483d] backdrop-blur">
                      {rental.vehicle?.vehicleType || "Vehicle"}
                    </span>

                    <span
                      className={`absolute right-4 top-4 rounded-full border px-4 py-2 text-xs font-bold capitalize ${getStatusStyle(
                        rental.status
                      )}`}
                    >
                      {rental.status}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#263b35]">
                      {rental.vehicle?.name || "Vehicle"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {rental.vehicle?.brand} {rental.vehicle?.model}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-4 border-y border-gray-100 py-5">
                      <div>
                        <p className="text-xs text-gray-400">
                          Rental Duration
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                          <FaClock className="text-[#78917b]" />
                          {rental.duration} {rental.durationType}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Total Amount</p>
                        <p className="mt-1 text-lg font-bold text-[#30483d]">
                          ₹{rental.totalAmount}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#78917b]" />
                        Booking Start: {new Date(rental.startDate).toLocaleString()}
                      </p>

                      <p className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#78917b]" />
                        Booking End: {new Date(rental.endDate).toLocaleString()}
                      </p>

                      {rental.actualStartAt && (
                        <p className="text-green-700">
                          Actual Pickup:{" "}
                          {new Date(rental.actualStartAt).toLocaleString()}
                        </p>
                      )}

                      {rental.actualEndAt && (
                        <p className="text-green-700">
                          Actual Rental End:{" "}
                          {new Date(rental.actualEndAt).toLocaleString()}
                        </p>
                      )}

                      <p className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[#78917b]" />
                        {isAdmin || isOwner
                          ? `Customer: ${rental.user?.name || "N/A"}`
                          : `Vehicle Owner: ${rental.seller?.name || "N/A"}`}
                      </p>
                    </div>

                    {canManage && rental.status === "pending" && (
                      <div className="mt-6 flex gap-3 border-t border-gray-100 pt-5">
                        <button
                          disabled={processingId === rental._id}
                          onClick={() => handleAction(rental._id, "accept")}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#30483d] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#20352b] disabled:opacity-50"
                        >
                          <FaCheckCircle />
                          {processingId === rental._id ? "Please wait..." : "Accept"}
                        </button>

                        <button
                          disabled={processingId === rental._id}
                          onClick={() => handleAction(rental._id, "reject")}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          <FaTimesCircle />
                          Reject
                        </button>
                      </div>
                    )}

                    {isCustomer && rental.status === "pending" && (
                      <p className="mt-5 rounded-xl bg-amber-50 p-3 text-center text-sm text-amber-700">
                        Waiting for vehicle owner confirmation.
                      </p>
                    )}

                    {rental.status === "accepted" && (
                      <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
                        <h4 className="font-bold text-[#263b35]">
                          Vehicle Pickup
                        </h4>

                        <div className="space-y-2 text-sm">
                          <p className={pickup.renterConfirmed ? "text-green-700" : "text-gray-500"}>
                            Renter: {pickup.renterConfirmed ? "Confirmed" : "Waiting"}
                          </p>
                          <p className={pickup.sellerConfirmed ? "text-green-700" : "text-gray-500"}>
                            Seller: {pickup.sellerConfirmed ? "Confirmed" : "Waiting"}
                          </p>
                        </div>

                        {!disputeOpen && isCustomer && !pickup.renterConfirmed && (
                          <button
                            disabled={processingId === rental._id}
                            onClick={() => handleAction(rental._id, "confirm-pickup")}
                            className="w-full rounded-xl bg-[#30483d] px-4 py-3 font-bold text-white hover:bg-[#20352b] disabled:opacity-50"
                          >
                            {processingId === rental._id ? "Please wait..." : "Collect Your Vehicle"}
                          </button>
                        )}

                        {!disputeOpen && isOwner && !pickup.sellerConfirmed && (
                          <button
                            disabled={processingId === rental._id}
                            onClick={() => handleAction(rental._id, "confirm-pickup")}
                            className="w-full rounded-xl bg-[#496d50] px-4 py-3 font-bold text-white hover:bg-[#30483d] disabled:opacity-50"
                          >
                            {processingId === rental._id ? "Please wait..." : "Confirm Vehicle Handover"}
                          </button>
                        )}

                        {pickupDone && (
                          <p className="rounded-xl bg-green-50 p-3 text-center text-sm font-semibold text-green-700">
                            Both confirmed. Rental timer started.
                          </p>
                        )}
                      </div>
                    )}

                    {rental.status === "active" && (
                      <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
                        <h4 className="font-bold text-[#263b35]">
                          Vehicle Return
                        </h4>

                        <div className="space-y-2 text-sm">
                          <p className={vehicleReturn.renterConfirmed ? "text-green-700" : "text-gray-500"}>
                            Renter: {vehicleReturn.renterConfirmed ? "Return confirmed" : "Waiting"}
                          </p>
                          <p className={vehicleReturn.sellerConfirmed ? "text-green-700" : "text-gray-500"}>
                            Seller: {vehicleReturn.sellerConfirmed ? "Received" : "Waiting"}
                          </p>
                        </div>

                        {!disputeOpen && isCustomer && !vehicleReturn.renterConfirmed && (
                          <button
                            disabled={processingId === rental._id}
                            onClick={() => handleAction(rental._id, "confirm-return")}
                            className="w-full rounded-xl bg-[#30483d] px-4 py-3 font-bold text-white hover:bg-[#20352b] disabled:opacity-50"
                          >
                            {processingId === rental._id ? "Please wait..." : "Return Vehicle"}
                          </button>
                        )}

                        {!disputeOpen && isOwner && !vehicleReturn.sellerConfirmed && (
                          <button
                            disabled={processingId === rental._id}
                            onClick={() => handleAction(rental._id, "confirm-return")}
                            className="w-full rounded-xl bg-[#496d50] px-4 py-3 font-bold text-white hover:bg-[#30483d] disabled:opacity-50"
                          >
                            {processingId === rental._id ? "Please wait..." : "Confirm Vehicle Received"}
                          </button>
                        )}
                      </div>
                    )}

                    {rental.status === "completed" && (
                      <p className="mt-5 rounded-xl bg-green-50 p-3 text-center text-sm font-semibold text-green-700">
                        Vehicle returned and rental completed.
                      </p>
                    )}

                    {disputeOpen && (
                      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <p className="font-bold text-amber-800">
                          Dispute Under Review
                        </p>
                        <p className="mt-1 text-sm text-amber-700">
                          {rental.dispute?.reason}
                        </p>
                      </div>
                    )}

                    {!disputeOpen &&
                      ["accepted", "active"].includes(rental.status) &&
                      (isCustomer || isOwner) && (
                        <button
                          disabled={processingId === rental._id}
                          onClick={() => handleDispute(rental._id)}
                          className="mt-4 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                        >
                          Raise a Dispute
                        </button>
                      )}

                    {isOwner && rental.status === "rejected" && (
                      <p className="mt-5 rounded-xl bg-red-50 p-3 text-center text-sm text-red-700">
                        You have rejected this booking.
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <footer className="mt-12 text-center text-xs text-gray-400">
          © 2026 RideGlow. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
