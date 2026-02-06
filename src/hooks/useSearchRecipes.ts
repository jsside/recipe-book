import { InvalidateQueryFilters, useQuery } from "@tanstack/react-query";
import { supabase } from "@/db/supabaseClient";
import { singletonQueryClient } from "@/app/App.queries";
import { Recipe } from "@/data/recipes";

export const SEARCH_RECIPES_KEY = "search-recipes";

//----------------------------------
// RECIPES BY TITLE
//----------------------------------

export const searchRecipes = async (query: string) => {
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      id,
      title,
      images,
      chefs ( name, avatar )
    `,
    )
    .ilike("title", `%${query}%`);

  if (error) throw error;

  return data ?? [];
};

export function invalidateSearchRecipes(query: string) {
  return singletonQueryClient.invalidateQueries([
    `${SEARCH_RECIPES_KEY}-${query}`,
  ] as InvalidateQueryFilters<readonly unknown[]>);
}

export function useSearchRecipes(query: string) {
  return useQuery<Recipe[], Error>({
    queryKey: [SEARCH_RECIPES_KEY, query],
    queryFn: async () => {
      return searchRecipes(query);
    },
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60, // 1 minute
  });
}
