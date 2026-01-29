import { useState, useCallback } from "react";
import { supabase } from "@/db/supabaseClient";
import { Recipe } from "@/data/recipes";

export interface UseRecipeCRUDReturn {
  loading: boolean;
  error: string | null;
  createRecipe: (recipe: Omit<Recipe, "id">) => Promise<Recipe | null>;
  updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<Recipe | null>;
  deleteRecipe: (id: string) => Promise<boolean>;
  fetchRecipes: () => Promise<Recipe[]>;
  fetchRecipeById: (id: string) => Promise<Recipe | null>;
  fetchRecipesByChef: (chefName: string) => Promise<Recipe[]>;
}

export function useRecipeCRUD(): UseRecipeCRUDReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async (): Promise<Recipe[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;
      return data || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch recipes";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecipeById = useCallback(async (id: string): Promise<Recipe | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (supabaseError) throw supabaseError;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch recipe";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecipesByChef = useCallback(async (chefName: string): Promise<Recipe[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from("recipes")
        .select("*")
        .eq("chef->>name", chefName)
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;
      return data || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch chef recipes";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createRecipe = useCallback(async (recipe: Omit<Recipe, "id">): Promise<Recipe | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from("recipes")
        .insert([{ ...recipe, created_at: new Date().toISOString() }])
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create recipe";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRecipe = useCallback(async (id: string, updates: Partial<Recipe>): Promise<Recipe | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from("recipes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update recipe";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRecipe = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error: supabaseError } = await supabase
        .from("recipes")
        .delete()
        .eq("id", id);

      if (supabaseError) throw supabaseError;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete recipe";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    fetchRecipes,
    fetchRecipeById,
    fetchRecipesByChef,
  };
}
