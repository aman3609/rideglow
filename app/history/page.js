
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function History() {
  const router = useRouter();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/rentals", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Unable to load history");
        }

        const user = JSON.parse(userData);

        const ownRentals = (data.rentals || []).filter(
          (rental) =>
            rental.user?._id === user.id ||
            rental.user === user.id
        );

        setHistory(ownRentals);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  return (
    <main className="min-h-screen bg-[#f8f8f5] px-4 py-10 text-[#263b35] sm:px-8">
      <div className="mx-auto max-w-5xl">

        <p className="text-sm font-semibold tracking-widest text-[#78917b]">
          RIDEGLOW
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Rental History
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Your personal rental records.
        </p>

        {loading ? (
          <p className="mt-8 text-gray-500">Loading history...</p>
        ) : error ? (
          <div className="mt-8 rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        ) : history.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-8 text-center">
            <h2 className="text-xl font-bold">
              No Rental History
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Your bookings will appear here.
            </p>
            <button
              onClick={() => router.push("/bikes")}
              className="mt-5 rounded-xl bg-[#30483d] px-6 py-3 font-semibold text-white"
            >
              Explore Vehicles
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5">
            {history.map((rental) => (
              <div
                key={rental._id}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold">
                  {rental.vehicle?.name || "Vehicle"}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {rental.vehicle?.brand} {rental.vehicle?.model}
                </p>

                <p className="mt-3 text-sm text-gray-600">
                  Duration: {rental.duration} {rental.durationType}
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  Start: {new Date(rental.startDate).toLocaleString()}
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  End: {new Date(rental.endDate).toLocaleString()}
                </p>

                <p className="mt-3 text-lg font-bold text-[#496d50]">
                  Amount: ₹{rental.totalAmount}
                </p>

                <span className="mt-4 inline-block rounded-full bg-[#edf4ed] px-4 py-1.5 text-sm font-semibold capitalize text-[#496d50]">
                  {rental.status}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-8 font-semibold text-[#496d50] hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>
    </main>
  );
}
