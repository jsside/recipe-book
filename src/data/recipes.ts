export interface RecipeReference {
  type: "link" | "image";
  url: string;
  title?: string;
}

export interface Recipe {
  id: number;
  title: string;
  images?: string[]; // Multiple images support
  cookTime: string;
  chefId: number; // References chefs table
  chef?: {
    name: string;
    avatar?: string;
  };
  category: string[];
  ingredientGroups: IngredientGroup[];
  instructionGroups: InstructionGroup[];
  servings: number;
  description: string;
  createdAt?: string;
  // Extended fields
  difficulty?: Difficulty;
  dietaryTags?: string[];
  videoUrl?: string;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  references?: RecipeReference[];
}

export interface Chef {
  id: number;
  name: string;
  avatar: string;
}

export interface IngredientGroup {
  heading?: string;
  items: Ingredient[];
}

export type Difficulty = "easy" | "medium" | "hard";

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  preparation?: string;
  note?: string;
  category?: string;
}

export interface InstructionGroup {
  heading?: string;
  steps: InstructionStep[];
}

export interface InstructionStep {
  text: string;
  timer?: number; // in minutes
}

export interface IngredientCategory {
  id: string;
  name: string;
  image: string;
  recipeCount: number;
}

export const ingredientCategories: IngredientCategory[] = [
  {
    id: "1",
    name: "Chicken",
    image:
      "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&q=80",
    recipeCount: 245,
  },
  {
    id: "2",
    name: "Pasta",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80",
    recipeCount: 189,
  },
  {
    id: "3",
    name: "Salmon",
    image:
      "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&q=80",
    recipeCount: 156,
  },
  {
    id: "4",
    name: "Beef",
    image:
      "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&q=80",
    recipeCount: 203,
  },
  {
    id: "5",
    name: "Eggs",
    image:
      "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=400&q=80",
    recipeCount: 178,
  },
  {
    id: "6",
    name: "Rice",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80",
    recipeCount: 134,
  },
  {
    id: "7",
    name: "Vegetables",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
    recipeCount: 312,
  },
  {
    id: "8",
    name: "Cheese",
    image:
      "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&q=80",
    recipeCount: 167,
  },
];

export const categories = [
  "Dinner",
  "Lunch",
  "Breakfast",
  "Quick meals",
  "Vegetarian",
];

export const dietaryOptions = [
  "vegetarian",
  "vegan",
  "gluten-free",
  "dairy-free",
  "high-protein",
  "low-carb",
  "high-fiber",
];

export const difficultyOptions = ["easy", "medium", "hard"] as const;
