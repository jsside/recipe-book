import { Paper, Typography } from "@mui/material";
import { IngredientGroupForm } from "../IngredientGroupForm";
import { IngredientsSectionProps } from "./interfaces";

export function IngredientsSection({ formik }: IngredientsSectionProps) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Ingredients
      </Typography>
      <IngredientGroupForm
        groups={formik.values.ingredientGroups}
        onChange={(ingredientGroups) =>
          formik.setFieldValue("ingredientGroups", ingredientGroups)
        }
      />
    </Paper>
  );
}
