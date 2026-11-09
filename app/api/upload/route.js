
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import { Readable } from "stream";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(file) {
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "rideglow/vehicles",
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function POST(request) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Please login first" },
        { status: 401 }
      );
    }

    let decoded;

    try {
      decoded = jwt.verify(
        authHeader.split(" ")[1],
        process.env.JWT_SECRET
      );
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid user token" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);

    if (!user || user.isBlocked) {
      return NextResponse.json(
        { message: "Your account is blocked or unavailable" },
        { status: 403 }
      );
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { message: "Cloudinary configuration is missing" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("images");

    if (!files.length || files.length > 5) {
      return NextResponse.json(
        { message: "Upload between 1 and 5 images" },
        { status: 400 }
      );
    }

    for (const file of files) {
      if (
        typeof file === "string" ||
        !file.type.startsWith("image/") ||
        file.size > 5 * 1024 * 1024
      ) {
        return NextResponse.json(
          { message: "Only images up to 5 MB are allowed" },
          { status: 400 }
        );
      }
    }

    const results = await Promise.all(
      files.map((file) => uploadToCloudinary(file))
    );

    return NextResponse.json({
      success: true,
      message: "Images uploaded successfully",
      images: results.map((result) => result.secure_url),
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return NextResponse.json(
      { message: "Image upload failed" },
      { status: 500 }
    );
  }
}
