import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Ingredient } from "@/data/recipes";
import { useAuth } from "./AuthContext";
import { SITE_NAME } from "@/app/constants";

interface ShoppingItem extends Ingredient {
  checked: boolean;
  recipeId: number;
  recipeTitle: string;
}

interface ShoppingListContextType {
  items: ShoppingItem[];
  addIngredients: (
    ingredients: Ingredient[],
    recipeId: number,
    recipeTitle: string,
  ) => void;
  removeItem: (itemId: string, recipeId: number) => void;
  toggleItem: (itemId: string, recipeId: number) => void;
  clearList: () => void;
  clearChecked: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  itemCount: number;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(
  undefined,
);

// Get storage key based on user
const getStorageKey = (userId: string | null) =>
  userId ? `${SITE_NAME}_shopping_list_${userId}` : `${SITE_NAME}_shopping_list_guest`;

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

export function useShoppingList() {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error(
      "useShoppingList must be used within a ShoppingListProvider",
    );
  }
  return context;
}
