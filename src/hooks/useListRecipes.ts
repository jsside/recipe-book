import { InvalidateQueryFilters, useQuery } from "@tanstack/react-query";
import { Difficulty, Recipe } from "@/data/recipes";
import { supabase } from "@/db/supabaseClient";
import { singletonQueryClient } from "@/app/App.queries";

export const LIST_RECIPES_KEY = "list-recipes";

//----------------------------------
// ALL RECIPES
//----------------------------------

const fetchRecipes = async (): Promise<Recipe[]> => {
  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
      *,
      chefs ( id, name, avatar )
    `,
    )
    .order("created_at", { ascending: false });

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
      chefId: r.chef_id,
      chef: r.chefs
        ? {
            name: r.chefs.name,
            avatar: r.chefs.avatar,
          }
        : undefined,
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

interface ChefWithRecipes {
  id: number;
  name: string;
  avatar?: string;
  recipes: {
    id: number;
    title: string;
    images: string[];
    cookTime: string;
    createdAt: string;
  }[];
}

export const fetchRecipesByChef = async (
  chefId: number,
): Promise<ChefWithRecipes | null> => {
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
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    avatar: data.avatar ?? undefined,
    recipes:
      data.recipes?.map((r: Record<string, unknown>) => ({
        id: r.id as number,
        title: r.title as string,
        images: (r.images as string[]) ?? [],
        cookTime: r.cook_time as string,
        createdAt: r.created_at as string,
      })) ?? [],
  };
};

export function invalidateListRecipesByChef(chefId: number) {
  return singletonQueryClient.invalidateQueries([
    LIST_RECIPES_KEY,
    chefId,
  ] as InvalidateQueryFilters<readonly unknown[]>);
}

export function useListRecipesByChef(chefId: number) {
  return useQuery<ChefWithRecipes | null, Error>({
    queryFn: () => fetchRecipesByChef(chefId),
    queryKey: [LIST_RECIPES_KEY, chefId],
    enabled: !!chefId,
  });
}

//----------------------------------
// RECIPES BY CHEF NAME
//----------------------------------

interface ChefRecipesResult {
  chef: {
    id: number;
    name: string;
    avatar?: string;
  };
  recipes: Recipe[];
}

export const fetchRecipesByChefName = async (
  chefName: string,
): Promise<ChefRecipesResult | null> => {
  // First find the chef
  const { data: chefData, error: chefError } = await supabase
    .from("chefs")
    .select("id, name, avatar")
    .ilike("name", chefName)
    .maybeSingle();

  if (chefError) throw chefError;
  if (!chefData) return null;

  // Then fetch their recipes
  const { data: recipesData, error: recipesError } = await supabase
    .from("recipes")
    .select("*")
    .eq("chef_id", chefData.id)
    .order("created_at", { ascending: false });

  if (recipesError) throw recipesError;

  return {
    chef: {
      id: chefData.id,
      name: chefData.name,
      avatar: chefData.avatar ?? undefined,
    },
    recipes:
      recipesData?.map((r) => ({
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
        chefId: r.chef_id,
        chef: {
          name: chefData.name,
          avatar: chefData.avatar ?? undefined,
        },
      })) ?? [],
  };
};

export function useListRecipesByChefName(chefName: string) {
  return useQuery<ChefRecipesResult | null, Error>({
    queryFn: () => fetchRecipesByChefName(chefName),
    queryKey: [LIST_RECIPES_KEY, chefName],
    enabled: !!chefName,
  });
}

//----------------------------------
// RECIPES BY INGREDIENT
//----------------------------------

interface IngredientWithRecipes {
  id: number;
  name: string;
  category?: string;
  imageUrl?: string;
  recipes: {
    id: number;
    title: string;
    images: string[];
  }[];
}

export const fetchRecipesByIngredient = async (
  ingredientId: number,
): Promise<IngredientWithRecipes | null> => {
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
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    category: data.category ?? undefined,
    imageUrl: data.image_url ?? undefined,
    recipes:
      data.recipe_ingredients?.map(
        (ri: { recipes: { id: number; title: string; images: string[] } }) =>
          ri.recipes,
      ) ?? [],
  };
};

export function invalidateListRecipesByIngredient(ingredientId: number) {
  return singletonQueryClient.invalidateQueries([
    LIST_RECIPES_KEY,
    ingredientId,
  ] as InvalidateQueryFilters<readonly unknown[]>);
}

export function useListRecipesByIngredient(ingredientId: number) {
  return useQuery<IngredientWithRecipes | null, Error>({
    queryFn: () => fetchRecipesByIngredient(ingredientId),
    queryKey: [LIST_RECIPES_KEY, ingredientId],
    enabled: !!ingredientId,
  });
}

//----------------------------------
// RECIPES BY CATEGORY
//----------------------------------

interface RecipeWithChef {
  id: number;
  title: string;
  images: string[];
  chef?: {
    name: string;
    avatar?: string;
  };
}

export const fetchRecipesByCategory = async (
  category: string,
): Promise<RecipeWithChef[]> => {
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

  return (
    data?.map((r) => ({
      id: r.id,
      title: r.title,
      images: r.images ?? [],
      chef: r.chefs
        ? {
            name: r.chefs.name,
            avatar: r.chefs.avatar ?? undefined,
          }
        : undefined,
    })) ?? []
  );
};

export function invalidateListRecipesByCategory(category: string) {
  return singletonQueryClient.invalidateQueries([
    LIST_RECIPES_KEY,

    category,
  ] as InvalidateQueryFilters<readonly unknown[]>);
}

export function useListRecipesByCategory(category: string) {
  return useQuery<RecipeWithChef[], Error>({
    queryFn: () => fetchRecipesByCategory(category),
    queryKey: [LIST_RECIPES_KEY, category],
    enabled: !!category,
  });
}

//----------------------------------
// RECIPES BY DIETARY TAG
//----------------------------------

export const fetchRecipesByDietaryTag = async (
  tag: string,
): Promise<RecipeWithChef[]> => {
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

  return (
    data?.map((r) => ({
      id: r.id,
      title: r.title,
      images: r.images ?? [],
      chef: r.chefs
        ? {
            name: r.chefs.name,
            avatar: r.chefs.avatar ?? undefined,
          }
        : undefined,
    })) ?? []
  );
};

export function invalidateRecipesByDietaryTag(tag: string) {
  return singletonQueryClient.invalidateQueries([
    LIST_RECIPES_KEY,
    tag,
  ] as InvalidateQueryFilters<readonly unknown[]>);
}

export function useListRecipesByDietaryTag(tag: string) {
  return useQuery<RecipeWithChef[], Error>({
    queryFn: () => fetchRecipesByDietaryTag(tag),
    queryKey: [LIST_RECIPES_KEY, tag],
    enabled: !!tag,
  });
}

//----------------------------------
// RECIPES BY DIFFICULTY
//----------------------------------

export const fetchRecipesByDifficulty = async (
  difficulty: Difficulty,
): Promise<RecipeWithChef[]> => {
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

  return (
    data?.map((r) => ({
      id: r.id,
      title: r.title,
      images: r.images ?? [],
      chef: r.chefs
        ? {
            name: r.chefs.name,
            avatar: r.chefs.avatar ?? undefined,
          }
        : undefined,
    })) ?? []
  );
};

export function invalidateRecipesByDifficulty(difficulty: Difficulty) {
  return singletonQueryClient.invalidateQueries([
    LIST_RECIPES_KEY,

    difficulty,
  ] as InvalidateQueryFilters<readonly unknown[]>);
}

export function useListRecipesByDifficulty(difficulty: Difficulty) {
  return useQuery<RecipeWithChef[], Error>({
    queryFn: () => fetchRecipesByDifficulty(difficulty),
    queryKey: [LIST_RECIPES_KEY, difficulty],
    enabled: !!difficulty,
  });
}
