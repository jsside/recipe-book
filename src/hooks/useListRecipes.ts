import { InvalidateQueryFilters, useQuery } from "@tanstack/react-query";
import { Difficulty, Recipe } from "@/data/recipes";
import { supabase } from "@/db/supabaseClient";
import { singletonQueryClient } from "@/app/App.queries";

export const LIST_RECIPES_KEY = "list-recipes";

//----------------------------------
// ALL RECIPES
//----------------------------------

const fetchRecipes = async (): Promise<Recipe[]> => {
  const { data, error } = await supabase.from("recipes").select("*");
  // .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (
    data?.map((r) => ({
      id: r.id,
      title: r.title,
      images: r.images ?? [],
      cookTime: r.cook_time,
      servings: r.servings,
      difficulty: r.difficulty,
      description: r.description,
      category: r.category ?? [],
      dietaryTags: r.dietary_tags ?? [],
      videoUrl: r.video_url ?? undefined,
      nutrition: r.nutrition ?? undefined,
      ingredientGroups: r.ingredient_groups,
      instructionGroups: r.instruction_groups,
      references: r.references ?? [],
      createdAt: r.created_at,
      // TODO fix chef

      // chef: {
      //   name: r.chefs.name,
      //   avatar: r.chefs.avatar,
      // },
    })) ?? []
  );
};

export function invalidateListRecipes() {
  return singletonQueryClient.invalidateQueries([
    LIST_RECIPES_KEY,
  ] as InvalidateQueryFilters<readonly unknown[]>);
}

export function useListRecipes() {
  return useQuery<Recipe[], Error>({
    queryFn: fetchRecipes,
    queryKey: [LIST_RECIPES_KEY],
  });
}

//----------------------------------
// RECIPES BY CHEF
//----------------------------------

export const fetchRecipesByChef = async (chefId: number) => {
  const { data, error } = await supabase
    .from("chefs")
    .select(
      `
      id,
      name,
      avatar,
      recipes (
        id,
        title,
        images,
        cook_time,
        created_at
      )
    `,
    )
    .eq("id", chefId)
    .single();

  if (error) throw error;

  return data;
};

// export function invalidateListRecipesByChef(chefId: number) {
//   return singletonQueryClient.invalidateQueries([
//     `${LIST_RECIPES_KEY}-by-chef-${chefId}`,
//   ] as InvalidateQueryFilters<readonly unknown[]>);
// }

// export function useListRecipesByChef(chefId: number) {
//   return useQuery<Recipe[], Error>({
//     queryFn: fetchRecipesByChef,
//     queryKey: [`${LIST_RECIPES_KEY}-by-chef-${chefId}`],
//   });
// }

//----------------------------------
// RECIPES BY INGREDIENT
//----------------------------------

export const fetchRecipesByIngredient = async (ingredientId: number) => {
  const { data, error } = await supabase
    .from("ingredients")
    .select(
      `
      id,
      name,
      category,
      image_url,
      recipe_ingredients (
        recipes (
          id,
          title,
          images
        )
      )
    `,
    )
    .eq("id", ingredientId)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    imageUrl: data.image_url,
    recipes: data.recipe_ingredients?.map((ri) => ri.recipes) ?? [],
  };
};

// export function invalidateListRecipesByIngredient(ingredientId: number) {
//   return singletonQueryClient.invalidateQueries([
//     `${LIST_RECIPES_KEY}-by-ingredient-${ingredientId}`,
//   ] as InvalidateQueryFilters<readonly unknown[]>);
// }

// export function useListRecipesByIngredient(ingredientId: number) {
//   return useQuery<Recipe[], Error>({
//     queryFn: fetchRecipesByIngredient,
//     queryKey: [`${LIST_RECIPES_KEY}-by-ingredient-${ingredientId}`],
//   });
// }

//----------------------------------
// RECIPES BY CATEGORY
//----------------------------------

export const fetchRecipesByCategory = async (category: string) => {
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
    .contains("category", [category]);

  if (error) throw error;

  return data ?? [];
};

// export function invalidateListRecipesByCategory(category: string) {
//   return singletonQueryClient.invalidateQueries([
//     `${LIST_RECIPES_KEY}-by-category-${category}`,
//   ] as InvalidateQueryFilters<readonly unknown[]>);
// }

// export function useListRecipesByCategory(category: string) {
//   return useQuery<Recipe[], Error>({
//     queryFn: fetchRecipesByCategory,
//     queryKey: [`${LIST_RECIPES_KEY}-by-category-${category}`],
//   });
// }

//----------------------------------
// RECIPES BY DIETARY TAG
//----------------------------------

export const fetchRecipesByDietaryTag = async (tag: string) => {
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
    .contains("dietary_tags", [tag]);

  if (error) throw error;

  return data ?? [];
};

// export function invalidateRecipesByDietaryTag(tag: string) {
//   return singletonQueryClient.invalidateQueries([
//     `${LIST_RECIPES_KEY}-by-dietary-tag-${tag}`,
//   ] as InvalidateQueryFilters<readonly unknown[]>);
// }

// export function useListRecipesByDietaryTag(tag: string) {
//   return useQuery<Recipe[], Error>({
//     queryFn: fetchRecipesByIngredient,
//     queryKey: [`${LIST_RECIPES_KEY}-by-dietary-tag-${tag}`],
//   });
// }

//----------------------------------
// RECIPES BY DIFFICULTY
//----------------------------------

export const fetchRecipesByDifficulty = async (difficulty: Difficulty) => {
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
    .eq("difficulty", difficulty);

  if (error) throw error;

  return data ?? [];
};

// export function invalidateRecipesByDifficulty(difficulty: Difficulty) {
//   return singletonQueryClient.invalidateQueries([
//     `${LIST_RECIPES_KEY}-by-difficulty-${difficulty}`,
//   ] as InvalidateQueryFilters<readonly unknown[]>);
// }

// export function useListRecipesByDifficulty(difficulty: Difficulty) {
//   return useQuery<Recipe[], Error>({
//     queryFn: fetchRecipesByIngredient,
//     queryKey: [`${LIST_RECIPES_KEY}-by-difficulty-${difficulty}`],
//   });
// }
