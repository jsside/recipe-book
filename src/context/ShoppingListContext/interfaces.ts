import { Ingredient } from "@/data/recipes";

export interface ShoppingItem extends Ingredient {
  checked: boolean;
  recipeId: number;
  recipeTitle: string;
  recipeImage?: string;
}

export interface ShoppingRecipe {
  recipeId: number;
  recipeTitle: string;
  recipeImage: string;
  servings: number;
  originalServings: number;
}

export interface ShoppingListContextType {
  items: ShoppingItem[];
  recipes: ShoppingRecipe[];
  addIngredients: (
    ingredients: Ingredient[],
    recipeId: number,
    recipeTitle: string,
    recipeImage?: string,
    servings?: number,
  ) => void;
  removeItem: (itemId: string, recipeId: number) => void;
  removeRecipe: (recipeId: number) => void;
  updateRecipeServings: (recipeId: number, newServings: number) => void;
  toggleItem: (itemId: string, recipeId: number) => void;
  clearList: () => void;
  clearChecked: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  itemCount: number;
}
