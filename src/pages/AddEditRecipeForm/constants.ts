import { IngredientGroupFormItem } from "@/components/custom/IngredientGroupForm/interfaces";
import { InstructionGroupFormItem } from "@/components/custom/InstructionGroupForm/interfaces";
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
  tempId: crypto.randomUUID(),
  heading: "",
  items: [
    {
      tempId: crypto.randomUUID(),
      name: "",
      amount: "",
      unit: "",
      preparation: "",
      note: "",
    },
  ],
};

export const emptyInstructionGroup: InstructionGroupFormItem = {
  tempId: crypto.randomUUID(),
  heading: "",
  steps: [{ tempId: crypto.randomUUID(), text: "", timer: undefined }],
};

export const createEmptyReference = (
  type: "link" | "image",
): ReferenceFormItem => ({
  tempId: crypto.randomUUID(),
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
  videoUrl: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
  ingredientGroups: [emptyIngredientGroup],
  instructionGroups: [emptyInstructionGroup],
  references: [],
};
