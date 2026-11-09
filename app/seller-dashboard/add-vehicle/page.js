
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddVehicle() {
  const router = useRouter();

  const [form, setForm] = useState({
    vehicleType: "bike",
    name: "",
    brand: "",
    model: "",
    registrationNumber: "",
    location: "",
    description: "",
    pricePerHour: "",
    pricePerDay: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    return () => {
      images.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [images]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const selected = Array.from(e.target.files || []);

    if (images.length + selected.length > 5) {
      setMessage("Maximum 5 images allowed.");
      e.target.value = "";
      return;
    }

    const validFiles = selected.filter(
      (file) =>
        file.type.startsWith("image/") &&
        file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== selected.length) {
      setMessage("Only images up to 5 MB are allowed.");
    } else {
      setMessage("");
    }

    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const setCoverImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      const [selected] = updated.splice(index, 1);
      updated.unshift(selected);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      setMessage("Please select at least one vehicle image.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const formData = new FormData();

      images.forEach((item) => {
        formData.append("images", item.file);
      });

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadData.success) {
        throw new Error(uploadData.message || "Image upload failed");
      }

      const vehicleResponse = await fetch("/api/seller/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          images: uploadData.images,
        }),
      });

      const vehicleData = await vehicleResponse.json();

      if (!vehicleResponse.ok) {
        throw new Error(vehicleData.message || "Vehicle listing failed");
      }

      setMessage("Vehicle listed successfully!");
      setTimeout(() => router.push("/seller-dashboard"), 1500);
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/seller-dashboard"
          className="mb-6 inline-block text-sm font-semibold text-[#55745f]"
        >
          ← Back to My Vehicles
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#78947d]">
            RideGlow Marketplace
          </p>
          <h1 className="text-3xl font-bold text-[#26352b] md:text-4xl">
            List Your Vehicle
          </h1>
          <p className="mt-2 text-gray-500">
            Add your vehicle details and upload its photos.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl border border-white bg-white p-6 shadow-xl shadow-gray-200/50 md:p-10"
        >
          <section>
            <h2 className="mb-4 text-xl font-bold text-[#26352b]">
              Vehicle Type
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {["bike", "car"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, vehicleType: type })}
                  className={`rounded-2xl border-2 p-5 font-semibold capitalize transition ${
                    form.vehicleType === type
                      ? "border-[#73977a] bg-[#edf4ed] text-[#45684d]"
                      : "border-gray-200 text-gray-500 hover:border-[#73977a]"
                  }`}
                >
                  {type === "bike" ? "🏍️ Bike" : "🚗 Car"}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[#26352b]">
              Vehicle Details
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              {[
                ["name", "Vehicle Name", "e.g. Royal Enfield Classic"],
                ["brand", "Brand", "e.g. Royal Enfield"],
                ["model", "Model", "e.g. Classic 350"],
                ["registrationNumber", "Registration Number", "e.g. HR26AB1234"],
                ["location", "Location", "e.g. Phagwara, Punjab"],
                ["pricePerHour", "Price Per Hour (₹)", "e.g. 100"],
                ["pricePerDay", "Price Per Day (₹)", "e.g. 1000"],
              ].map(([name, label, placeholder]) => (
                <div key={name}>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    {label}
                  </label>
                  <input
                    name={name}
                    type={
                      name === "pricePerHour" || name === "pricePerDay"
                        ? "number"
                        : "text"
                    }
                    min={
                      name === "pricePerHour" || name === "pricePerDay"
                        ? "1"
                        : undefined
                    }
                    required
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-gray-200 bg-[#fbfcfa] px-4 py-3 outline-none transition focus:border-[#73977a] focus:ring-2 focus:ring-[#73977a]/20"
                  />
                </div>
              ))}
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your vehicle..."
                className="w-full rounded-xl border border-gray-200 bg-[#fbfcfa] px-4 py-3 outline-none focus:border-[#73977a]"
              />
            </div>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-[#26352b]">
              Vehicle Photos
            </h2>
            <p className="mb-4 text-sm text-gray-500">
              Upload 1–5 images. First image will be your cover photo.
              Maximum 5 MB per image.
            </p>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#a9bdaa] bg-[#f6faf5] p-8 text-center transition hover:bg-[#edf4ed]">
              <span className="mb-2 text-4xl">📸</span>
              <span className="font-semibold text-[#45684d]">
                Click to upload photos
              </span>
              <span className="mt-1 text-xs text-gray-400">
                JPG, PNG, WEBP
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                disabled={loading || images.length >= 5}
              />
            </label>

            {images.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {images.map((item, index) => (
                  <div
                    key={item.preview}
                    className="relative overflow-hidden rounded-2xl border border-gray-200"
                  >
                    <img
                      src={item.preview}
                      alt={`Vehicle ${index + 1}`}
                      className="h-36 w-full object-cover"
                    />

                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-[#55745f] px-3 py-1 text-xs font-semibold text-white">
                        Cover Photo
                      </span>
                    )}

                    <div className="flex items-center justify-between gap-2 p-2">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => setCoverImage(index)}
                          className="text-xs font-semibold text-[#55745f]"
                          disabled={loading}
                        >
                          Set Cover
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="ml-auto text-xs font-semibold text-red-500"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {message && (
            <p className="rounded-xl bg-[#f1f6ef] p-4 text-sm font-medium text-[#45684d]">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#55745f] py-4 font-bold text-white shadow-lg transition hover:bg-[#405c49] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Uploading & Listing..." : "List Vehicle"}
          </button>
        </form>
      </div>
    </main>
  );
}
