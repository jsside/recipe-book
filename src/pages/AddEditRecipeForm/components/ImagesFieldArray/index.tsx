import { FieldArray } from "formik";
import { Box, Stack, Typography, Button, IconButton } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { ImageUploadField } from "../ImageUploadField";
import RenderComponent from "@/components/helpers/renderComponent";
import { ImagesFieldArrayProps } from "./interfaces";

export function ImagesFieldArray({ formik }: ImagesFieldArrayProps) {
  return (
    <FieldArray name="images">
      {({ push, remove }) => (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Images
          </Typography>
          <Stack spacing={2}>
            {formik.values.images.map((image, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={1}
                alignItems="flex-start"
              >
                <Box sx={{ flex: 1 }}>
                  <ImageUploadField
                    value={image}
                    onChange={(value) =>
                      formik.setFieldValue(`images.${index}`, value)
                    }
                    label={index === 0 ? "Primary Image" : `Image ${index + 1}`}
                    placeholder="Enter image URL or upload"
                  />
                </Box>
                <RenderComponent
                  if={formik.values.images.length > 1}
                  then={
                    <IconButton
                      onClick={() => remove(index)}
                      size="small"
                      color="error"
                      sx={{ mt: 3.5 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                />
              </Stack>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => push("")}
              size="small"
              sx={{ alignSelf: "flex-start" }}
            >
              Add another image
            </Button>
          </Stack>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Add multiple images for a gallery view. First image is the primary.
          </Typography>
        </Box>
      )}
    </FieldArray>
  );
}
