
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSellersPage() {
  const router = useRouter();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchSellers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/admin/sellers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load sellers");
        return;
      }

      setSellers(data.sellers || []);
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleAction = async (sellerId, action) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/admin/sellers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sellerId, action }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Action failed");
        return;
      }

      setMessage(data.message);
      fetchSellers();
    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  if (loading) {
    return <p className="p-8">Loading sellers...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Seller Approval Requests
        </h1>

        {message && (
          <p className="mb-4 rounded bg-blue-100 p-3 text-blue-800">
            {message}
          </p>
        )}

        {sellers.length === 0 ? (
          <div className="rounded-lg bg-white p-6 shadow">
            No pending seller requests.
          </div>
        ) : (
          <div className="space-y-4">
            {sellers.map((seller) => (
              <div
                key={seller._id}
                className="rounded-lg bg-white p-6 shadow"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  {seller.name}
                </h2>

                <p className="mt-2 text-gray-600">
                  Email: {seller.email}
                </p>

                <p className="text-gray-600">
                  Phone: {seller.phone || "Not provided"}
                </p>

                <p className="mt-2 font-medium text-yellow-700">
                  Status: Pending
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleAction(seller._id, "approve")}
                    className="rounded bg-green-600 px-5 py-2 text-white hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleAction(seller._id, "reject")}
                    className="rounded bg-red-600 px-5 py-2 text-white hover:bg-red-700"
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
