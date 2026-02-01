import { ShoppingRecipe } from "@/context/ShoppingListContext/interfaces";

export interface AdjustServingsModalProps {
  open: boolean;
  onClose: () => void;
  recipe: ShoppingRecipe;
  onSave: (recipeId: number, newServings: number) => void;
}

export interface RecipeListItemProps {
  recipe: ShoppingRecipe;
  onAdjustServings: (recipe: ShoppingRecipe) => void;
  onRemove: (recipeId: number) => void;
}
