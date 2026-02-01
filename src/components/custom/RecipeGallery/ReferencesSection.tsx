import { useState } from "react";
import { Box, Typography, Link, Stack } from "@mui/material";
import { Link as LinkIcon } from "@mui/icons-material";
import { ReferencesSectionProps } from "./interfaces";
import { Lightbox } from "./Lightbox";

export function ReferencesSection({ links, images }: ReferencesSectionProps) {
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    title?: string;
  } | null>(null);

  if (links.length === 0 && images.length === 0) return null;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        References
      </Typography>

      {/* Link References */}
      {links.length > 0 && (
        <Stack spacing={1} sx={{ mb: images.length > 0 ? 2 : 0 }}>
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "text.secondary",
                textDecoration: "none",
                "&:hover": { color: "primary.main" },
              }}
            >
              <LinkIcon fontSize="small" />
              <Typography variant="body2">{link.title || link.url}</Typography>
            </Link>
          ))}
        </Stack>
      )}

      {/* Image References as Thumbnails */}
      {images.length > 0 && (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {images.map((image, index) => (
            <Box
              key={index}
              component="img"
              src={image.url}
              alt={image.title || `Reference ${index + 1}`}
              onClick={() => setLightboxImage(image)}
              sx={{
                width: 64,
                height: 64,
                objectFit: "cover",
                borderRadius: 1,
                cursor: "pointer",
                transition: "opacity 0.2s",
                "&:hover": { opacity: 0.8 },
              }}
            />
          ))}
        </Box>
      )}

      {/* Lightbox */}
      <Lightbox
        open={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        imageSrc={lightboxImage?.url || ""}
        title={lightboxImage?.title}
      />
    </Box>
  );
}
