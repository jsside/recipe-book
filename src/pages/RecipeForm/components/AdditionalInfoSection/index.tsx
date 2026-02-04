import { Paper, Typography, Grid, TextField } from "@mui/material";
import { AdditionalInfoSectionProps } from "./interfaces";

export function AdditionalInfoSection({ formik }: AdditionalInfoSectionProps) {
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
            value={formik.values.videoUrl}
            onChange={formik.handleChange}
            fullWidth
            placeholder="https://youtube.com/..."
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
