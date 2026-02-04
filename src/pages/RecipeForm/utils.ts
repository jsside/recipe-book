import { Recipe, RecipeReference } from "@/data/recipes";
import { RecipeFormValues } from "./interfaces";

interface User {
  name: string;
  avatar?: string;
}

export function transformFormToRecipe(
  values: RecipeFormValues,
  user: User
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
      avatar: user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
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
    references: formattedReferences.length > 0 ? formattedReferences : undefined,
  };
}

export function validateFormData(values: RecipeFormValues): string | null {
  if (!values.title.trim() || !values.description.trim() || !values.cookTime.trim()) {
    return "Please fill in all required fields";
  }

  const hasValidIngredient = values.ingredientGroups.some((group) =>
    group.items.some((item) => item.name.trim() && item.amount.trim())
  );
  if (!hasValidIngredient) {
    return "Please add at least one ingredient";
  }

  const hasValidInstruction = values.instructionGroups.some((group) =>
    group.steps.some((step) => step.text.trim())
  );
  if (!hasValidInstruction) {
    return "Please add at least one instruction";
  }

  return null;
}
