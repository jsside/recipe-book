import { Paper, Typography, Stack } from "@mui/material";
import { dietaryOptions } from "@/data/recipes";
import { CategoryChipsSelect } from "../CategoryChipsSelect";
import { CATEGORY_OPTIONS } from "../../constants";
import { useFormikContext } from "formik";
import { AddEditRecipeFormFields } from "../../interfaces";

export function CategoriesSection() {
  const { values, setFieldValue } = useFormikContext<AddEditRecipeFormFields>();

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Categories & Tags
      </Typography>
      <Stack spacing={3}>
        <CategoryChipsSelect
          options={CATEGORY_OPTIONS}
          selected={values.categories}
          onChange={(categories) => setFieldValue("categories", categories)}
          label="Categories"
        />
        <CategoryChipsSelect
          options={dietaryOptions}
          selected={values.dietaryTags}
          onChange={(dietaryTags) => setFieldValue("dietaryTags", dietaryTags)}
          label="Dietary Tags"
        />
      </Stack>
    </Paper>
  );
}
