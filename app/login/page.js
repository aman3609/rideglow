
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaMotorcycle,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.message || "Invalid email or password");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch {
      setMessage("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f2] p-3 sm:p-6 lg:p-10">
      <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-[1450px] overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-[#263b35]/10 sm:min-h-[calc(100vh-48px)] lg:grid-cols-[1.05fr_0.95fr]">

        {/* LEFT IMAGE SECTION */}
        <section className="relative hidden min-h-[700px] overflow-hidden bg-[#263b35] lg:flex lg:flex-col lg:justify-between">
          <img
            src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1800&q=90"
            alt="Luxury vehicle"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#172b24]/80 via-[#172b24]/35 to-[#172b24]/95" />

          <div className="relative z-10 flex items-center justify-between p-10">
            <Link href="/" className="flex items-center gap-3 text-white">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-2xl backdrop-blur-xl">
                <FaMotorcycle />
              </span>

              <span className="text-2xl font-extrabold tracking-tight">
                RideGlow
              </span>
            </Link>

            <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold tracking-widest text-white/90 backdrop-blur-xl">
              PREMIUM MOBILITY
            </span>
          </div>

          <div className="relative z-10 max-w-2xl p-10 pb-12">
            <div className="mb-6 flex items-center gap-2">
              <span className="h-1 w-10 rounded-full bg-[#d5e6d5]" />
              <span className="text-xs font-bold tracking-[0.25em] text-[#d5e6d5]">
                YOUR JOURNEY STARTS HERE
              </span>
            </div>

            <h1 className="text-5xl font-bold leading-[1.15] text-white xl:text-6xl">
              Find your ride.
              <span className="mt-2 block text-[#c8dfcc]">
                Feel the freedom.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-white/75">
              Discover exceptional bikes and cars, connect with vehicle
              owners, and make every journey worth remembering.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
                <FaShieldAlt className="text-xl text-[#d5e6d5]" />
                <p className="mt-3 font-bold text-white">
                  Trusted Experience
                </p>
                <p className="mt-1 text-xs text-white/60">
                  A smarter way to rent
                </p>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
                <FaCheckCircle className="text-xl text-[#d5e6d5]" />
                <p className="mt-3 font-bold text-white">
                  Easy Bookings
                </p>
                <p className="mt-1 text-xs text-white/60">
                  Your ride, your choice
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex justify-between px-10 pb-8 text-xs text-white/50">
            <span>© 2026 RideGlow</span>
            <span>Drive your next adventure.</span>
          </div>
        </section>

        {/* RIGHT LOGIN SECTION */}
        <section className="relative flex items-center justify-center overflow-hidden px-5 py-10 sm:px-12 lg:px-14 xl:px-20">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#e4eee4]/70 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#f8e8ed]/70 blur-3xl" />

          <div className="relative z-10 w-full max-w-md">
            <Link
              href="/"
              className="mb-12 flex w-fit items-center gap-3 text-xl font-extrabold text-[#263b35] lg:hidden"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#263b35] text-white">
                <FaMotorcycle />
              </span>
              RideGlow
            </Link>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#eaf1e9] px-4 py-2 text-xs font-bold tracking-wider text-[#496d50]">
                <span className="h-2 w-2 rounded-full bg-[#6c9872]" />
                WELCOME BACK
              </div>

              <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-[#263b35] sm:text-5xl">
                Sign in<span className="text-[#789b7d]">.</span>
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-500">
                Welcome back! Enter your details and continue your journey
                with RideGlow.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div>
                <label className="mb-3 block text-sm font-bold text-[#35483c]">
                  Email Address
                </label>

                <div className="group flex items-center rounded-2xl border border-[#e5e9e3] bg-[#fafbf8] transition-all duration-300 focus-within:border-[#789b7d] focus-within:bg-white focus-within:shadow-lg focus-within:shadow-[#789b7d]/10">
                  <FaEnvelope className="ml-5 text-gray-400 transition group-focus-within:text-[#496d50]" />

                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="w-full bg-transparent px-4 py-5 text-sm text-[#263b35] outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <label className="text-sm font-bold text-[#35483c]">
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-bold text-[#66866c] transition hover:text-[#263b35]"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="group flex items-center rounded-2xl border border-[#e5e9e3] bg-[#fafbf8] transition-all duration-300 focus-within:border-[#789b7d] focus-within:bg-white focus-within:shadow-lg focus-within:shadow-[#789b7d]/10">
                  <FaLock className="ml-5 text-gray-400 transition group-focus-within:text-[#496d50]" />

                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="w-full bg-transparent px-4 py-5 text-sm text-[#263b35] outline-none placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="mr-5 text-gray-400 transition hover:text-[#30483d]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-500">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 accent-[#496d50]"
                />
                Remember me
              </label>

              {message && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#263b35] py-5 text-sm font-bold text-white shadow-xl shadow-[#263b35]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#354f43] hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In to RideGlow"}
                {!loading && (
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">NEW TO RIDEGLOW?</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-extrabold text-[#496d50] transition hover:text-[#263b35] hover:underline"
              >
                Create Account
              </Link>
            </p>

            <p className="mt-10 text-center text-xs text-gray-400">
              Secure access to your RideGlow account.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
