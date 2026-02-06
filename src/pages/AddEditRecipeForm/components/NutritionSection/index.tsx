import { Paper, Typography, Grid, TextField } from "@mui/material";
import { useFormikContext } from "formik";
import { AddEditRecipeFormFields } from "../../interfaces";

export function NutritionSection() {
  const { values, setFieldValue } = useFormikContext<AddEditRecipeFormFields>();

  const handleNumberChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFieldValue(field, value ? Number(value) : "");
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
            value={values.calories}
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
            value={values.protein}
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
            value={values.carbs}
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
            value={values.fat}
            onChange={handleNumberChange("fat")}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
