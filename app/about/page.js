
import Link from "next/link";
import {
  FaArrowRight,
  FaShieldAlt,
  FaHeart,
  FaUsers,
  FaGlobe,
  FaBullseye,
  FaLightbulb,
  FaCarSide,
  FaMotorcycle,
} from "react-icons/fa";

const values = [
  {
    icon: <FaShieldAlt />,
    title: "Trust & Safety",
    description:
      "We aim to make every rental experience transparent, reliable and convenient.",
  },
  {
    icon: <FaHeart />,
    title: "Customer First",
    description:
      "Every feature is designed around making your journey easier and more enjoyable.",
  },
  {
    icon: <FaUsers />,
    title: "Community Driven",
    description:
      "We connect vehicle owners and renters through one simple marketplace.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#20231f]">

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24 md:py-32">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#f3dce2] opacity-60 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#dce9df] opacity-70 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <span className="inline-block rounded-full border border-[#e9d8dc] bg-white/70 px-5 py-2 text-xs font-bold tracking-[0.2em] text-[#bd7186]">
            ABOUT RIDEGLOW
          </span>

          <h1 className="mt-8 text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Mobility made
            <span className="block text-[#d47c91]">simple for everyone.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-500 sm:text-lg">
            We believe getting around should be easy, flexible and accessible.
            RideGlow brings vehicle owners and people looking for a ride together
            in one convenient marketplace.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/bikes"
              className="flex items-center gap-3 rounded-full bg-[#263b32] px-7 py-4 font-semibold text-white transition hover:-translate-y-1 hover:bg-[#385447]"
            >
              Explore Vehicles <FaArrowRight />
            </Link>

            <Link
              href="/register"
              className="rounded-full border border-gray-200 bg-white/80 px-7 py-4 font-semibold transition hover:border-[#d47c91] hover:text-[#bd7186]"
            >
              Join RideGlow
            </Link>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-[2rem] border border-white shadow-2xl">
            <div
              className="h-[420px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1200)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-7 left-7 text-white">
              <p className="text-sm font-semibold tracking-widest text-white/80">
                EVERY JOURNEY MATTERS
              </p>
              <h2 className="mt-2 text-3xl font-black">
                Move freely. Live fully.
              </h2>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#bd7186]">
              Our Story
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              More than a rental platform.
            </h2>

            <p className="mt-6 leading-8 text-gray-500">
              RideGlow is designed to make vehicle rental more accessible.
              Instead of searching across different places, users can discover
              bikes and cars in one marketplace.
            </p>

            <p className="mt-5 leading-8 text-gray-500">
              We also give vehicle owners an opportunity to list their vehicles
              and connect with people looking for their next ride. One account
              can be used to both rent and list vehicles.
            </p>

            <div className="mt-9 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[#f8edf0] p-5">
                <FaMotorcycle className="text-2xl text-[#bd7186]" />
                <h3 className="mt-3 font-bold">Explore Bikes</h3>
                <p className="mt-1 text-sm text-gray-500">Two-wheel freedom.</p>
              </div>

              <div className="rounded-2xl bg-[#e8efe8] p-5">
                <FaCarSide className="text-2xl text-[#496b57]" />
                <h3 className="mt-3 font-bold">Explore Cars</h3>
                <p className="mt-1 text-sm text-gray-500">Comfortable journeys.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#bd7186]">
            What drives us
          </p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Our mission & vision
          </h2>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-2">
          <div className="rounded-[2rem] border border-[#f0dfe4] bg-[#f8edf0] p-9 transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#bd7186]">
              <FaBullseye size={24} />
            </div>
            <h3 className="mt-7 text-2xl font-black">Our Mission</h3>
            <p className="mt-4 leading-8 text-gray-600">
              To simplify vehicle rentals by creating a convenient marketplace
              where people can discover rides and vehicle owners can share their
              vehicles with others.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#e0e8df] bg-[#e8efe8] p-9 transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#496b57]">
              <FaLightbulb size={24} />
            </div>
            <h3 className="mt-7 text-2xl font-black">Our Vision</h3>
            <p className="mt-4 leading-8 text-gray-600">
              To build a connected mobility marketplace where renting and
              sharing vehicles becomes a simpler part of everyday life.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#bd7186]">
              What matters to us
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Values behind every ride
            </h2>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="rounded-3xl border border-gray-100 bg-[#faf9f6] p-8 transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4e5e9] text-xl text-[#bd7186]">
                  {value.icon}
                </div>

                <p className="mt-7 text-xs font-bold text-gray-400">
                  0{index + 1}
                </p>

                <h3 className="mt-2 text-xl font-bold">{value.title}</h3>

                <p className="mt-4 leading-7 text-gray-500">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#263b32] px-8 py-16 text-center text-white sm:px-16">
          <FaGlobe className="mx-auto text-4xl text-[#e7a9b8]" />

          <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-black sm:text-5xl">
            Ready to discover a better way to move?
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-white/65">
            Find your next ride or list your vehicle on RideGlow.
            Your next journey starts here.
          </p>

          <Link
            href="/bikes"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#e7a9b8] px-8 py-4 font-bold text-[#263b32] transition hover:-translate-y-1 hover:bg-white"
          >
            Explore Now <FaArrowRight />
          </Link>
        </div>
      </section>

    </main>
  );
}
