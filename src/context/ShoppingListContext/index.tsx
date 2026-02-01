import React, { useState, useCallback, useEffect } from "react";
import { Ingredient } from "@/data/recipes";
import { ShoppingItem, ShoppingRecipe } from "./interfaces";
import { useAuth } from "../AuthContext/utils";
import { getStorageKey, ShoppingListContext } from "./utils";

const getRecipesStorageKey = (userId: string | null) =>
  `shopping_recipes_${userId || "guest"}`;

export function ShoppingListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const storageKey = getStorageKey(user?.id || null);
  const recipesStorageKey = getRecipesStorageKey(user?.id || null);

  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  });

  const [recipes, setRecipes] = useState<ShoppingRecipe[]>(() => {
    const stored = localStorage.getItem(recipesStorageKey);
    return stored ? JSON.parse(stored) : [];
  });

  const [isOpen, setIsOpen] = useState(false);

  // Persist items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  // Persist recipes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(recipesStorageKey, JSON.stringify(recipes));
  }, [recipes, recipesStorageKey]);

  // Load items when user changes
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    setItems(stored ? JSON.parse(stored) : []);
    const storedRecipes = localStorage.getItem(recipesStorageKey);
    setRecipes(storedRecipes ? JSON.parse(storedRecipes) : []);
  }, [storageKey, recipesStorageKey]);

  const addIngredients = useCallback(
    (
      ingredients: Ingredient[],
      recipeId: number,
      recipeTitle: string,
      recipeImage?: string,
      servings: number = 4,
    ) => {
      // Add or update recipe
      setRecipes((prev) => {
        const existingIndex = prev.findIndex((r) => r.recipeId === recipeId);
        if (existingIndex >= 0) {
          return prev;
        }
        return [
          ...prev,
          {
            recipeId,
            recipeTitle,
            recipeImage:
              recipeImage ||
              "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=200",
            servings,
            originalServings: servings,
          },
        ];
      });

      setItems((prev) => {
        const newItems = ingredients.map((ing) => ({
          ...ing,
          checked: false,
          recipeId,
          recipeTitle,
          recipeImage,
        }));

        // Filter out duplicates from the same recipe
        const filtered = prev.filter(
          (item) =>
            !(
              item.recipeId === recipeId &&
              ingredients.some((ing) => ing.id === item.id)
            ),
        );

        return [...filtered, ...newItems];
      });
      setIsOpen(true);
    },
    [],
  );

  const removeItem = useCallback((itemId: string, recipeId: number) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.id === itemId && item.recipeId === recipeId),
      ),
    );
  }, []);

  const removeRecipe = useCallback((recipeId: number) => {
    setRecipes((prev) => prev.filter((r) => r.recipeId !== recipeId));
    setItems((prev) => prev.filter((item) => item.recipeId !== recipeId));
  }, []);

  const updateRecipeServings = useCallback(
    (recipeId: number, newServings: number) => {
      setRecipes((prev) =>
        prev.map((r) =>
          r.recipeId === recipeId ? { ...r, servings: newServings } : r,
        ),
      );
    },
    [],
  );

  const toggleItem = useCallback((itemId: string, recipeId: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId && item.recipeId === recipeId
          ? { ...item, checked: !item.checked }
          : item,
      ),
    );
  }, []);

  const clearList = useCallback(() => {
    setItems([]);
    setRecipes([]);
  }, []);

  const clearChecked = useCallback(() => {
    setItems((prev) => prev.filter((item) => !item.checked));
  }, []);

  return (
    <ShoppingListContext.Provider
      value={{
        items,
        recipes,
        addIngredients,
        removeItem,
        removeRecipe,
        updateRecipeServings,
        toggleItem,
        clearList,
        clearChecked,
        isOpen,
        setIsOpen,
        itemCount: items.length,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}
