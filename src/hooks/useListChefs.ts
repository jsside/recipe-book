import { InvalidateQueryFilters, useQuery } from "@tanstack/react-query";
import { supabase } from "@/db/supabaseClient";
import { singletonQueryClient } from "@/app/App.queries";
import { Chef } from "@/data/recipes";

export const LIST_CHEFS_KEY = "list-chefs";

//----------------------------------
// ALL CHEFS
//----------------------------------

export const fetchChefs = async () => {
  const { data, error } = await supabase
    .from("chefs")
    .select("id, name, avatar")
    .order("name");

  if (error) throw error;

  return data ?? [];
};

export function invalidateListChefs() {
  return singletonQueryClient.invalidateQueries([
    LIST_CHEFS_KEY,
  ] as InvalidateQueryFilters<readonly unknown[]>);
}

export function useListChefs() {
  return useQuery<Chef[], Error>({
    queryFn: fetchChefs,
    queryKey: [LIST_CHEFS_KEY],
  });
}
