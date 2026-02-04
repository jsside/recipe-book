import {
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { difficultyOptions } from "@/data/recipes";
import { ImagesFieldArray } from "../ImagesFieldArray";
import { BasicInfoSectionProps } from "./interfaces";

export function BasicInfoSection({ formik }: BasicInfoSectionProps) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Basic Information
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="title"
            label="Recipe Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            required
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="description"
            label="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            required
            fullWidth
            multiline
            rows={3}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <ImagesFieldArray formik={formik} />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="cookTime"
            label="Cook Time"
            value={formik.values.cookTime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.cookTime && Boolean(formik.errors.cookTime)}
            helperText={formik.touched.cookTime && formik.errors.cookTime}
            required
            fullWidth
            placeholder="e.g., 30 mins"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="servings"
            label="Servings"
            type="number"
            value={formik.values.servings}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            fullWidth
            inputProps={{ min: 1 }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Difficulty</InputLabel>
            <Select
              name="difficulty"
              value={formik.values.difficulty}
              label="Difficulty"
              onChange={formik.handleChange}
            >
              {difficultyOptions.map((opt) => (
                <MenuItem
                  key={opt}
                  value={opt}
                  sx={{ textTransform: "capitalize" }}
                >
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
}
