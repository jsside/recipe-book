import { cld } from "@/db/cloudinaryInstance";
import { fill } from "@cloudinary/url-gen/actions/resize";

/**
 * Check if a string is a valid URL (http/https)
 */
export function isValidUrl(str: string): boolean {
  if (!str || typeof str !== "string") return false;
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Check if a string is a Cloudinary public ID (not a full URL)
 */
export function isCloudinaryPublicId(str: string): boolean {
  if (!str || typeof str !== "string") return false;
  return !isValidUrl(str);
}

/**
 * Get image URL - either return the URL directly or generate Cloudinary URL from public ID
 */
export function getImageUrl(
  imageStr: string,
  options?: { width?: number; height?: number },
): string {
  if (!imageStr) return "";

  // If it's already a valid URL, return it
  if (isValidUrl(imageStr)) {
    return imageStr;
  }

  // Otherwise, treat it as a Cloudinary public ID
  const image = cld.image(imageStr);

  if (options?.width && options?.height) {
    image.resize(fill().width(options.width).height(options.height));
  } else if (options?.width) {
    image.resize(fill().width(options.width));
  } else if (options?.height) {
    image.resize(fill().height(options.height));
  }

  return image.toURL();
}

/**
 * Get a thumbnail URL for Cloudinary images
 */
export function getThumbnailUrl(imageStr: string, size = 64): string {
  return getImageUrl(imageStr, { width: size, height: size });
}
