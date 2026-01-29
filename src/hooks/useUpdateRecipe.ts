import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Recipe } from "@/data/recipes";
import { supabase } from "@/db/supabaseClient";
import { LIST_RECIPES_KEY } from "./useListRecipes";

const updateRecipeFn = async ({
  id,
  updates,
}: {
  id: string;
  updates: Partial<Recipe>;
}): Promise<Recipe> => {
  const { data, error } = await supabase
    .from("recipes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
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
    { id: string; updates: Partial<Recipe> }
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
