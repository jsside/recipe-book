import { useRef, useState, useEffect } from "react";
import { Box, TextField, Button, Stack, Typography } from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { ImageUploadFieldProps } from "./interfaces";

export function ImageUploadField({
  value,
  onChange,
  label,
  placeholder = "Enter image URL or upload",
}: ImageUploadFieldProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear local preview when value changes externally
  useEffect(() => {
    if (!value) {
      setLocalPreview(null);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local preview URL
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);

    // Store the file reference as a data URL for later upload
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setLocalPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayImage = localPreview || value;
  const isLocalFile = value?.startsWith("data:");

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          value={isLocalFile ? "(Local file selected)" : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          fullWidth
          size="small"
          disabled={isLocalFile}
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
          startIcon={<UploadIcon />}
          onClick={() => fileInputRef.current?.click()}
          sx={{ minWidth: 120 }}
        >
          Upload
        </Button>
      </Stack>
      {displayImage && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-start"
          sx={{ mt: 1 }}
        >
          <Box
            component="img"
            src={displayImage}
            alt="Preview"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
            sx={{
              width: 120,
              height: 90,
              objectFit: "cover",
              borderRadius: 1,
            }}
          />
          <Button
            size="small"
            color="error"
            startIcon={<ClearIcon />}
            onClick={handleClear}
          >
            Clear
          </Button>
        </Stack>
      )}
    </Box>
  );
}
