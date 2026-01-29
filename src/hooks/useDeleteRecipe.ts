import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Recipe } from "@/data/recipes";
import { supabase } from "@/db/supabaseClient";
import { LIST_RECIPES_KEY } from "./useListRecipes";

const deleteRecipeFn = async (id: string): Promise<void> => {
  const { error } = await supabase.from("recipes").delete().eq("id", id);

  if (error) throw error;
};

/**
 * Usage:
 * const deleteRecipe = useDeleteRecipe();
 * await deleteRecipe(id);
 */
export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, string>({
    mutationFn: deleteRecipeFn,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Recipe[]>([LIST_RECIPES_KEY], (old = []) =>
        old.filter((r) => r.id !== deletedId),
      );
    },
  });

  return mutation.mutateAsync;
}
