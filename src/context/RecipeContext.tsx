import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Recipe } from "@/data/recipes";
import { supabase } from "@/db/supabaseClient";

interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, "id">) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  getRecipeById: (id: string) => Recipe | undefined;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  //TESTING

  useEffect(() => {
    getRecipes();
  }, []);
  async function getRecipes() {
    const { data } = await supabase.from("recipes").select();
    setRecipes(data);
  }

  console.log({ recipes });

  //TESTING

  const addRecipe = useCallback((recipe: Omit<Recipe, "id">) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: String(Date.now()),
    };
    setRecipes((prev) => [newRecipe, ...prev]);
  }, []);

  const updateRecipe = useCallback((id: string, updates: Partial<Recipe>) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id ? { ...recipe, ...updates } : recipe,
      ),
    );
  }, []);

  const deleteRecipe = useCallback((id: string) => {
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  }, []);

  const getRecipeById = useCallback(
    (id: string) => {
      return recipes.find((recipe) => recipe.id === id);
    },
    [recipes],
  );

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        getRecipeById,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipes must be used within a RecipeProvider");
  }
  return context;
}
