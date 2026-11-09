
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaPlus,
  FaMotorcycle,
  FaCar,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaArrowLeft,
  FaArrowRight,
  FaCarSide,
  FaTrash,
} from "react-icons/fa";

export default function SellerDashboard() {
  const router = useRouter();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [removingId, setRemovingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchVehicles = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/seller/vehicles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load vehicles");
      }

      setVehicles(data.vehicles || []);
      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const toggleAvailability = async (vehicle) => {
    if (vehicle.status === "removed" || vehicle.status === "rented") {
      return;
    }

    const token = localStorage.getItem("token");

    const newStatus =
      vehicle.status === "available" ? "maintenance" : "available";

    setUpdatingId(vehicle._id);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/seller/vehicles", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vehicleId: vehicle._id,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update vehicle");
      }

      setVehicles((previous) =>
        previous.map((item) =>
          item._id === vehicle._id
            ? { ...item, status: data.vehicle.status }
            : item
        )
      );

      setMessage(data.message || "Vehicle availability updated");
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId("");
    }
  };

  const removeListing = async (vehicle) => {
    if (vehicle.status === "removed") return;

    const confirmed = window.confirm(
      `Remove "${vehicle.name}" from the RideGlow marketplace? Pending bookings will be rejected and refunded. Existing rental history will remain.`
    );

    if (!confirmed) return;

    setRemovingId(vehicle._id);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/seller/vehicles", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vehicleId: vehicle._id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to remove listing");
      }

      setVehicles((previous) =>
        previous.map((item) =>
          item._id === vehicle._id
            ? { ...item, status: "removed" }
            : item
        )
      );

      setMessage(data.message || "Vehicle listing removed successfully");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setRemovingId("");
    }
  };

  const bikes = vehicles.filter(
    (vehicle) => vehicle.vehicleType === "bike"
  );

  const cars = vehicles.filter(
    (vehicle) => vehicle.vehicleType === "car"
  );

  const activeVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "available"
  );

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

            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-sm font-semibold tracking-widest text-[#c8dfcc]">
                  RIDEGLOW VEHICLE MANAGEMENT
                </p>

                <h1 className="mt-3 text-3xl font-bold sm:text-5xl">
                  My Vehicles
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                  Manage your vehicle listings, track availability and turn
                  your vehicles into earnings.
                </p>
              </div>

              <Link
                href="/seller-dashboard/add-vehicle"
                className="flex items-center gap-3 rounded-full bg-[#d5e6d5] px-7 py-4 text-sm font-bold text-[#263b35] shadow-lg transition hover:bg-white"
              >
                <FaPlus /> Add Vehicle
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Vehicles",
              value: vehicles.length,
              icon: <FaCarSide />,
              color: "bg-[#e4eee4] text-[#496d50]",
            },
            {
              title: "Available",
              value: activeVehicles.length,
              icon: <FaArrowRight />,
              color: "bg-[#e5f1e9] text-[#49835c]",
            },
            {
              title: "Bikes",
              value: bikes.length,
              icon: <FaMotorcycle />,
              color: "bg-[#f8e8ed] text-[#a65f76]",
            },
            {
              title: "Cars",
              value: cars.length,
              icon: <FaCar />,
              color: "bg-[#e9edf7] text-[#61739b]",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white bg-white/80 p-6 shadow-md shadow-gray-200/40 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {item.title}
                </p>

                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${item.color}`}
                >
                  {item.icon}
                </span>
              </div>

              <h2 className="mt-4 text-3xl font-bold text-[#263b35]">
                {item.value}
              </h2>
            </div>
          ))}
        </section>

        <section className="mb-6 mt-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-widest text-[#78917b]">
              YOUR COLLECTION
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#263b35] sm:text-3xl">
              My Vehicle Listings
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Manage your bikes, cars and availability.
            </p>
          </div>

          <button
            onClick={fetchVehicles}
            className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#30483d] transition hover:bg-gray-50"
          >
            Refresh Listings
          </button>
        </section>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 p-5 text-sm text-green-700">
            {message}
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-96 animate-pulse rounded-3xl bg-gray-200"
              />
            ))}
          </div>
        ) : !error && vehicles.length === 0 ? (
          <div className="rounded-[1.7rem] border border-white bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#e4eee4] text-4xl text-[#496d50]">
              <FaCarSide />
            </div>

            <h3 className="mt-6 text-xl font-bold text-[#263b35]">
              No vehicles listed yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Start earning by listing your bike or car on RideGlow.
            </p>

            <Link
              href="/seller-dashboard/add-vehicle"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#30483d] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#20352b]"
            >
              <FaPlus /> List Your First Vehicle
            </Link>
          </div>
        ) : !error ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => {
              const isRemoved = vehicle.status === "removed";
              const isRented = vehicle.status === "rented";

              return (
                <article
                  key={vehicle._id}
                  className={`group overflow-hidden rounded-[1.7rem] border border-white bg-white shadow-md shadow-gray-200/40 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    isRemoved ? "opacity-75" : ""
                  }`}
                >
                  <div className="relative h-56 overflow-hidden bg-[#edf0eb]">
                    {vehicle.images?.[0] ? (
                      <img
                        src={vehicle.images[0]}
                        alt={vehicle.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-7xl">
                        {vehicle.vehicleType === "car" ? "🚗" : "🏍️"}
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs font-bold capitalize text-[#30483d] backdrop-blur">
                      {vehicle.vehicleType}
                    </span>

                    <span
                      className={`absolute right-4 top-4 rounded-full px-4 py-2 text-xs font-bold ${
                        isRemoved
                          ? "bg-red-100 text-red-700"
                          : vehicle.status === "available"
                          ? "bg-green-100 text-green-700"
                          : isRented
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isRemoved
                        ? "Listing Removed"
                        : vehicle.status === "maintenance"
                        ? "Unavailable"
                        : vehicle.status}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-[#263b35]">
                      {vehicle.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {vehicle.brand} {vehicle.model}
                    </p>

                    <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      <FaMapMarkerAlt className="text-[#78917b]" />
                      {vehicle.location}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-4 border-y border-gray-100 py-4">
                      <div>
                        <p className="flex items-center gap-2 text-xs text-gray-400">
                          <FaClock /> Per Hour
                        </p>
                        <p className="mt-1 text-lg font-bold text-[#30483d]">
                          ₹{vehicle.pricePerHour}
                        </p>
                      </div>

                      <div>
                        <p className="flex items-center gap-2 text-xs text-gray-400">
                          <FaCalendarAlt /> Per Day
                        </p>
                        <p className="mt-1 text-lg font-bold text-[#30483d]">
                          ₹{vehicle.pricePerDay}
                        </p>
                      </div>
                    </div>

                    {isRemoved ? (
                      <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-center">
                        <p className="text-sm font-bold text-red-700">
                          This listing has been removed
                        </p>
                        <p className="mt-1 text-xs text-red-500">
                          It is no longer available on the marketplace.
                        </p>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          disabled={
                            updatingId === vehicle._id ||
                            removingId === vehicle._id ||
                            isRented
                          }
                          onClick={() => toggleAvailability(vehicle)}
                          className={`mt-5 w-full rounded-xl py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            vehicle.status === "available"
                              ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                              : "bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {updatingId === vehicle._id
                            ? "Updating..."
                            : isRented
                            ? "Currently Rented"
                            : vehicle.status === "available"
                            ? "Mark as Unavailable"
                            : "Mark as Available"}
                        </button>

                        <button
                          type="button"
                          disabled={
                            removingId === vehicle._id ||
                            updatingId === vehicle._id ||
                            isRented
                          }
                          onClick={() => removeListing(vehicle)}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <FaTrash />
                          {removingId === vehicle._id
                            ? "Removing..."
                            : "Remove Listing"}
                        </button>
                      </>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-xs text-gray-400">
                        {vehicle.images?.length || 0} Photos
                      </span>

                      {!isRemoved && (
                        <Link
                          href={`/bikes/${vehicle._id}`}
                          className="flex items-center gap-2 rounded-full bg-[#30483d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#20352b]"
                        >
                          View Listing <FaArrowRight />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}

        <footer className="mt-12 text-center text-xs text-gray-400">
          © 2026 RideGlow. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
