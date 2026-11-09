"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";

export default function UnlockBike() {
  const router = useRouter();
  const [rental, setRental] = useState(null);
  const [qrImage, setQrImage] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/login");
      return;
    }

    const history = JSON.parse(
      localStorage.getItem("rentalHistory") || "[]"
    );

    if (history.length > 0) {
      setRental(history[history.length - 1]);
    }
  }, [router]);

  useEffect(() => {
    if (!rental) return;

    const generateQR = async () => {
      const qr = await QRCode.toDataURL(
        JSON.stringify({
          bike: rental.bikeName,
          date: rental.date,
          type: "Bike Unlock Simulation",
        })
      );

      setQrImage(qr);
    };

    generateQR();
  }, [rental]);

  if (!rental) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-10">
        <h1 className="text-2xl font-bold">No Booking Found</h1>
        <button
          onClick={() => router.push("/bikes")}
          className="mt-5 bg-green-500 px-6 py-3 rounded-lg"
        >
          Browse Bikes
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-400">
          QR Bike Unlock
        </h1>

        <h2 className="text-xl mt-5">{rental.bikeName}</h2>

        <p className="text-gray-400 mt-2">
          Scan QR Code to Unlock Bike
        </p>

        {qrImage && (
          <div className="bg-white p-4 rounded-xl inline-block mt-6">
            <img
              src={qrImage}
              alt="Bike Unlock QR Code"
              className="w-52 h-52"
            />
          </div>
        )}

        <button
          onClick={() => setUnlocked(true)}
          disabled={unlocked}
          className="w-full bg-green-500 hover:bg-green-600 p-3 rounded-lg mt-8 font-bold disabled:opacity-50"
        >
          {unlocked ? "Bike Unlocked" : "Simulate Unlock"}
        </button>

        {unlocked && (
          <p className="text-green-400 mt-5 font-bold">
            Bike Unlocked Successfully!
          </p>
        )}

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 text-gray-400"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}