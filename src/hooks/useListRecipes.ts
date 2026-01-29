import { useQuery } from "@tanstack/react-query";
import { Recipe } from "@/data/recipes";
import { supabase } from "@/db/supabaseClient";
import { singletonQueryClient } from "@/app/App.queries";

export const LIST_RECIPES_KEY = "list-recipes";

const fetchRecipes = async (): Promise<Recipe[]> => {
  const { data, error } = await supabase.from("recipes").select("*");
  // .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
};

// export function invalidateListRecipes () {
//     return singletonQueryClient.invalidateQueries([LIST_RECIPES_KEY]);
// }

export function useListRecipes() {
  return useQuery<Recipe[], Error>({
    queryFn: fetchRecipes,
    queryKey: [LIST_RECIPES_KEY],
  });
}
