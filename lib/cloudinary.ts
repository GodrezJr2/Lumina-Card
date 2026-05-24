/**
 * Cloudinary server-side client.
 * Used by /api/upload route to stream uploaded files to Cloudinary cloud.
 *
 * Env vars required:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

export { cloudinary };

/**
 * Upload a file Buffer to Cloudinary.
 * Returns secure HTTPS URL of uploaded image.
 */
export async function uploadBuffer(
  buffer: Buffer,
  folder = "lumina"
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        // Auto-optimize: quality auto, format auto (webp/avif if browser supports)
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (err, result) => {
        if (err) return reject(err);
        if (!result) return reject(new Error("No result from Cloudinary"));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}
