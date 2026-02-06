import { Difficulty } from "@/data/recipes";
import { IngredientGroupFormItem } from "./components/IngredientGroupForm/interfaces";
import { InstructionGroupFormItem } from "./components/InstructionGroupForm/interfaces";

export interface ReferenceFormItem {
  tempId: string;
  type: "link" | "image";
  url: string;
  title: string;
}

export interface AddEditRecipeFormFields {
  title: string;
  description: string;
  images: string[];
  cookTime: string;
  servings: number;
  difficulty: Difficulty;
  categories: string[];
  dietaryTags: string[];
  videoUrl?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  ingredientGroups: IngredientGroupFormItem[];
  instructionGroups: InstructionGroupFormItem[];
  references: ReferenceFormItem[];
}

export interface RecipeFormProps {
  isEditMode: boolean;
  recipeId?: string;
}
