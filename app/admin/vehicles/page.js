
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminVehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/admin/vehicles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load vehicles");
        return;
      }

      setVehicles(data.vehicles || []);
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAction = async (vehicleId, action) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/admin/vehicles", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vehicleId, action }),
      });

      const data = await response.json();

      setMessage(data.message || "Action completed");

      if (response.ok) {
        fetchVehicles();
      }
    } catch {
      setMessage("Something went wrong");
    }
  };

  if (loading) return <p className="p-8">Loading vehicles...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold">
          Vehicle Approval Requests
        </h1>

        {message && (
          <p className="mb-4 rounded bg-blue-100 p-3 text-blue-800">
            {message}
          </p>
        )}

        {vehicles.length === 0 ? (
          <div className="rounded-lg bg-white p-6 shadow">
            No pending vehicle requests.
          </div>
        ) : (
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="rounded-lg bg-white p-6 shadow"
              >
                <h2 className="text-xl font-bold">{vehicle.name}</h2>

                <p>Type: {vehicle.vehicleType}</p>
                <p>Brand: {vehicle.brand}</p>
                <p>Model: {vehicle.model}</p>
                <p>Registration: {vehicle.registrationNumber}</p>
                <p>Location: {vehicle.location}</p>
                <p>Hourly Price: ₹{vehicle.pricePerHour}</p>
                <p>Daily Price: ₹{vehicle.pricePerDay}</p>
                <p>Seller: {vehicle.owner?.name || "Unknown"}</p>
                <p>Email: {vehicle.owner?.email || "N/A"}</p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleAction(vehicle._id, "approve")}
                    className="rounded bg-green-600 px-5 py-2 text-white"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleAction(vehicle._id, "reject")}
                    className="rounded bg-red-600 px-5 py-2 text-white"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
