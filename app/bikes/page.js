
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaArrowRight,
  FaMotorcycle,
  FaCar,
  FaSlidersH,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";

export default function BikesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await fetch("/api/vehicles");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load vehicles");
        }

        setVehicles(data.vehicles || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, []);

  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];

    if (type !== "all") {
      result = result.filter(
        (vehicle) => vehicle.vehicleType === type
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((vehicle) =>
        [
          vehicle.name,
          vehicle.brand,
          vehicle.model,
          vehicle.location,
          vehicle.vehicleType,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query))
      );
    }

    if (sort === "low") {
      result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sort === "high") {
      result.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }

    return result;
  }, [vehicles, search, type, sort]);

  return (
    <main className="min-h-screen bg-[#f8f8f5] px-4 pb-20 pt-10 sm:px-8">
      <div className="mx-auto max-w-7xl">

        <section className="relative mb-10 overflow-hidden rounded-[2rem] bg-[#263b35] px-6 py-12 text-white shadow-xl sm:px-12 sm:py-16">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#a9c5ad]/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-pink-200/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <span className="mb-5 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-widest text-[#d9e8dc]">
              EXPLORE YOUR NEXT RIDE
            </span>

            <h1 className="text-4xl font-bold leading-tight sm:text-6xl">
              Find the perfect
              <span className="block text-[#c8dfcc]">ride for your journey.</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
              Explore bikes and cars listed by vehicle owners.
              Choose your ride and book it at your preferred price.
            </p>
          </div>

          <div className="relative z-10 mt-9 flex flex-wrap gap-5 text-sm text-white/80">
            <span className="flex items-center gap-2">
              <FaMotorcycle /> Bikes
            </span>
            <span className="flex items-center gap-2">
              <FaCar /> Cars
            </span>
            <span className="flex items-center gap-2">
              <FaSlidersH /> Easy search
            </span>
          </div>
        </section>

        <section className="mb-10 rounded-3xl border border-white bg-white/70 p-5 shadow-lg shadow-gray-200/40 backdrop-blur-xl sm:p-7">
          <div className="grid gap-5 md:grid-cols-[1fr_220px]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Search vehicles
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#fafaf8] px-4 py-4 transition focus-within:border-[#76977d] focus-within:ring-2 focus-within:ring-[#76977d]/20">
                <FaSearch className="text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, brand, model or location..."
                  className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Sort by price
              </label>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-[#fafaf8] px-4 py-4 text-sm text-gray-700 outline-none focus:border-[#76977d]"
              >
                <option value="newest">Newest first</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="mr-2 text-sm font-semibold text-gray-600">
              Vehicle type:
            </span>

            {[
              { value: "all", label: "All Vehicles" },
              { value: "bike", label: "Bikes" },
              { value: "car", label: "Cars" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setType(item.value)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  type === item.value
                    ? "bg-[#30483d] text-white shadow-md"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-[#76977d] hover:text-[#30483d]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#78917b]">
              DISCOVER YOUR RIDE
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#263b35] sm:text-3xl">
              Available Vehicles
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            {filteredVehicles.length} vehicles found
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-96 animate-pulse rounded-3xl bg-gray-200"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-100 bg-white p-10 text-center text-red-600">
            {error}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mb-4 text-5xl">🚘</div>
            <h3 className="text-xl font-bold text-gray-800">
              No vehicles found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or vehicle filter.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setType("all");
                setSort("newest");
              }}
              className="mt-6 rounded-full bg-[#30483d] px-6 py-3 text-sm font-semibold text-white hover:bg-[#20352b]"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <article
                key={vehicle._id}
                className="group overflow-hidden rounded-[1.7rem] border border-white bg-white shadow-md shadow-gray-200/50 transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden bg-[#edf0eb]">
                  {vehicle.images?.[0] ? (
                    <img
                      src={vehicle.images[0]}
                      alt={vehicle.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-7xl">
                      {vehicle.vehicleType === "car" ? "🚗" : "🏍️"}
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/90 px-4 py-2 text-xs font-bold capitalize text-[#30483d] shadow-sm backdrop-blur">
                    {vehicle.vehicleType}
                  </span>

                  <span className="absolute right-4 top-4 rounded-full bg-[#e1f1e3] px-3 py-2 text-xs font-bold text-[#426b4a]">
                    Available
                  </span>
                </div>

                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-[#263b35]">
                      {vehicle.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {vehicle.brand} {vehicle.model}
                    </p>
                  </div>

                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                    <FaMapMarkerAlt className="text-[#8ba58e]" />
                    {vehicle.location}
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-y border-gray-100 py-4">
                    <div>
                      <p className="flex items-center gap-2 text-xs text-gray-400">
                        <FaClock /> Per hour
                      </p>
                      <p className="mt-1 text-lg font-bold text-[#30483d]">
                        ₹{vehicle.pricePerHour}
                      </p>
                    </div>

                    <div>
                      <p className="flex items-center gap-2 text-xs text-gray-400">
                        <FaCalendarAlt /> Per day
                      </p>
                      <p className="mt-1 text-lg font-bold text-[#30483d]">
                        ₹{vehicle.pricePerDay}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">Listed by</p>
                      <p className="truncate text-sm font-semibold text-gray-700">
                        {vehicle.owner?.name || "Vehicle Owner"}
                      </p>
                    </div>

                    <Link
                      href={`/bikes/${vehicle._id}`}
                      className="flex shrink-0 items-center gap-2 rounded-full bg-[#30483d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#20352b]"
                    >
                      Rent Now <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
