
"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Unable to send OTP.");
        return;
      }

      setStep(2);
      setMessage(data.message);
    } catch {
      setMessage("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Password reset failed.");
        return;
      }

      setStep(3);
      setMessage(data.message);
    } catch {
      setMessage("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8f8f5] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/80 p-8 shadow-xl backdrop-blur-xl">
        <Link href="/login" className="text-sm text-[#526b5c] hover:underline">
          ← Back to Login
        </Link>

        <p className="mt-8 text-xs font-bold tracking-widest text-[#78917b]">
          RIDEGLOW ACCOUNT SECURITY
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[#263b35]">
          {step === 1 && "Forgot Password?"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "Password Updated!"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          {step === 1 && "Enter your registered email to receive a 6-digit OTP."}
          {step === 2 && `Enter the OTP sent to ${email} and choose a new password.`}
          {step === 3 && "Your password has been reset successfully. You can now login."}
        </p>

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#263b35]">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[#789681] focus:ring-2 focus:ring-[#789681]/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#30483d] py-3.5 font-semibold text-white transition hover:bg-[#263b35] disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#263b35]">
                6-Digit OTP
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter OTP"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#789681] focus:ring-2 focus:ring-[#789681]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#263b35]">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#789681] focus:ring-2 focus:ring-[#789681]/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full rounded-xl bg-[#30483d] py-3.5 font-semibold text-white transition hover:bg-[#263b35] disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setNewPassword("");
                setMessage("");
              }}
              className="w-full text-sm font-semibold text-[#66866c] hover:underline"
            >
              Change email address
            </button>
          </form>
        )}

        {step === 3 && (
          <Link
            href="/login"
            className="mt-8 block w-full rounded-xl bg-[#30483d] py-3.5 text-center font-semibold text-white transition hover:bg-[#263b35]"
          >
            Go to Login
          </Link>
        )}

        {message && (
          <div className={`mt-5 rounded-xl border p-3 text-sm ${
            step === 3
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-[#dce8dc] bg-[#f1f6f0] text-[#526b5c]"
          }`}>
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
