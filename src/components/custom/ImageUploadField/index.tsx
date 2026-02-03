import { useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import { ImageUploadFieldProps } from "./interfaces";
import { CLOUD_NAME } from "@/db/cloudinaryInstance";
import { isValidUrl } from "@/utils/cloudinaryHelpers";
import { CloudinaryImage } from "@/components/custom/CloudinaryImage";

const UPLOAD_PRESET = "shared_plates_unsigned";

export function ImageUploadField({
  value,
  onChange,
  label,
  placeholder = "Enter image URL or upload",
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(!value || isValidUrl(value));
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
      onChange(data.public_id);
      setShowUrlInput(false);
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setIsUploading(false);
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUrlChange = (newUrl: string) => {
    onChange(newUrl);
    setShowUrlInput(true);
  };

  const handleClear = () => {
    onChange("");
    setShowUrlInput(true);
  };

  // If we have a Cloudinary public ID, show the image with option to change
  if (value && !isValidUrl(value) && !showUrlInput) {
    return (
      <Box>
        {label && (
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {label}
          </Typography>
        )}
        <Stack direction="row" spacing={2} alignItems="center">
          <CloudinaryImage
            src={value}
            alt="Uploaded image"
            width={400}
            height={300}
            sx={{
              width: 120,
              height: 90,
              borderRadius: 1,
              objectFit: "cover",
            }}
          />
          <Stack spacing={1}>
            <Typography variant="caption" color="text.secondary">
              Uploaded to Cloudinary
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                startIcon={<LinkIcon />}
                onClick={() => setShowUrlInput(true)}
              >
                Use URL instead
              </Button>
              <IconButton size="small" color="error" onClick={handleClear}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    );
  }

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
          onChange={(e) => handleUrlChange(e.target.value)}
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
            isUploading ? (
              <CircularProgress size={16} />
            ) : (
              <UploadIcon />
            )
          }
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          sx={{ minWidth: 120 }}
        >
          {isUploading ? "Uploading" : "Upload"}
        </Button>
      </Stack>
      {value && isValidUrl(value) && (
        <Box
          component="img"
          src={value}
          alt="Preview"
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
