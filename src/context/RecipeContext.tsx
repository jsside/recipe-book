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
  loading: boolean;
  error: string | null;
  addRecipe: (recipe: Omit<Recipe, "id">) => Promise<Recipe | null>;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => Promise<Recipe | null>;
  deleteRecipe: (id: string) => Promise<boolean>;
  getRecipeById: (id: string) => Recipe | undefined;
  getRecipesByChef: (chefName: string) => Recipe[];
  refetch: () => Promise<void>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;
      setRecipes(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch recipes";
      setError(message);
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const addRecipe = useCallback(async (recipe: Omit<Recipe, "id">): Promise<Recipe | null> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("recipes")
        .insert([{ ...recipe, created_at: new Date().toISOString() }])
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      
      setRecipes((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error("Error creating recipe:", err);
      return null;
    }
  }, []);

  const updateRecipe = useCallback(async (id: string, updates: Partial<Recipe>): Promise<Recipe | null> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from("recipes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      
      setRecipes((prev) =>
        prev.map((recipe) => (recipe.id === id ? data : recipe))
      );
      return data;
    } catch (err) {
      console.error("Error updating recipe:", err);
      return null;
    }
  }, []);

  const deleteRecipe = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error: supabaseError } = await supabase
        .from("recipes")
        .delete()
        .eq("id", id);

      if (supabaseError) throw supabaseError;
      
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting recipe:", err);
      return false;
    }
  }, []);

  const getRecipeById = useCallback(
    (id: string) => {
      return recipes.find((recipe) => recipe.id === id);
    },
    [recipes]
  );

  const getRecipesByChef = useCallback(
    (chefName: string) => {
      return recipes.filter(
        (recipe) => recipe.chef?.name?.toLowerCase() === chefName.toLowerCase()
      );
    },
    [recipes]
  );

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        loading,
        error,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        getRecipeById,
        getRecipesByChef,
        refetch: fetchRecipes,
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
