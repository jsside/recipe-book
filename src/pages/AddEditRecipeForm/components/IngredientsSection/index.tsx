import { Paper, Typography } from "@mui/material";
import { IngredientGroupForm } from "../IngredientGroupForm";
import { useFormikContext } from "formik";
import { AddEditRecipeFormFields } from "../../interfaces";

export function IngredientsSection() {
  const { values, setFieldValue } = useFormikContext<AddEditRecipeFormFields>();

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Ingredients
      </Typography>
      <IngredientGroupForm
        groups={values.ingredientGroups}
        onChange={(ingredientGroups) =>
          setFieldValue("ingredientGroups", ingredientGroups)
        }
      />
    </Paper>
  );
}
