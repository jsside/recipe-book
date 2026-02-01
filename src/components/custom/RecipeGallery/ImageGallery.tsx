import { Box } from "@mui/material";
import HorizontalScroll from "@/components/custom/HorizontalScroll";
import { ImageGalleryProps } from "./interfaces";

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
      {images.map((image, index) => (
        <Box
          key={index}
          component="img"
          src={image}
          alt={`Recipe image ${index + 1}`}
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
