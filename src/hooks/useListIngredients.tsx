import { InvalidateQueryFilters, useQuery } from "@tanstack/react-query";
import { supabase } from "@/db/supabaseClient";
import { singletonQueryClient } from "@/app/App.queries";
import { Ingredient } from "@/data/recipes";

export const LIST_INGREDIENTS_KEY = "list-ingredients";

//----------------------------------
// ALL INGREDIENTS
//----------------------------------

export const fetchIngredients = async () => {
  const { data, error } = await supabase
    .from("ingredients")
    .select("id, name, category, image_url")
    .order("name");

  if (error) throw error;

  return data ?? [];
};

export function invalidateListIngredients() {
  return singletonQueryClient.invalidateQueries([
    LIST_INGREDIENTS_KEY,
  ] as InvalidateQueryFilters<readonly unknown[]>);
}

export function useListIngredients() {
  return useQuery<Ingredient[], Error>({
    queryFn: fetchIngredients,
    queryKey: [LIST_INGREDIENTS_KEY],
  });
}
