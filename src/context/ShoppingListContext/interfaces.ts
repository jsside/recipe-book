import { Ingredient } from "@/data/recipes";

export interface ShoppingItem extends Ingredient {
  checked: boolean;
  recipeId: number;
  recipeTitle: string;
}

export interface ShoppingListContextType {
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
