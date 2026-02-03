import { Box } from "@mui/material";
import { ImageGalleryProps } from "./interfaces";
import { CloudinaryImage } from "@/components/custom/CloudinaryImage";

export function ImageGallery({ images }: ImageGalleryProps) {
  if (images.length === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        pb: 1,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {images?.map((image, index) => (
        <CloudinaryImage
          key={index}
          src={image}
          alt={`Recipe image ${index + 1}`}
          width={400}
          height={300}
          sx={{
            width: { xs: 280, sm: 320, md: 400 },
            height: { xs: 200, sm: 240, md: 300 },
            objectFit: "cover",
            borderRadius: 2,
            flexShrink: 0,
          }}
        />
      ))}
    </Box>
  );
}
