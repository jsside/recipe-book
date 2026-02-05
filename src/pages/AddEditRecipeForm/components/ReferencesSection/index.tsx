import { FieldArray } from "formik";
import {
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { createEmptyReference } from "../../constants";
import { ReferencesSectionProps } from "./interfaces";

export function ReferencesSection({ formik }: ReferencesSectionProps) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        References
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add links or images as references for this recipe.
      </Typography>

      <FieldArray name="references">
        {({ push, remove }) => (
          <Stack spacing={2}>
            {formik.values.references.map((ref, index) => (
              <Stack
                key={ref.tempId}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <TextField
                  name={`references.${index}.url`}
                  label={ref.type === "link" ? "Link URL" : "Image URL"}
                  value={ref.url}
                  onChange={formik.handleChange}
                  fullWidth
                  size="small"
                  placeholder={
                    ref.type === "link"
                      ? "https://example.com"
                      : "https://example.com/image.jpg"
                  }
                />
                <TextField
                  name={`references.${index}.title`}
                  label="Title (optional)"
                  value={ref.title}
                  onChange={formik.handleChange}
                  size="small"
                  sx={{ minWidth: 150 }}
                />
                <IconButton
                  onClick={() => remove(index)}
                  size="small"
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}

            <Stack direction="row" spacing={1}>
              <Button
                startIcon={<AddIcon />}
                onClick={() => push(createEmptyReference("link"))}
                size="small"
                variant="outlined"
              >
                Add link reference
              </Button>
              <Button
                startIcon={<AddIcon />}
                onClick={() => push(createEmptyReference("image"))}
                size="small"
                variant="outlined"
              >
                Add image reference
              </Button>
            </Stack>
          </Stack>
        )}
      </FieldArray>
    </Paper>
  );
}
