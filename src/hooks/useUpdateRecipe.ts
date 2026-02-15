import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IngredientGroup, Recipe } from "@/data/recipes";
import { supabase } from "@/db/supabaseClient";
import { LIST_RECIPES_KEY } from "./useListRecipes";

interface UpdateRecipeInput {
  title?: string;
  description?: string;
  cookTime?: string;
  servings?: number;
  chefId?: string;
  images?: string[];
  category?: string[];
  dietaryTags?: string[];
  difficulty?: string;
  videoUrl?: string;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  ingredientGroups?: unknown;
  instructionGroups?: unknown;
  references?: unknown;
}

const updateRecipeFn = async ({
  id,
  updates,
}: {
  id: number;
  updates: UpdateRecipeInput;
}): Promise<Recipe> => {
  /* -----------------------------
   * 1. Update recipe base fields
   * ----------------------------- */
  const dbUpdates: Record<string, unknown> = {};

  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined)
    dbUpdates.description = updates.description;
  if (updates.cookTime !== undefined) dbUpdates.cook_time = updates.cookTime;
  if (updates.servings !== undefined) dbUpdates.servings = updates.servings;
  if (updates.chefId !== undefined) dbUpdates.chef_id = updates.chefId;
  if (updates.images !== undefined) dbUpdates.images = updates.images;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.dietaryTags !== undefined)
    dbUpdates.dietary_tags = updates.dietaryTags;
  if (updates.difficulty !== undefined)
    dbUpdates.difficulty = updates.difficulty;
  if (updates.videoUrl !== undefined)
    dbUpdates.video_url = updates.videoUrl ?? null;
  if (updates.nutrition !== undefined)
    dbUpdates.nutrition = updates.nutrition ?? null;
  if (updates.instructionGroups !== undefined)
    dbUpdates.instruction_groups = updates.instructionGroups;
  if (updates.references !== undefined)
    dbUpdates.references = updates.references;

  if (updates.ingredientGroups !== undefined)
    dbUpdates.ingredient_groups = updates.ingredientGroups;

  const { data: recipeData, error: recipeError } = await supabase
    .from("recipes")
    .update(dbUpdates)
    .eq("id", id)
    .select(
      `
        *,
        chefs ( id, name, avatar )
      `,
    )
    .single();

  if (recipeError) throw recipeError;

  /* ---------------------------------------
   * 2. Ingredient dictionary + linking
   * --------------------------------------- */
  if (updates.ingredientGroups) {
    const ingredientNames = (updates.ingredientGroups as IngredientGroup[])
      .flatMap((g) => g.items)
      .map((i) => i.name.trim().toLowerCase())
      .filter(Boolean);

    const ingredientsSet = Array.from(new Set(ingredientNames));

    if (ingredientsSet.length > 0) {
      // 2a. Ensure all ingredients exist in the 'ingredients' table
      // We don't rely on the return value of upsert here because of the 'ignore' behavior
      await supabase.from("ingredients").upsert(
        ingredientsSet.map((name) => ({ name })),
        { onConflict: "name", ignoreDuplicates: true },
      );

      // 2b. FETCH the IDs for ALL ingredients in our set (new and old)
      const { data: allIngredientRows, error: fetchError } = await supabase
        .from("ingredients")
        .select("id")
        .in("name", ingredientsSet);

      if (fetchError) throw fetchError;

      const targetIngredientIds = allIngredientRows.map((row) => row.id);

      /* ---------------------------------------
       * 3. Sync the Linking Table
       * --------------------------------------- */

      // Delete links that are NOT in our target list
      const { error: deleteError } = await supabase
        .from("recipe_ingredients")
        .delete()
        .eq("recipe_id", id)
        .not("ingredient_id", "in", `(${targetIngredientIds.join(",")})`);

      if (deleteError) throw deleteError;

      // Insert only the links that don't exist yet
      const { error: linkError } = await supabase
        .from("recipe_ingredients")
        .upsert(
          targetIngredientIds.map((ingId) => ({
            recipe_id: id,
            ingredient_id: ingId,
          })),
          { onConflict: "recipe_id,ingredient_id", ignoreDuplicates: true },
        );

      if (linkError) throw linkError;
    }
  }

  return recipeData as Recipe;
};

/**
 * Usage:
 * const updateRecipe = useUpdateRecipe();
 * await updateRecipe({ id, updates });
 */
export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    Recipe,
    Error,
    { id: number; updates: UpdateRecipeInput }
  >({
    mutationFn: updateRecipeFn,
    onSuccess: (updatedRecipe) => {
      queryClient.setQueryData<Recipe[]>([LIST_RECIPES_KEY], (old = []) =>
        old.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)),
      );
    },
  });

  return mutation.mutateAsync;
}
