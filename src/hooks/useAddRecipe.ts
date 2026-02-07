import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IngredientGroup, Recipe } from "@/data/recipes";
import { supabase } from "@/db/supabaseClient";
import { LIST_RECIPES_KEY } from "./useListRecipes";

interface AddRecipeInput {
  title: string;
  description: string;
  cookTime: string;
  servings: number;
  chefId: number;
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
  ingredientGroups: unknown;
  instructionGroups: unknown;
  references?: unknown;
}
const addRecipeFn = async (recipe: AddRecipeInput): Promise<Recipe | null> => {
  /* -----------------------------
   * 1. Insert the new recipe
   * ----------------------------- */
  const { data, error } = await supabase
    .from("recipes")
    .insert([
      {
        title: recipe.title,
        description: recipe.description,
        cook_time: recipe.cookTime,
        servings: recipe.servings,
        chef_id: recipe.chefId,
        images: recipe.images ?? [],
        category: recipe.category ?? [],
        dietary_tags: recipe.dietaryTags ?? [],
        difficulty: recipe.difficulty,
        video_url: recipe.videoUrl,
        nutrition: recipe.nutrition,
        ingredient_groups: recipe.ingredientGroups,
        instruction_groups: recipe.instructionGroups,
        references: recipe.references,
      },
    ])
    .select(`*, chefs ( id, name, avatar )`)
    .single();

  if (error) throw error;
  const newRecipeId = data.id;

  /* ---------------------------------------
   * 2. Handle Ingredients & Linking
   * --------------------------------------- */
  if (recipe.ingredientGroups) {
    // Extract unique, clean names
    const ingredientNames = (recipe.ingredientGroups as IngredientGroup[])
      .flatMap((g) => g.items)
      .map((i) => i.name.trim().toLowerCase())
      .filter(Boolean);

    const ingredientsSet = Array.from(new Set(ingredientNames));

    if (ingredientsSet.length > 0) {
      // 2a. Ensure all ingredients exist in the 'ingredients' table
      // We use ignoreDuplicates so we don't error on existing ingredients
      await supabase.from("ingredients").upsert(
        ingredientsSet.map((name) => ({ name })),
        { onConflict: "name", ignoreDuplicates: true },
      );

      // 2b. Get the IDs for all ingredients in this recipe
      const { data: ingredientRows, error: fetchError } = await supabase
        .from("ingredients")
        .select("id")
        .in("name", ingredientsSet);

      if (fetchError) throw fetchError;

      // 2c. Create the links in the junction table
      const links = ingredientRows.map((row) => ({
        recipe_id: newRecipeId,
        ingredient_id: row.id,
      }));

      const { error: linkError } = await supabase
        .from("recipe_ingredients")
        .insert(links); // Use simple insert since this recipe is brand new

      if (linkError) throw linkError;
    }
  }

  /* -----------------------------
   * 3. Return formatted Recipe
   * ----------------------------- */
  return {
    id: data.id,
    title: data.title,
    images: data.images ?? [],
    cookTime: data.cook_time,
    servings: data.servings,
    difficulty: data.difficulty,
    description: data.description,
    category: data.category ?? [],
    dietaryTags: data.dietary_tags ?? [],
    videoUrl: data.video_url ?? undefined,
    nutrition: data.nutrition ?? undefined,
    ingredientGroups: data.ingredient_groups,
    instructionGroups: data.instruction_groups,
    references: data.references ?? [],
    createdAt: data.created_at,
    chefId: data.chef_id,
    chef: data.chefs
      ? {
          name: data.chefs.name,
          avatar: data.chefs.avatar,
        }
      : undefined,
  };
};

/**
 * Usage:
 * const addRecipe = useAddRecipe();
 * await addRecipe(recipe);
 */
export function useAddRecipe() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Recipe | null, Error, AddRecipeInput>({
    mutationFn: addRecipeFn,
    onSuccess: (newRecipe) => {
      if (newRecipe) {
        queryClient.setQueryData<Recipe[]>([LIST_RECIPES_KEY], (old = []) => [
          newRecipe,
          ...old,
        ]);
      }
    },
  });

  return mutation.mutateAsync;
}
