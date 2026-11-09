
"use client";

import { useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowRight,
  FaHeadset,
  FaPaperPlane,
} from "react-icons/fa";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#20231f]">

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#f3dce2] opacity-60 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-[#dce9df] opacity-70 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-[#e9d8dc] bg-white/70 px-5 py-2 text-xs font-bold tracking-[0.2em] text-[#bd7186]">
            GET IN TOUCH
          </span>

          <h1 className="mt-7 text-5xl font-black leading-tight sm:text-6xl">
            Let's start a
            <span className="block text-[#d47c91]">conversation.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-500">
            Have a question, suggestion or need help with your booking?
            We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-24 lg:grid-cols-[0.8fr_1.2fr]">

        {/* Contact Information */}
        <div className="relative overflow-hidden rounded-[2rem] bg-[#263b32] p-8 text-white shadow-2xl sm:p-10">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[35px] border-white/5" />

          <div className="relative">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e7a9b8]">
              Contact information
            </p>

            <h2 className="mt-5 text-3xl font-black">
              We're here to help.
            </h2>

            <p className="mt-4 leading-7 text-white/65">
              Reach out to us for questions about renting, listing vehicles
              or using the RideGlow marketplace.
            </p>

            <div className="mt-12 space-y-8">
              <div className="flex items-start gap-5">
                <div className="rounded-xl bg-white/10 p-4 text-[#e7a9b8]">
                  <FaEnvelope size={20} />
                </div>
                <div>
                  <h3 className="font-bold">Email Support</h3>
                  <p className="mt-1 text-sm text-white/60">
                    Contact us through the message form.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="rounded-xl bg-white/10 p-4 text-[#e7a9b8]">
                  <FaHeadset size={20} />
                </div>
                <div>
                  <h3 className="font-bold">Customer Support</h3>
                  <p className="mt-1 text-sm text-white/60">
                    We're here to help with your queries.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="rounded-xl bg-white/10 p-4 text-[#e7a9b8]">
                  <FaMapMarkerAlt size={20} />
                </div>
                <div>
                  <h3 className="font-bold">Our Platform</h3>
                  <p className="mt-1 text-sm text-white/60">
                    Connecting vehicle owners and renters.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="text-sm font-semibold text-[#e7a9b8]">
                RideGlow Promise
              </p>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Your questions matter. We're building a simpler rental
                experience, one conversation at a time.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-[2rem] border border-white bg-white/80 p-7 shadow-xl shadow-gray-900/5 backdrop-blur-xl sm:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#bd7186]">
              Send us a message
            </p>

            <h2 className="mt-3 text-3xl font-black">
              How can we help you?
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Fill in the details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-9 space-y-6">

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-[#faf9f6] px-4 py-4 text-sm outline-none transition focus:border-[#d47c91] focus:ring-2 focus:ring-[#d47c91]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-[#faf9f6] px-4 py-4 text-sm outline-none transition focus:border-[#d47c91] focus:ring-2 focus:ring-[#d47c91]/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What is this about?"
                required
                className="w-full rounded-xl border border-gray-200 bg-[#faf9f6] px-4 py-4 text-sm outline-none transition focus:border-[#d47c91] focus:ring-2 focus:ring-[#d47c91]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Your Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                rows={6}
                required
                className="w-full resize-none rounded-xl border border-gray-200 bg-[#faf9f6] px-4 py-4 text-sm outline-none transition focus:border-[#d47c91] focus:ring-2 focus:ring-[#d47c91]/10"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#263b32] px-6 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#385447]"
            >
              Send Message <FaPaperPlane />
            </button>

            {submitted && (
              <p className="rounded-xl bg-[#e8efe8] p-4 text-sm font-medium text-[#385447]">
                Form validation successful! Email sending will be connected
                when we set up the backend.
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
