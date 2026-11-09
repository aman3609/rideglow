
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Wallet() {
  const router = useRouter();

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [booking, setBooking] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchWallet = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/wallet", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Unable to load wallet");
    }

    setBalance(data.balance || 0);
    setTransactions(data.transactions || []);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!user || !token) {
      router.push("/login");
      return;
    }

    const loadWallet = async () => {
      try {
        await fetchWallet();

        const savedBooking = localStorage.getItem("pendingBooking");

        if (savedBooking) {
          setBooking(JSON.parse(savedBooking));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadWallet();
  }, [router]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const addMoney = async (e) => {
    e.preventDefault();

    const value = Number(amount);

    if (!Number.isSafeInteger(value) || value < 1 || value > 50000) {
      setError("Enter an amount between ₹1 and ₹50,000.");
      return;
    }

    setPaymentLoading(true);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const loaded = await loadRazorpay();

      if (!loaded) {
        throw new Error("Unable to load Razorpay. Check your internet.");
      }

      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: value }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || "Unable to create payment order");
      }

      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "RideGlow",
        description: "Wallet Recharge",
        order_id: orderData.order.id,

        handler: async function (response) {
          try {
            setMessage("Verifying your payment...");

            const verifyRes = await fetch("/api/payment/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(
                verifyData.message ||
                "Payment verification failed. Contact support with your payment ID."
              );
            }

            await fetchWallet();

            setAmount("");
            setMessage("Payment successful! Money added to your wallet.");
          } catch (err) {
            setError(err.message);
            setMessage("");
          } finally {
            setPaymentLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
            setMessage("Payment window closed.");
          },
        },

        theme: {
          color: "#30483d",
        },
      };

      const paymentWindow = new window.Razorpay(options);

      paymentWindow.on("payment.failed", function (response) {
        setError(
          response.error?.description || "Payment failed. Please try again."
        );
        setPaymentLoading(false);
        setMessage("");
      });

      paymentWindow.open();
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setPaymentLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f8f5] px-4 py-10 text-[#263b35] sm:px-8">
      <div className="mx-auto max-w-5xl">

        <div>
          <p className="text-sm font-semibold tracking-widest text-[#78917b]">
            RIDEGLOW
          </p>
          <h1 className="mt-2 text-3xl font-bold">My Wallet</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your balance and transactions.
          </p>
        </div>

        {loading ? (
          <p className="mt-10 text-gray-500">Loading wallet...</p>
        ) : (
          <>
            <div className="mt-8 rounded-3xl bg-[#263b35] p-8 text-white shadow-xl sm:p-10">
              <p className="text-sm text-white/70">Available Balance</p>

              <h2 className="mt-3 text-5xl font-bold">
                ₹{balance.toLocaleString("en-IN")}
              </h2>

              <p className="mt-5 text-sm text-white/60">
                Your personal RideGlow wallet
              </p>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {message && (
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                {message}
              </div>
            )}

            <div className="mt-7 rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-bold">Add Money</h2>

              <p className="mt-2 text-sm text-gray-500">
                Recharge your RideGlow wallet securely.
              </p>

              <form onSubmit={addMoney} className="mt-5">
                <label className="mb-2 block text-sm font-semibold">
                  Enter Amount (INR)
                </label>

                <input
                  type="number"
                  min="1"
                  max="50000"
                  step="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  disabled={paymentLoading}
                  className="w-full rounded-xl border border-gray-200 bg-[#fafaf8] px-4 py-3 outline-none focus:border-[#78917b] sm:max-w-md"
                />

                <div className="mt-4 flex flex-wrap gap-2">
                  {[100, 500, 1000, 2000].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAmount(String(value))}
                      className="rounded-full border border-[#dce8dc] px-4 py-2 text-sm font-semibold text-[#496d50] hover:bg-[#edf4ed]"
                    >
                      ₹{value}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="mt-6 w-full rounded-xl bg-[#30483d] py-3.5 font-semibold text-white transition hover:bg-[#263b35] disabled:opacity-60 sm:w-auto sm:px-10"
                >
                  {paymentLoading ? "Processing..." : "Proceed to Payment"}
                </button>
              </form>

              <p className="mt-4 text-xs text-gray-400">
                Secured by Razorpay. UPI, cards and other supported methods
                are available through Checkout.
              </p>
            </div>

            {booking && (
              <div className="mt-7 rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">
                <h2 className="text-xl font-bold">Booking Summary</h2>

                <p className="mt-4 text-gray-600">{booking.bikeName}</p>

                <p className="mt-2 text-sm text-gray-500">
                  Duration: {booking.duration} {booking.type}
                </p>

                <p className="mt-3 text-xl font-bold text-[#496d50]">
                  Total: ₹{booking.total}
                </p>

                <p className="mt-4 text-sm text-gray-500">
                  Booking payment will be enabled separately.
                </p>
              </div>
            )}

            <div className="mt-7 rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-bold">Transaction History</h2>

              {transactions.length === 0 ? (
                <p className="mt-5 text-sm text-gray-500">
                  No transactions yet.
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {transactions.slice().reverse().map((transaction, index) => (
                    <div
                      key={transaction._id || index}
                      className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4"
                    >
                      <div>
                        <p className="font-semibold">
                          {transaction.description}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(transaction.date).toLocaleString()}
                        </p>
                      </div>

                      <p
                        className={`font-bold ${
                          transaction.type === "credit"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {transaction.type === "credit" ? "+" : "-"}₹
                        {transaction.amount}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
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
