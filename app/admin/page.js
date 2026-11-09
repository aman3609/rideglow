"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    const rentals = JSON.parse(
      localStorage.getItem("rentalHistory") || "[]"
    );

    setHistory(rentals);
  }, [router]);

  const totalRevenue = history.reduce(
    (total, rental) => total + Number(rental.total || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold text-green-400">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <div className="bg-gray-900 p-6 rounded-xl">
          <p className="text-gray-400">Total Rentals</p>
          <h2 className="text-3xl font-bold mt-2">
            {history.length}
          </h2>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl">
          <p className="text-gray-400">Total Revenue (Simulation)</p>
          <h2 className="text-3xl font-bold mt-2 text-green-400">
            ₹{totalRevenue}
          </h2>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl">
          <p className="text-gray-400">System Status</p>
          <h2 className="text-2xl font-bold mt-2">
            Active
          </h2>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-5">
        Recent Rentals
      </h2>

      {history.length === 0 ? (
        <p className="text-gray-400">No rentals found.</p>
      ) : (
        <div className="space-y-4">
          {history.map((rental, index) => (
            <div key={index} className="bg-gray-900 p-5 rounded-xl">
              <h3 className="font-bold">{rental.bikeName}</h3>
              <p className="text-gray-400">
                {rental.duration} {rental.type}
              </p>
              <p className="text-green-400">₹{rental.total}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-8 text-green-400"
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}