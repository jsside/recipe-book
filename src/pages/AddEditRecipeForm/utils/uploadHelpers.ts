import { CLOUD_NAME } from "@/db/cloudinaryInstance";

export const UPLOAD_PRESET = "shared_plates_unsigned";

/**
 * Check if a string is a data URL (local file not yet uploaded)
 */
export function isDataUrl(str: string): boolean {
  return str?.startsWith("data:");
}

/**
 * Upload a single image to Cloudinary
 */
export async function uploadToCloudinary(dataUrl: string): Promise<string> {
  // Convert data URL to blob
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  const formData = new FormData();
  formData.append("file", blob);
  formData.append("upload_preset", UPLOAD_PRESET);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image");
  }

  const data = await uploadResponse.json();
  return data.secure_url;
}

/**
 * Process all images - upload local files, keep existing URLs
 */
export async function processImages(images: string[]): Promise<string[]> {
  const processedImages = await Promise.all(
    images.map(async (image) => {
      if (!image.trim()) return "";
      if (isDataUrl(image)) {
        return uploadToCloudinary(image);
      }
      return image;
    }),
  );

  return processedImages.filter((img) => img.trim());
}
