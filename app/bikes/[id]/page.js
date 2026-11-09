
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f7f8f5]">
          <p className="text-lg font-semibold text-[#55745f]">
            Loading vehicle...
          </p>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}

function BookingContent() {
  const { id } = useParams();
  const router = useRouter();

  const [vehicle, setVehicle] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [type, setType] = useState("hourly");
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch("/api/vehicles");
        const data = await response.json();

        if (response.ok && data.success) {
          const selected = data.vehicles.find(
            (item) => item._id === id
          );
          setVehicle(selected || null);
          setSelectedImage(0);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicle();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8f5]">
        <p className="text-lg font-semibold text-[#55745f]">
          Loading vehicle...
        </p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f8f5] p-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Vehicle not found
        </h2>
        <button
          onClick={() => router.push("/bikes")}
          className="mt-5 rounded-xl bg-[#55745f] px-6 py-3 text-white"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  const images = vehicle.images || [];
  const price =
    type === "hourly"
      ? vehicle.pricePerHour
      : vehicle.pricePerDay;

  const total = price * duration;

  const handleBooking = async () => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!user || !token) {
      router.push("/login");
      return;
    }

    try {
      setBookingLoading(true);

      const response = await fetch("/api/rentals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vehicleId: vehicle._id,
          durationType: type,
          duration,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Booking failed");
        return;
      }

      alert("Booking request submitted successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.push("/bikes")}
          className="mb-7 font-semibold text-[#55745f] hover:text-[#344d3b]"
        >
          ← Back to Marketplace
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-4 shadow-xl shadow-gray-200/50 md:p-6">
            <div className="relative overflow-hidden rounded-2xl bg-[#edf2ec]">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={vehicle.name}
                  className="h-[300px] w-full object-cover transition duration-300 md:h-[440px]"
                />
              ) : (
                <div className="flex h-[300px] items-center justify-center text-8xl md:h-[440px]">
                  {vehicle.vehicleType === "car" ? "🚗" : "🏍️"}
                </div>
              )}

              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-sm font-bold capitalize text-[#55745f] shadow">
                {vehicle.vehicleType}
              </span>
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`shrink-0 overflow-hidden rounded-xl border-2 transition ${
                      selectedImage === index
                        ? "border-[#55745f]"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Vehicle photo ${index + 1}`}
                      className="h-20 w-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#78947d]">
                Vehicle Details
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#26352b]">
                {vehicle.name}
              </h1>

              <p className="mt-2 text-gray-500">
                {vehicle.brand} {vehicle.model}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#f5f8f4] p-4">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="mt-1 font-semibold text-[#344d3b]">
                    📍 {vehicle.location}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f5f8f4] p-4">
                  <p className="text-xs text-gray-500">Availability</p>
                  <p className="mt-1 font-semibold text-[#55745f]">
                    Available
                  </p>
                </div>
              </div>

              {vehicle.description && (
                <div className="mt-6">
                  <h3 className="font-bold text-[#26352b]">
                    Description
                  </h3>
                  <p className="mt-2 leading-7 text-gray-500">
                    {vehicle.description}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="h-fit rounded-3xl bg-white p-6 shadow-xl shadow-gray-200/50 md:p-8">
            <p className="text-sm font-bold uppercase tracking-widest text-[#78947d]">
              RideGlow Booking
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#26352b]">
              Book Your Vehicle
            </h2>

            <p className="mt-2 text-gray-500">
              Select your rental duration and confirm your booking.
            </p>

            <div className="mt-8">
              <label className="mb-3 block font-semibold text-gray-700">
                Rental Type
              </label>

              <div className="grid grid-cols-2 gap-3">
                {["hourly", "daily"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setType(item)}
                    className={`rounded-xl border-2 p-4 font-semibold capitalize transition ${
                      type === item
                        ? "border-[#73977a] bg-[#edf4ed] text-[#45684d]"
                        : "border-gray-200 text-gray-500 hover:border-[#73977a]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <label className="mb-3 block font-semibold text-gray-700">
                Duration ({type === "hourly" ? "Hours" : "Days"})
              </label>

              <input
                type="number"
                min="1"
                max="30"
                value={duration}
                onChange={(e) =>
                  setDuration(
                    Math.max(1, Math.min(30, Number(e.target.value) || 1))
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-[#fbfcfa] p-4 outline-none focus:border-[#73977a]"
              />
            </div>

            <div className="mt-8 space-y-4 rounded-2xl bg-[#f5f8f4] p-5">
              <div className="flex justify-between text-gray-600">
                <span>
                  Price per {type === "hourly" ? "hour" : "day"}
                </span>
                <span className="font-semibold">₹{price}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Duration</span>
                <span className="font-semibold">{duration}</span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-xl font-bold text-[#26352b]">
                  <span>Total Amount</span>
                  <span className="text-[#55745f]">₹{total}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={bookingLoading}
              className="mt-8 w-full rounded-xl bg-[#55745f] py-4 font-bold text-white shadow-lg transition hover:bg-[#405c49] disabled:opacity-50"
            >
              {bookingLoading ? "Submitting..." : "Confirm Booking"}
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              Your booking request will be sent to the vehicle owner.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
