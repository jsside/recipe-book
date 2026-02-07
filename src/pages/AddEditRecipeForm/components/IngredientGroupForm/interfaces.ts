import { Ingredient } from "@/data/recipes";

export type IngredientFormItem = Omit<Ingredient, "id">;

export interface IngredientGroupFormItem {
  heading: string;
  items: IngredientFormItem[];
}

export interface IngredientGroupFormProps {
  groups: IngredientGroupFormItem[];
  onChange: (groups: IngredientGroupFormItem[]) => void;
}
