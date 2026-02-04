import { useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { CloudUpload as UploadIcon } from "@mui/icons-material";
import { ImageUploadFieldProps } from "./interfaces";
import { CLOUD_NAME } from "@/db/cloudinaryInstance";

export const UPLOAD_PRESET = "shared_plates_unsigned";

export function ImageUploadField({
  value,
  onChange,
  label,
  placeholder = "Enter image URL or upload",
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      // Save the full secure URL, not just public_id
      onChange(data.secure_url);
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          fullWidth
          size="small"
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <Button
          variant="outlined"
          startIcon={
            isUploading ? <CircularProgress size={16} /> : <UploadIcon />
          }
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          sx={{ minWidth: 120 }}
        >
          {isUploading ? "Uploading" : "Upload"}
        </Button>
      </Stack>
      {value && (
        <Box
          component="img"
          src={value}
          alt="Preview"
          onError={(e) => {
            // Hide broken images
            (e.target as HTMLImageElement).style.display = "none";
          }}
          sx={{
            mt: 1,
            width: 120,
            height: 90,
            objectFit: "cover",
            borderRadius: 1,
          }}
        />
      )}
    </Box>
  );
}
