import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Recipe } from "@/data/recipes";
import { supabase } from "@/db/supabaseClient";
import { LIST_RECIPES_KEY } from "./useListRecipes";

const addRecipe = async (
  recipe: Omit<Recipe, "id">,
): Promise<Recipe | null> => {
  const { data, error } = await supabase
    .from("recipes")
    .insert([{ ...recipe, createdAt: new Date().toISOString() }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Usage:
 * const addRecipe = useAddRecipe();
 * await addRecipe(recipe);
 */
export function useAddRecipe() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Recipe, Error, Omit<Recipe, "id">>({
    mutationFn: addRecipe,
    onSuccess: (newRecipe) => {
      queryClient.setQueryData<Recipe[]>([LIST_RECIPES_KEY], (old = []) => [
        newRecipe,
        ...old,
      ]);
    },
  });

  return mutation.mutateAsync;
}
