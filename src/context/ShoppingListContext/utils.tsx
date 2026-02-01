import { SITE_NAME } from "@/app/constants";
import { createContext, useContext } from "react";
import { type ShoppingListContextType } from "./interfaces";

export const ShoppingListContext = createContext<
  ShoppingListContextType | undefined
>(undefined);
// Get storage key based on user
export const getStorageKey = (userId: string | null) =>
  userId
    ? `${SITE_NAME}_shopping_list_${userId}`
    : `${SITE_NAME}_shopping_list_guest`;

export function useShoppingList() {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error(
      "useShoppingList must be used within a ShoppingListProvider",
    );
  }
  return context;
}
