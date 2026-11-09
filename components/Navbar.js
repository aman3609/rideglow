
"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaArrowRight } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/bikes" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/80 shadow-sm backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="text-2xl font-black tracking-tight"
        >
          Ride<span className="text-[#d47c91]">Glow.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-9 text-sm font-semibold text-gray-600 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative transition duration-300 hover:text-[#d47c91]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/login"
            className="rounded-full px-5 py-2.5 text-sm font-semibold transition hover:bg-gray-100"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="flex items-center gap-2 rounded-full bg-[#263b32] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#263b32]/15 transition hover:-translate-y-0.5 hover:bg-[#385447]"
          >
            Get Started <FaArrowRight size={11} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-xl text-[#263b32] transition hover:bg-[#f4e5e9] md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          menuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 bg-white/95 px-6 pb-6 pt-4 backdrop-blur-xl">

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-[#f8edf0] hover:text-[#bd7186]"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-full border border-gray-200 px-5 py-3 text-center text-sm font-semibold text-[#263b32] transition hover:bg-gray-50"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="rounded-full bg-[#263b32] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#385447]"
              >
                Get Started
              </Link>
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
}
