import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Recipe } from "@/data/recipes";
import { supabase } from "@/db/supabaseClient";
import { LIST_RECIPES_KEY } from "./useListRecipes";

interface AddRecipeInput {
  title: string;
  description: string;
  cookTime: string;
  servings: number;
  chefId: number;
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
  ingredientGroups: unknown;
  instructionGroups: unknown;
  references?: unknown;
}

const addRecipe = async (recipe: AddRecipeInput): Promise<Recipe | null> => {
  const { data, error } = await supabase
    .from("recipes")
    .insert([
      {
        title: recipe.title,
        description: recipe.description,
        cook_time: recipe.cookTime,
        servings: recipe.servings,
        chef_id: recipe.chefId,
        images: recipe.images ?? [],
        category: recipe.category ?? [],
        dietary_tags: recipe.dietaryTags ?? [],
        difficulty: recipe.difficulty,
        video_url: recipe.videoUrl,
        nutrition: recipe.nutrition,
        ingredient_groups: recipe.ingredientGroups,
        instruction_groups: recipe.instructionGroups,
        references: recipe.references,
      },
    ])
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
 * const addRecipe = useAddRecipe();
 * await addRecipe(recipe);
 */
export function useAddRecipe() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Recipe | null, Error, AddRecipeInput>({
    mutationFn: addRecipe,
    onSuccess: (newRecipe) => {
      if (newRecipe) {
        queryClient.setQueryData<Recipe[]>([LIST_RECIPES_KEY], (old = []) => [
          newRecipe,
          ...old,
        ]);
      }
    },
  });

  return mutation.mutateAsync;
}
