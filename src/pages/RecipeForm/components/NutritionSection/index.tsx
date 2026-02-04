import { Paper, Typography, Grid, TextField } from "@mui/material";
import { NutritionSectionProps } from "./interfaces";

export function NutritionSection({ formik }: NutritionSectionProps) {
  const handleNumberChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      formik.setFieldValue(field, value ? Number(value) : "");
    };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Nutrition (per serving, optional)
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            name="calories"
            label="Calories"
            type="number"
            value={formik.values.calories}
            onChange={handleNumberChange("calories")}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            name="protein"
            label="Protein (g)"
            type="number"
            value={formik.values.protein}
            onChange={handleNumberChange("protein")}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            name="carbs"
            label="Carbs (g)"
            type="number"
            value={formik.values.carbs}
            onChange={handleNumberChange("carbs")}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            name="fat"
            label="Fat (g)"
            type="number"
            value={formik.values.fat}
            onChange={handleNumberChange("fat")}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
