import { Paper, Typography, Stack } from "@mui/material";
import { dietaryOptions } from "@/data/recipes";
import { CategoryChipsSelect } from "@/components/custom/CategoryChipsSelect";
import { CATEGORY_OPTIONS } from "../../constants";
import { CategoriesSectionProps } from "./interfaces";

export function CategoriesSection({ formik }: CategoriesSectionProps) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Categories & Tags
      </Typography>
      <Stack spacing={3}>
        <CategoryChipsSelect
          options={CATEGORY_OPTIONS}
          selected={formik.values.categories}
          onChange={(categories) =>
            formik.setFieldValue("categories", categories)
          }
          label="Categories"
        />
        <CategoryChipsSelect
          options={dietaryOptions}
          selected={formik.values.dietaryTags}
          onChange={(dietaryTags) =>
            formik.setFieldValue("dietaryTags", dietaryTags)
          }
          label="Dietary Tags"
        />
      </Stack>
    </Paper>
  );
}
