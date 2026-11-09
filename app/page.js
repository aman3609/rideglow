
import Link from "next/link";
import {
  FaArrowRight,
  FaCarSide,
  FaMotorcycle,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaClock,
  FaStar,
  FaSearch,
  FaKey,
} from "react-icons/fa";

const vehicles = [
  {
    name: "Royal Enfield Classic 350",
    type: "Premium Bike",
    price: "₹499",
    period: "/ day",
    rating: "4.9",
    location: "Gurugram, Haryana",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=900",
    tag: "Popular",
  },
  {
    name: "Mercedes-Benz C-Class",
    type: "Luxury Car",
    price: "₹4,999",
    period: "/ day",
    rating: "5.0",
    location: "New Delhi, India",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900",
    tag: "Luxury",
  },
  {
    name: "KTM Duke 390",
    type: "Sports Bike",
    price: "₹799",
    period: "/ day",
    rating: "4.8",
    location: "Chandigarh, India",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=900",
    tag: "Trending",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#20231f]">

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 md:pt-24">
        <div className="absolute -right-32 -top-20 h-96 w-96 rounded-full bg-[#f3dce2] opacity-60 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#dce9df] opacity-70 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#e9d8dc] bg-white/70 px-4 py-2 text-xs font-semibold tracking-wide text-[#b66c80] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#d47c91]" />
              YOUR JOURNEY, YOUR WAY
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">
              Find your
              <span className="block text-[#d47c91]">perfect ride.</span>
              Own the journey.
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-gray-500 sm:text-lg">
              Discover bikes and cars from people around you. Book your next
              ride or turn your own vehicle into an earning opportunity.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/bikes"
                className="inline-flex items-center gap-3 rounded-full bg-[#263b32] px-7 py-4 font-semibold text-white shadow-xl shadow-[#263b32]/20 transition hover:-translate-y-1 hover:bg-[#385447]"
              >
                Explore Vehicles <FaArrowRight />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white/80 px-7 py-4 font-semibold transition hover:-translate-y-1 hover:border-[#d47c91] hover:text-[#b66c80]"
              >
                List Your Vehicle
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-8">
              <div>
                <p className="text-2xl font-black">Easy</p>
                <p className="mt-1 text-sm text-gray-500">Quick booking</p>
              </div>
              <div className="h-12 w-px bg-gray-200" />
              <div>
                <p className="text-2xl font-black">Flexible</p>
                <p className="mt-1 text-sm text-gray-500">Hourly & daily</p>
              </div>
              <div className="h-12 w-px bg-gray-200" />
              <div>
                <p className="text-2xl font-black">Simple</p>
                <p className="mt-1 text-sm text-gray-500">One account</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-[#f1dce2] to-[#dce9df] blur-2xl opacity-70" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/30 p-3 shadow-2xl shadow-gray-900/10 backdrop-blur-xl">
              <div
                className="relative min-h-[430px] rounded-[1.5rem] bg-cover bg-center sm:min-h-[530px]"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/5" />
                <div className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur-lg">
                  Discover something different
                </div>
                <div className="absolute bottom-7 left-7 right-7 text-white">
                  <p className="text-sm font-medium text-white/80">MAKE EVERY TRIP COUNT</p>
                  <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                    More than just a ride.
                  </h2>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-7 -left-5 hidden items-center gap-3 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-xl backdrop-blur-xl sm:flex">
              <div className="rounded-xl bg-[#e5eee7] p-3 text-[#385447]">
                <FaShieldAlt size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Simple & convenient</p>
                <p className="text-xs text-gray-500">Your ride, your choice</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search bar */}
      <section className="relative z-10 mx-auto -mt-2 max-w-6xl px-6">
        <div className="grid gap-3 rounded-3xl border border-white bg-white/85 p-4 shadow-xl shadow-gray-900/5 backdrop-blur-xl md:grid-cols-[1fr_1fr_auto] md:items-center md:p-5">
          <div className="flex items-center gap-3 rounded-2xl bg-[#faf9f6] px-4 py-3">
            <FaMapMarkerAlt className="text-[#d47c91]" />
            <div>
              <p className="text-xs text-gray-400">Location</p>
              <p className="text-sm font-semibold">Where do you need a ride?</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-[#faf9f6] px-4 py-3">
            <FaCarSide className="text-[#d47c91]" />
            <div>
              <p className="text-xs text-gray-400">Vehicle</p>
              <p className="text-sm font-semibold">Bike or Car</p>
            </div>
          </div>
          <Link
            href="/bikes"
            className="flex items-center justify-center gap-3 rounded-2xl bg-[#d47c91] px-7 py-4 font-semibold text-white transition hover:bg-[#bd687f]"
          >
            <FaSearch /> Find a Ride
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#bd7186]">
            Explore your options
          </p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Choose your kind of ride
          </h2>
          <p className="mt-4 text-gray-500">
            From everyday commutes to unforgettable road trips.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Link
            href="/bikes"
            className="group flex items-center justify-between overflow-hidden rounded-[2rem] border border-[#e9e4df] bg-[#f2e8e7] p-8 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div>
              <div className="mb-5 inline-flex rounded-2xl bg-white/70 p-4 text-[#bd7186]">
                <FaMotorcycle size={27} />
              </div>
              <h3 className="text-2xl font-black">Explore Bikes</h3>
              <p className="mt-2 text-sm text-gray-600">Find the perfect two-wheeler.</p>
              <p className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
                Discover bikes <FaArrowRight className="transition group-hover:translate-x-2" />
              </p>
            </div>
            <FaMotorcycle className="text-7xl text-[#bd7186]/25 transition group-hover:rotate-[-8deg] group-hover:scale-110 sm:text-8xl" />
          </Link>

          <Link
            href="/bikes"
            className="group flex items-center justify-between overflow-hidden rounded-[2rem] border border-[#e0e8df] bg-[#e8efe8] p-8 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div>
              <div className="mb-5 inline-flex rounded-2xl bg-white/70 p-4 text-[#496b57]">
                <FaCarSide size={27} />
              </div>
              <h3 className="text-2xl font-black">Explore Cars</h3>
              <p className="mt-2 text-sm text-gray-600">Make every journey comfortable.</p>
              <p className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
                Discover cars <FaArrowRight className="transition group-hover:translate-x-2" />
              </p>
            </div>
            <FaCarSide className="text-7xl text-[#496b57]/25 transition group-hover:scale-110 sm:text-8xl" />
          </Link>
        </div>
      </section>

      {/* Featured vehicles */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#bd7186]">
                Handpicked for you
              </p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Featured rides
              </h2>
              <p className="mt-3 text-gray-500">
                Find a ride that matches your plans.
              </p>
            </div>
            <Link href="/bikes" className="inline-flex items-center gap-2 font-bold text-[#bd7186]">
              View all vehicles <FaArrowRight />
            </Link>
          </div>

          <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.name}
                className="group overflow-hidden rounded-[1.7rem] border border-gray-100 bg-[#faf9f6] transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-900/10"
              >
                <div className="relative h-60 overflow-hidden">
                  <div
                    className="h-full w-full bg-cover bg-center transition duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${vehicle.image})` }}
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs font-bold backdrop-blur">
                    {vehicle.tag}
                  </span>
                  <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-2 text-xs font-bold">
                    <FaStar className="text-amber-400" /> {vehicle.rating}
                  </span>
                </div>

                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#bd7186]">
                    {vehicle.type}
                  </p>
                  <h3 className="mt-2 text-xl font-bold">{vehicle.name}</h3>
                  <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <FaMapMarkerAlt className="text-[#bd7186]" />
                    {vehicle.location}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-5">
                    <p>
                      <span className="text-2xl font-black">{vehicle.price}</span>
                      <span className="text-sm text-gray-500">{vehicle.period}</span>
                    </p>
                    <Link
                      href="/bikes"
                      className="rounded-full bg-[#263b32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#385447]"
                    >
                      View Ride
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#bd7186]">
            Made for everyone
          </p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Your ride. Your rules.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <FaSearch size={23} />,
              title: "Find your vehicle",
              text: "Explore bikes and cars available around your location.",
            },
            {
              icon: <FaKey size={23} />,
              title: "Book your ride",
              text: "Choose your dates and send a booking request.",
            },
            {
              icon: <FaClock size={23} />,
              title: "Start your journey",
              text: "Connect with the vehicle owner and enjoy your trip.",
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4e5e9] text-[#bd7186]">
                {item.icon}
              </div>
              <p className="text-xs font-bold text-gray-400">0{index + 1}</p>
              <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
              <p className="mt-3 leading-7 text-gray-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* List your vehicle CTA */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#263b32] px-8 py-14 text-white sm:px-14 sm:py-16">
          <div className="absolute -right-16 -top-28 h-80 w-80 rounded-full border-[45px] border-white/5" />
          <div className="relative flex flex-col items-start justify-between gap-9 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e9aabb]">
                Have a vehicle?
              </p>
              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
                Let your vehicle earn while you relax.
              </h2>
              <p className="mt-5 leading-7 text-white/65">
                List your bike or car and connect with people looking for their next ride.
                One account lets you rent and list vehicles.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="shrink-0 rounded-full bg-[#e7a9b8] px-8 py-4 font-bold text-[#263b32] transition hover:-translate-y-1 hover:bg-white"
            >
              List Your Vehicle <FaArrowRight className="ml-2 inline" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-gray-200 bg-white px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row">
          <div>
            <Link href="/" className="text-2xl font-black">
              Ride<span className="text-[#d47c91]">Glow.</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
              A better way to discover, rent and share vehicles. Make every journey count.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 text-sm font-medium text-gray-500">
            <Link href="/" className="hover:text-[#bd7186]">Home</Link>
            <Link href="/bikes" className="hover:text-[#bd7186]">Explore</Link>
            <Link href="/login" className="hover:text-[#bd7186]">Login</Link>
            <Link href="/register" className="hover:text-[#bd7186]">Register</Link>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
       © 2026 RideGlow. All rights reserved.
        </div>
      </footer>
    </main>
  );
}   
