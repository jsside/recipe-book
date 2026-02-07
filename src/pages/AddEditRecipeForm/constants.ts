import { IngredientGroupFormItem } from "./components/IngredientGroupForm/interfaces";
import { InstructionGroupFormItem } from "./components/InstructionGroupForm/interfaces";
import { AddEditRecipeFormFields, ReferenceFormItem } from "./interfaces";

export const CATEGORY_OPTIONS = [
  "Dinner",
  "Breakfast",
  "Lunch",
  "Dessert",
  "Snack",
  "Packed lunches",
  "Make-ahead breakfasts",
];

export const MAX_HISTORY_SIZE = 50;

export const emptyIngredientGroup: IngredientGroupFormItem = {
  heading: "",
  items: [
    {
      name: "",
      amount: "",
      unit: "",
      preparation: "",
      note: "",
    },
  ],
};

export const emptyInstructionGroup: InstructionGroupFormItem = {
  heading: "",
  steps: [
    {
      text: "",
      timer: undefined,
    },
  ],
};

export const createEmptyReference = (
  type: "link" | "image",
): ReferenceFormItem => ({
  type,
  url: "",
  title: "",
});

export const initialValues: AddEditRecipeFormFields = {
  title: "",
  description: "",
  images: [""],
  cookTime: "",
  servings: 4,
  difficulty: "easy",
  categories: [],
  dietaryTags: [],
  ingredientGroups: [emptyIngredientGroup],
  instructionGroups: [emptyInstructionGroup],
  references: [],
};
