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
import { useFormikContext } from "formik";
import { AddEditRecipeFormFields } from "../../interfaces";
import { useI18n } from "@/i18n/useI18n";

export function BasicInfoSection() {
  const i18n = useI18n();

  const { values, handleChange, handleBlur, touched, errors } =
    useFormikContext<AddEditRecipeFormFields>();

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        {i18n.basicInformationHeader}
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="title"
            label={i18n.recipeTitleLabel}
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.title && Boolean(errors.title)}
            helperText={touched.title && errors.title}
            required
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="description"
            label={i18n.recipeDescriptionLabel}
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.description && Boolean(errors.description)}
            helperText={touched.description && errors.description}
            required
            fullWidth
            multiline
            rows={3}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <ImagesFieldArray />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            name="cookTime"
            label="Cook Time"
            value={values.cookTime}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.cookTime && Boolean(errors.cookTime)}
            helperText={touched.cookTime && errors.cookTime}
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
            value={values.servings}
            onChange={handleChange}
            onBlur={handleBlur}
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
              value={values.difficulty}
              label="Difficulty"
              onChange={handleChange}
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
