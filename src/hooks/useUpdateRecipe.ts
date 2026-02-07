import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Recipe } from "@/data/recipes";
import { supabase } from "@/db/supabaseClient";
import { LIST_RECIPES_KEY } from "./useListRecipes";

interface UpdateRecipeInput {
  title?: string;
  description?: string;
  cookTime?: string;
  servings?: number;
  chefId?: number;
  images?: string[];
  category?: string[];
  dietaryTags?: string[];
  difficulty?: string;
  videoUrl?: string;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  ingredientGroups?: unknown;
  instructionGroups?: unknown;
  references?: unknown;
}

const updateRecipeFn = async ({
  id,
  updates,
}: {
  id: number;
  updates: UpdateRecipeInput;
}): Promise<Recipe> => {
  // Transform camelCase to snake_case for DB
  const dbUpdates: Record<string, unknown> = {};

  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined)
    dbUpdates.description = updates.description;
  if (updates.cookTime !== undefined) dbUpdates.cook_time = updates.cookTime;
  if (updates.servings !== undefined) dbUpdates.servings = updates.servings;
  if (updates.chefId !== undefined) dbUpdates.chef_id = updates.chefId;
  if (updates.images !== undefined) dbUpdates.images = updates.images;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.dietaryTags !== undefined)
    dbUpdates.dietary_tags = updates.dietaryTags;
  if (updates.difficulty !== undefined)
    dbUpdates.difficulty = updates.difficulty;
  if (updates.videoUrl !== undefined) dbUpdates.video_url = updates.videoUrl;
  if (updates.nutrition !== undefined) dbUpdates.nutrition = updates.nutrition;
  if (updates.ingredientGroups !== undefined)
    dbUpdates.ingredient_groups = updates.ingredientGroups;
  if (updates.instructionGroups !== undefined)
    dbUpdates.instruction_groups = updates.instructionGroups;
  if (updates.references !== undefined)
    dbUpdates.references = updates.references;

  const { data, error } = await supabase
    .from("recipes")
    .update(dbUpdates)
    .eq("id", id)
    .select(
      `
      *,
      chefs ( id, name, avatar )
    `,
    )
    .single();

  if (error) throw error;

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
    chefId: data.chef_id,
    chef: data.chefs
      ? {
          name: data.chefs.name,
          avatar: data.chefs.avatar,
        }
      : undefined,
  };
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
    { id: number; updates: UpdateRecipeInput }
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
