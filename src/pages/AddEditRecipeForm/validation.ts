import * as Yup from "yup";

export const recipeFormSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required("Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: Yup.string()
    .trim()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  cookTime: Yup.string()
    .trim()
    .required("Cook time is required")
    .max(50, "Cook time must be less than 50 characters"),
  servings: Yup.number()
    .required("Servings is required")
    .min(1, "Servings must be at least 1")
    .max(100, "Servings must be less than 100"),
  difficulty: Yup.string().oneOf(["easy", "medium", "hard"]).required(),
  videoUrl: Yup.string().nullable().url("Must be a valid URL").optional(), // TODO: where is it set to null
  calories: Yup.number().min(0).optional(),
  protein: Yup.number().min(0).optional(),
  carbs: Yup.number().min(0).optional(),
  fat: Yup.number().min(0).optional(),
});
