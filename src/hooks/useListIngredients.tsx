import { InvalidateQueryFilters, useQuery } from "@tanstack/react-query";
import { supabase } from "@/db/supabaseClient";
import { singletonQueryClient } from "@/app/App.queries";
import { toSentenceCase } from "@/utils/stringHelpers";

export const LIST_INGREDIENTS_KEY = "list-ingredients";

//----------------------------------
// Ingredient type for the ingredients table
//----------------------------------

export interface IngredientRecord {
  id: number;
  name: string;
  category?: string;
  imageUrl?: string;
  createdAt?: string;
}

//----------------------------------
// ALL INGREDIENTS
//----------------------------------

export const fetchIngredients = async (): Promise<IngredientRecord[]> => {
  const { data, error } = await supabase
    .from("ingredients")
    .select("id, name, category, image_url, created_at")
    .order("name");

  if (error) throw error;

  return (
    data?.map((i) => ({
      id: i.id,
      name: toSentenceCase(i.name),
      category: i.category ?? undefined,
      imageUrl: i.image_url ?? undefined,
      createdAt: i.created_at,
    })) ?? []
  );
};

export function invalidateListIngredients() {
  return singletonQueryClient.invalidateQueries([
    LIST_INGREDIENTS_KEY,
  ] as InvalidateQueryFilters<readonly unknown[]>);
}

export function useListIngredients() {
  return useQuery<IngredientRecord[], Error>({
    queryFn: fetchIngredients,
    queryKey: [LIST_INGREDIENTS_KEY],
  });
}
