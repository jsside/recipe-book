import { Box, BoxProps } from "@mui/material";
import { AdvancedImage } from "@cloudinary/react";
import { cld } from "@/db/cloudinaryInstance";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { isValidUrl } from "@/utils/cloudinaryHelpers";

interface CloudinaryImageProps extends Omit<BoxProps, "component"> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/**
 * Smart image component that displays either a regular image URL
 * or a Cloudinary image from a public ID
 */
export function CloudinaryImage({
  src,
  alt,
  width,
  height,
  sx,
  ...boxProps
}: CloudinaryImageProps) {
  // If it's a valid URL, render a regular img
  if (isValidUrl(src)) {
    return <Box component="img" src={src} alt={alt} sx={sx} {...boxProps} />;
  }

  // Otherwise, it's a Cloudinary public ID
  const image = cld.image(src);

  if (width && height) {
    image.resize(fill().width(width).height(height));
  } else if (width) {
    image.resize(fill().width(width));
  } else if (height) {
    image.resize(fill().height(height));
  }

  return (
    <Box sx={sx} {...boxProps}>
      <AdvancedImage
        cldImg={image}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </Box>
  );
}
