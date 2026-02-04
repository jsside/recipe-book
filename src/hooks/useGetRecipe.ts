import { InvalidateQueryFilters, useQuery } from "@tanstack/react-query";
import { Recipe } from "@/data/recipes";
import { supabase } from "@/db/supabaseClient";
import { singletonQueryClient } from "@/app/App.queries";
import { getRecipeCategories } from "@/utils/recipeHelpers";

export const GET_RECIPE_KEY = "get-recipe";

const fetchRecipeById = async (recipeId: string): Promise<Recipe> => {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", recipeId) // Matches the column 'id' with your variable
    .single(); // Returns a single object instead of an array

  if (error) {
    console.error("Error fetching recipe:", error.message);
    return null;
  }

  return data;
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
