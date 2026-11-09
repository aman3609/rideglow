"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BecomeSeller() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleApply = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/seller/apply", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setMessage(data.message);

      if (data.success) {
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="bg-gray-900 p-8 rounded-2xl max-w-lg w-full">
        <div className="text-6xl text-center mb-5">🚲🚗</div>

        <h1 className="text-3xl font-bold text-green-400 text-center">
          Become a Seller
        </h1>

        <p className="text-gray-400 text-center mt-4">
          List your own bikes and cars for rent.
          Set your own rental prices and manage your bookings.
        </p>

        <div className="bg-gray-800 p-5 rounded-xl mt-8">
          <h2 className="font-bold">Seller Benefits</h2>

          <ul className="text-gray-300 mt-4 space-y-3">
            <li>✓ List your own bikes and cars</li>
            <li>✓ Set hourly and daily prices</li>
            <li>✓ Manage your vehicle listings</li>
            <li>✓ Receive rental bookings</li>
            <li>✓ Track your earnings</li>
          </ul>
        </div>

        <button
          onClick={handleApply}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 p-3 rounded-lg mt-8 font-bold"
        >
          {loading ? "Submitting..." : "Apply as Seller"}
        </button>

        {message && (
          <p className="text-center mt-5 text-green-400">
            {message}
          </p>
        )}

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full mt-5 text-gray-400"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}