import React, { useState, useCallback, useEffect } from "react";
import { Ingredient } from "@/data/recipes";
import { ShoppingItem } from "./interfaces";
import { useAuth } from "../AuthContext/utils";
import { getStorageKey, ShoppingListContext } from "./utils";

export function ShoppingListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const storageKey = getStorageKey(user?.id || null);

  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  });
  const [isOpen, setIsOpen] = useState(false);

  // Persist items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  // Load items when user changes
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    setItems(stored ? JSON.parse(stored) : []);
  }, [storageKey]);

  const addIngredients = useCallback(
    (ingredients: Ingredient[], recipeId: number, recipeTitle: string) => {
      setItems((prev) => {
        const newItems = ingredients.map((ing) => ({
          ...ing,
          checked: false,
          recipeId,
          recipeTitle,
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
  }, []);

  const clearChecked = useCallback(() => {
    setItems((prev) => prev.filter((item) => !item.checked));
  }, []);

  return (
    <ShoppingListContext.Provider
      value={{
        items,
        addIngredients,
        removeItem,
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
