import { Dialog, Box, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { LightboxProps } from "./interfaces";

export function Lightbox({ open, onClose, imageSrc, title }: LightboxProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "transparent",
          boxShadow: "none",
          overflow: "visible",
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: -48,
          right: 0,
          color: "white",
          bgcolor: "rgba(0,0,0,0.5)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box
        component="img"
        src={imageSrc}
        alt={title || "Reference image"}
        sx={{
          width: "100%",
          maxHeight: "80vh",
          objectFit: "contain",
          borderRadius: 2,
        }}
      />
    </Dialog>
  );
}
