import { Paper, Typography, Grid, TextField } from "@mui/material";
import { useFormikContext } from "formik";
import { AddEditRecipeFormFields } from "../../interfaces";

export function AdditionalInfoSection() {
  const { values, handleChange } = useFormikContext<AddEditRecipeFormFields>();

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Additional Information
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="videoUrl"
            label="Video URL (optional)"
            variant="standard"
            value={values.videoUrl}
            onChange={handleChange}
            fullWidth
            placeholder="https://youtube.com/..."
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
