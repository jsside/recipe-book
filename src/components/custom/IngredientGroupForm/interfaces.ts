import { Ingredient } from "@/data/recipes";

export interface IngredientFormItem extends Omit<Ingredient, "id"> {
  tempId: string;
}

export interface IngredientGroupFormItem {
  tempId: string;
  heading: string;
  items: IngredientFormItem[];
}

export interface IngredientGroupFormProps {
  groups: IngredientGroupFormItem[];
  onChange: (groups: IngredientGroupFormItem[]) => void;
}
