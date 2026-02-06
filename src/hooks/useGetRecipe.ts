import { InvalidateQueryFilters, useQuery } from "@tanstack/react-query";
import { Recipe } from "@/data/recipes";
import { supabase } from "@/db/supabaseClient";
import { singletonQueryClient } from "@/app/App.queries";

export const GET_RECIPE_KEY = "get-recipe";

export const fetchRecipeById = async (
  recipeId: string,
): Promise<Recipe | null> => {
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      *,
      chefs (
        name,
        avatar
      )
    `,
    )
    .eq("id", recipeId)
    .single();

  if (error) throw error;

  if (!data) return null;

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
    chef: {
      name: data.chefs.name,
      avatar: data.chefs.avatar,
    },
  };
};

export function invalidateGetRecipe() {
  return singletonQueryClient.invalidateQueries([
    GET_RECIPE_KEY,
  ] as InvalidateQueryFilters<readonly unknown[]>);
}

export function useGetRecipe(recipeId: string) {
  return useQuery<Recipe, Error>({
    queryKey: [GET_RECIPE_KEY, recipeId],
    queryFn: async () => {
      return fetchRecipeById(recipeId);
    },
    enabled: !!recipeId,
  });
}
