
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaMotorcycle,
  FaCar,
  FaPlus,
  FaClipboardList,
  FaWallet,
  FaHistory,
  FaUsers,
  FaShieldAlt,
  FaArrowRight,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f8f5]">
        <p className="font-medium text-[#30483d]">Loading dashboard...</p>
      </div>
    );
  }

  const isAdmin = user.role === "admin";

  const userOptions = [
    {
      title: "Explore Vehicles",
      description: "Discover bikes and cars available for rent.",
      link: "/bikes",
      icon: <FaMotorcycle />,
      color: "bg-[#e4eee4] text-[#496d50]",
    },
    {
      title: "List Your Vehicle",
      description: "Earn money by listing your bike or car.",
      link: "/seller-dashboard",
      icon: <FaPlus />,
      color: "bg-[#f8e8ed] text-[#a65f76]",
    },
    {
      title: "My Listings",
      description: "View and manage your listed vehicles.",
      link: "/seller-dashboard",
      icon: <FaCar />,
      color: "bg-[#e9edf7] text-[#61739b]",
    },
    {
      title: "My Bookings",
      description: "Manage bookings and rental requests.",
      link: "/bookings",
      icon: <FaClipboardList />,
      color: "bg-[#f7eddd] text-[#a17a40]",
    },
    {
      title: "My Wallet",
      description: "View your wallet and balance.",
      link: "/wallet",
      icon: <FaWallet />,
      color: "bg-[#e6eff1] text-[#527e87]",
    },
    {
      title: "Rental History",
      description: "Check your previous rental activity.",
      link: "/history",
      icon: <FaHistory />,
      color: "bg-[#eee8f5] text-[#80659c]",
    },
  ];

  const adminOptions = [
    ...userOptions,
    {
      title: "Manage Users",
      description: "View, suspend and manage user accounts.",
      link: "/admin/users",
      icon: <FaUsers />,
      color: "bg-[#f8e8ed] text-[#a65f76]",
    },
    {
      title: "Admin Dashboard",
      description: "Manage vehicles, users and platform activity.",
      link: "/admin",
      icon: <FaShieldAlt />,
      color: "bg-[#e4eee4] text-[#496d50]",
    },
  ];

  const options = isAdmin ? adminOptions : userOptions;

  return (
    <main className="min-h-screen bg-[#f8f8f5] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">

        <section className="relative overflow-hidden rounded-[2rem] bg-[#263b35] p-7 text-white shadow-xl sm:p-10">
          <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#a9c5ad]/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-pink-200/10 blur-3xl" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-sm font-semibold tracking-widest text-[#c8dfcc]">
                RIDEGLOW ACCOUNT
              </p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                Welcome back, {user.name}!
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
                Your journey starts here. Explore vehicles, manage your
                bookings or list your own vehicle.
              </p>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>

          <div className="relative z-10 mt-8 flex flex-wrap gap-3">
            <span className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90">
              <FaUserCircle />
              {user.name}
            </span>

            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm capitalize text-[#c8dfcc]">
              {isAdmin ? "Administrator" : "Member Account"}
            </span>
          </div>
        </section>

        <section className="mb-8 mt-12">
          <p className="text-sm font-semibold tracking-widest text-[#78917b]">
            YOUR CONTROL CENTER
          </p>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-[#263b35] sm:text-3xl">
                {isAdmin ? "Platform Management" : "Manage Your Activities"}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Everything you need, all in one place.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((item) => (
            <button
              key={item.title}
              onClick={() => router.push(item.link)}
              className="group rounded-[1.7rem] border border-white bg-white/80 p-6 text-left shadow-md shadow-gray-200/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${item.color}`}>
                  {item.icon}
                </div>

                <FaArrowRight className="mt-2 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#496d50]" />
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#263b35]">
                {item.title}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
                {item.description}
              </p>

              <p className="mt-5 text-sm font-bold text-[#496d50]">
                Open Section →
              </p>
            </button>
          ))}
        </section>

        <section className="mt-10 flex flex-col items-start justify-between gap-5 rounded-[1.7rem] border border-[#dce8dc] bg-[#eaf1e9] p-7 sm:flex-row sm:items-center sm:p-9">
          <div>
            <p className="text-sm font-semibold tracking-widest text-[#78917b]">
              HAVE A VEHICLE?
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#263b35]">
              Turn your vehicle into earnings.
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              List your bike or car and start receiving rental requests.
            </p>
          </div>

          <button
            onClick={() => router.push("/seller-dashboard")}
            className="flex shrink-0 items-center gap-3 rounded-full bg-[#30483d] px-7 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-[#20352b]"
          >
            List Your Vehicle <FaArrowRight />
          </button>
        </section>

        <p className="mt-10 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} RideGlow. All rights reserved.
        </p>
      </div>
    </main>
  );
}
