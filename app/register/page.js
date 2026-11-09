
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaMotorcycle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const passwordStrength = (() => {
    const password = form.password;
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    if (form.password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.message || "Unable to create account.");
        return;
      }

      setSuccess(true);
      setMessage("Your account has been created successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-transparent py-4 pl-12 pr-4 text-sm text-[#263b35] outline-none placeholder:text-gray-400";

  return (
    <main className="min-h-screen bg-[#f7f7f2] p-3 sm:p-6 lg:p-10">
      <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-[1450px] overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-[#263b35]/10 sm:min-h-[calc(100vh-48px)] lg:grid-cols-[1.05fr_0.95fr]">

        {/* LEFT IMAGE SECTION */}
        <section className="relative hidden min-h-[750px] overflow-hidden bg-[#263b35] lg:flex lg:flex-col lg:justify-between">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=90"
            alt="Premium vehicle"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#172b24]/85 via-[#172b24]/40 to-[#172b24]/95" />

          <div className="relative z-10 flex items-center justify-between p-10">
            <Link href="/" className="flex items-center gap-3 text-white">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-2xl backdrop-blur-xl">
                <FaMotorcycle />
              </span>

              <span className="text-2xl font-extrabold">
                RideGlow
              </span>
            </Link>

            <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold tracking-widest text-white/90 backdrop-blur-xl">
              JOIN THE COMMUNITY
            </span>
          </div>

          <div className="relative z-10 max-w-2xl p-10 pb-12">
            <div className="mb-6 flex items-center gap-2">
              <span className="h-1 w-10 rounded-full bg-[#d5e6d5]" />
              <span className="text-xs font-bold tracking-[0.25em] text-[#d5e6d5]">
                START SOMETHING NEW
              </span>
            </div>

            <h1 className="text-5xl font-bold leading-[1.15] text-white xl:text-6xl">
              Your next
              <span className="mt-2 block text-[#c8dfcc]">
                adventure awaits.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-white/75">
              Join RideGlow and experience a smarter way to discover,
              rent and list amazing vehicles. Your journey starts with
              one simple step.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
                <FaShieldAlt className="text-xl text-[#d5e6d5]" />
                <p className="mt-3 font-bold text-white">
                  Secure Account
                </p>
                <p className="mt-1 text-xs text-white/60">
                  Your account, your control
                </p>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
                <FaCheckCircle className="text-xl text-[#d5e6d5]" />
                <p className="mt-3 font-bold text-white">
                  One Platform
                </p>
                <p className="mt-1 text-xs text-white/60">
                  Rent and list vehicles
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex justify-between px-10 pb-8 text-xs text-white/50">
            <span>© 2026 RideGlow</span>
            <span>Make every journey count.</span>
          </div>
        </section>

        {/* RIGHT REGISTER SECTION */}
        <section className="relative flex items-center justify-center overflow-hidden px-5 py-10 sm:px-12 lg:px-14 xl:px-20">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#e4eee4]/70 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#f8e8ed]/70 blur-3xl" />

          <div className="relative z-10 w-full max-w-md">
            <Link
              href="/"
              className="mb-9 flex w-fit items-center gap-3 text-xl font-extrabold text-[#263b35] lg:hidden"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#263b35] text-white">
                <FaMotorcycle />
              </span>
              RideGlow
            </Link>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#eaf1e9] px-4 py-2 text-xs font-bold tracking-wider text-[#496d50]">
                <span className="h-2 w-2 rounded-full bg-[#6c9872]" />
                CREATE YOUR ACCOUNT
              </div>

              <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-[#263b35] sm:text-5xl">
                Get started<span className="text-[#789b7d]">.</span>
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                Create your RideGlow account and discover a better
                way to travel.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#35483c]">
                  Full Name
                </label>

                <div className="group flex items-center rounded-2xl border border-[#e5e9e3] bg-[#fafbf8] transition-all duration-300 focus-within:border-[#789b7d] focus-within:bg-white focus-within:shadow-lg focus-within:shadow-[#789b7d]/10">
                  <FaUser className="ml-5 text-gray-400 group-focus-within:text-[#496d50]" />

                  <input
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#35483c]">
                  Email Address
                </label>

                <div className="group flex items-center rounded-2xl border border-[#e5e9e3] bg-[#fafbf8] transition-all duration-300 focus-within:border-[#789b7d] focus-within:bg-white focus-within:shadow-lg focus-within:shadow-[#789b7d]/10">
                  <FaEnvelope className="ml-5 text-gray-400 group-focus-within:text-[#496d50]" />

                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#35483c]">
                  Phone Number
                </label>

                <div className="group flex items-center rounded-2xl border border-[#e5e9e3] bg-[#fafbf8] transition-all duration-300 focus-within:border-[#789b7d] focus-within:bg-white focus-within:shadow-lg focus-within:shadow-[#789b7d]/10">
                  <FaPhone className="ml-5 text-gray-400 group-focus-within:text-[#496d50]" />

                  <input
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#35483c]">
                  Password
                </label>

                <div className="group flex items-center rounded-2xl border border-[#e5e9e3] bg-[#fafbf8] transition-all duration-300 focus-within:border-[#789b7d] focus-within:bg-white focus-within:shadow-lg focus-within:shadow-[#789b7d]/10">
                  <FaLock className="ml-5 text-gray-400 group-focus-within:text-[#496d50]" />

                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className="w-full bg-transparent px-4 py-4 text-sm text-[#263b35] outline-none placeholder:text-gray-400"
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

                {form.password && (
                  <div className="mt-3">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <div
                          key={item}
                          className={`h-1.5 flex-1 rounded-full ${
                            passwordStrength >= item
                              ? passwordStrength <= 2
                                ? "bg-red-400"
                                : passwordStrength <= 3
                                ? "bg-amber-400"
                                : "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="mt-2 text-xs text-gray-400">
                      Password strength:{" "}
                      <span className="font-semibold text-[#496d50]">
                        {passwordStrength <= 2
                          ? "Weak"
                          : passwordStrength <= 3
                          ? "Medium"
                          : "Strong"}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {message && (
                <div
                  className={`rounded-2xl border p-4 text-sm ${
                    success
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || success}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#263b35] py-4 text-sm font-bold text-white shadow-xl shadow-[#263b35]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#354f43] hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : success ? "Account Created!" : "Create My Account"}

                {!loading && !success && (
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">
                ALREADY A MEMBER?
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-extrabold text-[#496d50] transition hover:text-[#263b35] hover:underline"
              >
                Sign In
              </Link>
            </p>

            <p className="mt-8 text-center text-xs text-gray-400">
              By creating an account, you agree to use RideGlow responsibly.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
