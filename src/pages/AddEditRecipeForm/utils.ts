import { Recipe, RecipeReference } from "@/data/recipes";
import { AddEditRecipeFormFields } from "./interfaces";
import { initialValues } from "./constants";

interface User {
  name: string;
  avatar?: string;
}

export function transformFormToRecipe(
  values: AddEditRecipeFormFields,
  user: User,
): Omit<Recipe, "id"> {
  const formattedIngredientGroups = values.ingredientGroups
    .map((group) => ({
      heading: group.heading || undefined,
      items: group.items
        .filter((item) => item.name.trim())
        .map((item) => ({
          id: crypto.randomUUID(),
          name: item.name.trim(),
          amount: item.amount.trim(),
          unit: item.unit.trim(),
          preparation: item.preparation?.trim() || undefined,
          note: item.note?.trim() || undefined,
        })),
    }))
    .filter((group) => group.items.length > 0);

  const formattedInstructionGroups = values.instructionGroups
    .map((group) => ({
      heading: group.heading || undefined,
      steps: group.steps
        .filter((step) => step.text.trim())
        .map((step) => ({
          text: step.text.trim(),
          timer: step.timer || undefined,
        })),
    }))
    .filter((group) => group.steps.length > 0);

  const validImages = values.images.filter((img) => img.trim());

  const formattedReferences: RecipeReference[] = values.references
    .filter((ref) => ref.url.trim())
    .map((ref) => ({
      type: ref.type,
      url: ref.url.trim(),
      title: ref.title?.trim() || undefined,
    }));

  return {
    title: values.title.trim(),
    description: values.description.trim(),
    images: validImages.length > 0 ? validImages : undefined,
    cookTime: values.cookTime.trim(),
    servings: values.servings,
    difficulty: values.difficulty,
    category: values.categories.length > 0 ? values.categories : ["Dinner"],
    dietaryTags: values.dietaryTags,
    videoUrl: values.videoUrl?.trim() || undefined,
    chef: {
      name: user.name,
      avatar:
        user.avatar ||
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    },
    ingredientGroups: formattedIngredientGroups,
    instructionGroups: formattedInstructionGroups,
    nutrition:
      values.calories || values.protein || values.carbs || values.fat
        ? {
            calories: values.calories || undefined,
            protein: values.protein || undefined,
            carbs: values.carbs || undefined,
            fat: values.fat || undefined,
          }
        : undefined,
    references:
      formattedReferences.length > 0 ? formattedReferences : undefined,
  };
}

export function validateFormData(
  values: AddEditRecipeFormFields,
): string | null {
  if (
    !values.title.trim() ||
    !values.description.trim() ||
    !values.cookTime.trim()
  ) {
    return "Please fill in all required fields";
  }

  const hasValidIngredient = values.ingredientGroups.some((group) =>
    group.items.some((item) => item.name.trim() && item.amount.trim()),
  );
  if (!hasValidIngredient) {
    return "Please add at least one ingredient";
  }

  const hasValidInstruction = values.instructionGroups.some((group) =>
    group.steps.some((step) => step.text.trim()),
  );
  if (!hasValidInstruction) {
    return "Please add at least one instruction";
  }

  return null;
}

export const getFormInitialValues = (
  existingRecipe: Recipe,
): AddEditRecipeFormFields => {
  if (!existingRecipe) return initialValues;

  return {
    ...initialValues,
    title: existingRecipe.title,
    description: existingRecipe.description,
    images: existingRecipe.images?.length ? existingRecipe.images : [""],
    cookTime: existingRecipe.cookTime,
    servings: existingRecipe.servings,
    difficulty: existingRecipe.difficulty,
    categories: existingRecipe.category,
    dietaryTags: existingRecipe.dietaryTags,
    videoUrl: existingRecipe.videoUrl ?? undefined,
    calories: existingRecipe.nutrition?.calories ?? undefined,
    protein: existingRecipe.nutrition?.protein ?? undefined,
    carbs: existingRecipe.nutrition?.carbs ?? undefined,
    fat: existingRecipe.nutrition?.fat,
    ingredientGroups: existingRecipe.ingredientGroups?.map((g) => ({
      tempId: crypto.randomUUID(),
      heading: g.heading,
      items: g.items.map((item) => ({
        tempId: crypto.randomUUID(),
        name: item.name,
        amount: item.amount,
        unit: item.unit,
        preparation: item.preparation,
        note: item.note,
      })),
    })),
    instructionGroups: existingRecipe.instructionGroups?.map((g) => ({
      tempId: crypto.randomUUID(),
      heading: g.heading,
      steps: g.steps.map((step) => ({
        tempId: crypto.randomUUID(),
        text: step.text,
        timer: step.timer,
      })),
    })),
    references:
      existingRecipe.references?.map((ref) => ({
        tempId: crypto.randomUUID(),
        type: ref.type,
        url: ref.url,
        title: ref.title,
      })) || [],
  };
};
