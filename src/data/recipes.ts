export interface Recipe {
  id: string;
  title: string;
  image: string;
  cookTime: string;
  chef: {
    name: string;
    avatar: string;
  };
  isTopRated: boolean;
  category: string[];
  ingredients: Ingredient[];
  servings: number;
  instructions: string[];
  description: string;
  created_at?: string;
  // Extended fields
  difficulty?: "easy" | "medium" | "hard";
  dietaryTags?: string[];
  videoUrl?: string;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  tips?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  category: string;
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

// export const recipes: Recipe[] = [
//   {
//     id: "1",
//     title: "Puttanesca Pasta Salad",
//     image:
//       "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
//     cookTime: "15 mins",
//     chef: {
//       name: "Elena Silcock",
//       avatar:
//         "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
//     },
//     isTopRated: false,
//     category: ["Dinner", "New recipes", "Easy lunches"],
//     servings: 4,
//     description:
//       "A vibrant and flavorful pasta salad with all the punchy flavors of classic puttanesca.",
//     difficulty: "easy",
//     dietaryTags: ["vegetarian"],
//     nutrition: { calories: 420, protein: 12, carbs: 58, fat: 16 },
//     ingredients: [
//       {
//         id: "1",
//         name: "Fusilli pasta",
//         amount: "400",
//         unit: "g",
//         category: "Pasta",
//       },
//       {
//         id: "2",
//         name: "Cherry tomatoes",
//         amount: "300",
//         unit: "g",
//         category: "Vegetables",
//       },
//       {
//         id: "3",
//         name: "Black olives",
//         amount: "100",
//         unit: "g",
//         category: "Pantry",
//       },
//       {
//         id: "4",
//         name: "Capers",
//         amount: "2",
//         unit: "tbsp",
//         category: "Pantry",
//       },
//       {
//         id: "5",
//         name: "Garlic cloves",
//         amount: "3",
//         unit: "",
//         category: "Vegetables",
//       },
//       {
//         id: "6",
//         name: "Fresh basil",
//         amount: "1",
//         unit: "bunch",
//         category: "Herbs",
//       },
//     ],
//     instructions: [
//       "Cook pasta according to package instructions, then drain and cool.",
//       "Halve the cherry tomatoes and slice the olives.",
//       "Mince the garlic and combine with olive oil.",
//       "Toss all ingredients together with fresh basil.",
//       "Season with salt, pepper, and a drizzle of olive oil.",
//     ],
//   },
//   {
//     id: "2",
//     title: "Rigatoni with Broccoli",
//     image:
//       "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=800&q=80",
//     cookTime: "25 mins",
//     chef: {
//       name: "Marcus Chen",
//       avatar:
//         "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
//     },
//     isTopRated: true,
//     category: ["Dinner"],
//     servings: 4,
//     description:
//       "Creamy rigatoni with tender broccoli and a hint of lemon zest.",
//     difficulty: "easy",
//     dietaryTags: ["vegetarian"],
//     nutrition: { calories: 480, protein: 18, carbs: 62, fat: 18 },
//     ingredients: [
//       {
//         id: "1",
//         name: "Rigatoni",
//         amount: "400",
//         unit: "g",
//         category: "Pasta",
//       },
//       {
//         id: "2",
//         name: "Broccoli",
//         amount: "2",
//         unit: "heads",
//         category: "Vegetables",
//       },
//       {
//         id: "3",
//         name: "Parmesan cheese",
//         amount: "80",
//         unit: "g",
//         category: "Dairy",
//       },
//       {
//         id: "4",
//         name: "Garlic cloves",
//         amount: "4",
//         unit: "",
//         category: "Vegetables",
//       },
//       { id: "5", name: "Lemon", amount: "1", unit: "", category: "Citrus" },
//       {
//         id: "6",
//         name: "Chili flakes",
//         amount: "1",
//         unit: "tsp",
//         category: "Spices",
//       },
//     ],
//     instructions: [
//       "Cook rigatoni in salted water until al dente.",
//       "Steam broccoli florets until just tender.",
//       "Sauté garlic in olive oil until fragrant.",
//       "Combine pasta, broccoli, and garlic. Add pasta water to create sauce.",
//       "Finish with parmesan, lemon zest, and chili flakes.",
//     ],
//   },
//   {
//     id: "3",
//     title: "Honey Soy Glazed Salmon",
//     image:
//       "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
//     cookTime: "20 mins",
//     chef: {
//       name: "Sophie Williams",
//       avatar:
//         "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
//     },
//     isTopRated: true,
//     category: ["Dinner"],
//     servings: 2,
//     description:
//       "Perfectly glazed salmon with a sweet and savory honey soy coating.",
//     difficulty: "medium",
//     dietaryTags: ["gluten-free", "high-protein"],
//     nutrition: { calories: 380, protein: 32, carbs: 18, fat: 20 },
//     ingredients: [
//       {
//         id: "1",
//         name: "Salmon fillets",
//         amount: "2",
//         unit: "",
//         category: "Seafood",
//       },
//       { id: "2", name: "Honey", amount: "3", unit: "tbsp", category: "Pantry" },
//       {
//         id: "3",
//         name: "Soy sauce",
//         amount: "2",
//         unit: "tbsp",
//         category: "Pantry",
//       },
//       {
//         id: "4",
//         name: "Garlic cloves",
//         amount: "2",
//         unit: "",
//         category: "Vegetables",
//       },
//       {
//         id: "5",
//         name: "Sesame seeds",
//         amount: "1",
//         unit: "tbsp",
//         category: "Pantry",
//       },
//       {
//         id: "6",
//         name: "Spring onions",
//         amount: "2",
//         unit: "",
//         category: "Vegetables",
//       },
//     ],
//     instructions: [
//       "Mix honey, soy sauce, and minced garlic for the glaze.",
//       "Season salmon fillets with salt and pepper.",
//       "Pan-sear salmon skin-side down for 4 minutes.",
//       "Flip and brush with glaze, cook for 3 more minutes.",
//       "Garnish with sesame seeds and sliced spring onions.",
//     ],
//   },
//   {
//     id: "4",
//     title: "Mediterranean Chicken Bowl",
//     image:
//       "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
//     cookTime: "30 mins",
//     chef: {
//       name: "James Oliver",
//       avatar:
//         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
//     },
//     isTopRated: false,
//     category: ["Packed lunches"],
//     servings: 4,
//     description:
//       "A colorful grain bowl loaded with Mediterranean flavors and grilled chicken.",
//     difficulty: "medium",
//     dietaryTags: ["high-protein", "gluten-free"],
//     nutrition: { calories: 520, protein: 38, carbs: 42, fat: 22 },
//     ingredients: [
//       {
//         id: "1",
//         name: "Chicken breast",
//         amount: "500",
//         unit: "g",
//         category: "Poultry",
//       },
//       { id: "2", name: "Quinoa", amount: "200", unit: "g", category: "Grains" },
//       {
//         id: "3",
//         name: "Cucumber",
//         amount: "1",
//         unit: "",
//         category: "Vegetables",
//       },
//       {
//         id: "4",
//         name: "Cherry tomatoes",
//         amount: "200",
//         unit: "g",
//         category: "Vegetables",
//       },
//       {
//         id: "5",
//         name: "Feta cheese",
//         amount: "100",
//         unit: "g",
//         category: "Dairy",
//       },
//       {
//         id: "6",
//         name: "Hummus",
//         amount: "4",
//         unit: "tbsp",
//         category: "Pantry",
//       },
//     ],
//     instructions: [
//       "Marinate chicken in olive oil, lemon, and oregano.",
//       "Cook quinoa according to package instructions.",
//       "Grill chicken until cooked through, then slice.",
//       "Dice cucumber and halve tomatoes.",
//       "Assemble bowls with quinoa, chicken, vegetables, feta, and hummus.",
//     ],
//   },
//   {
//     id: "5",
//     title: "Overnight Oats with Berries",
//     image:
//       "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&q=80",
//     cookTime: "5 mins + overnight",
//     chef: {
//       name: "Emily Rose",
//       avatar:
//         "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
//     },
//     isTopRated: false,
//     category: ["Make-ahead breakfasts", "New recipes"],
//     servings: 2,
//     description:
//       "Creamy overnight oats topped with fresh berries and a drizzle of honey.",
//     difficulty: "easy",
//     dietaryTags: ["vegetarian", "high-fiber"],
//     nutrition: { calories: 320, protein: 12, carbs: 52, fat: 8 },
//     ingredients: [
//       {
//         id: "1",
//         name: "Rolled oats",
//         amount: "100",
//         unit: "g",
//         category: "Grains",
//       },
//       { id: "2", name: "Milk", amount: "200", unit: "ml", category: "Dairy" },
//       {
//         id: "3",
//         name: "Greek yogurt",
//         amount: "100",
//         unit: "g",
//         category: "Dairy",
//       },
//       {
//         id: "4",
//         name: "Mixed berries",
//         amount: "150",
//         unit: "g",
//         category: "Fruit",
//       },
//       { id: "5", name: "Honey", amount: "2", unit: "tbsp", category: "Pantry" },
//       {
//         id: "6",
//         name: "Chia seeds",
//         amount: "1",
//         unit: "tbsp",
//         category: "Pantry",
//       },
//     ],
//     instructions: [
//       "Combine oats, milk, yogurt, and chia seeds in a jar.",
//       "Stir well, cover, and refrigerate overnight.",
//       "In the morning, stir and add more milk if needed.",
//       "Top with fresh berries and drizzle with honey.",
//       "Add any additional toppings like nuts or coconut.",
//     ],
//   },
//   {
//     id: "6",
//     title: "Spicy Korean Beef Bowls",
//     image:
//       "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
//     cookTime: "25 mins",
//     chef: {
//       name: "David Kim",
//       avatar:
//         "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
//     },
//     isTopRated: true,
//     category: ["Dinner"],
//     servings: 4,
//     description:
//       "Quick and delicious Korean-inspired beef bowls with gochujang sauce.",
//     difficulty: "medium",
//     dietaryTags: ["high-protein"],
//     nutrition: { calories: 580, protein: 35, carbs: 55, fat: 24 },
//     ingredients: [
//       {
//         id: "1",
//         name: "Beef mince",
//         amount: "500",
//         unit: "g",
//         category: "Beef",
//       },
//       {
//         id: "2",
//         name: "Gochujang paste",
//         amount: "3",
//         unit: "tbsp",
//         category: "Pantry",
//       },
//       {
//         id: "3",
//         name: "Jasmine rice",
//         amount: "300",
//         unit: "g",
//         category: "Grains",
//       },
//       {
//         id: "4",
//         name: "Cucumber",
//         amount: "1",
//         unit: "",
//         category: "Vegetables",
//       },
//       { id: "5", name: "Eggs", amount: "4", unit: "", category: "Eggs" },
//       {
//         id: "6",
//         name: "Kimchi",
//         amount: "100",
//         unit: "g",
//         category: "Fermented",
//       },
//     ],
//     instructions: [
//       "Cook rice according to package instructions.",
//       "Brown beef mince with garlic and ginger.",
//       "Add gochujang, soy sauce, and sesame oil.",
//       "Fry eggs sunny-side up.",
//       "Assemble bowls with rice, beef, pickled cucumber, egg, and kimchi.",
//     ],
//   },
//   {
//     id: "7",
//     title: "Thai Green Curry",
//     image:
//       "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80",
//     cookTime: "35 mins",
//     chef: {
//       name: "Priya Sharma",
//       avatar:
//         "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
//     },
//     isTopRated: false,
//     category: ["Dinner", "New recipes"],
//     servings: 4,
//     description:
//       "Aromatic Thai green curry with tender chicken and vegetables.",
//     difficulty: "medium",
//     dietaryTags: ["gluten-free", "dairy-free"],
//     nutrition: { calories: 450, protein: 28, carbs: 22, fat: 28 },
//     ingredients: [
//       {
//         id: "1",
//         name: "Chicken thighs",
//         amount: "600",
//         unit: "g",
//         category: "Poultry",
//       },
//       {
//         id: "2",
//         name: "Green curry paste",
//         amount: "4",
//         unit: "tbsp",
//         category: "Pantry",
//       },
//       {
//         id: "3",
//         name: "Coconut milk",
//         amount: "400",
//         unit: "ml",
//         category: "Pantry",
//       },
//       {
//         id: "4",
//         name: "Thai basil",
//         amount: "1",
//         unit: "bunch",
//         category: "Herbs",
//       },
//       {
//         id: "5",
//         name: "Bamboo shoots",
//         amount: "200",
//         unit: "g",
//         category: "Vegetables",
//       },
//       {
//         id: "6",
//         name: "Fish sauce",
//         amount: "2",
//         unit: "tbsp",
//         category: "Pantry",
//       },
//     ],
//     instructions: [
//       "Fry curry paste in coconut cream until fragrant.",
//       "Add chicken and cook until sealed.",
//       "Pour in remaining coconut milk and simmer.",
//       "Add bamboo shoots and vegetables.",
//       "Finish with fish sauce, palm sugar, and Thai basil.",
//     ],
//   },
//   {
//     id: "8",
//     title: "Avocado Toast with Poached Eggs",
//     image:
//       "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
//     cookTime: "15 mins",
//     chef: {
//       name: "Lisa Green",
//       avatar:
//         "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&q=80",
//     },
//     isTopRated: true,
//     category: ["Make-ahead breakfasts", "Easy lunches"],
//     servings: 2,
//     description: "Classic avocado toast elevated with perfectly poached eggs.",
//     difficulty: "easy",
//     dietaryTags: ["vegetarian", "high-protein"],
//     nutrition: { calories: 380, protein: 16, carbs: 28, fat: 24 },
//     ingredients: [
//       {
//         id: "1",
//         name: "Sourdough bread",
//         amount: "4",
//         unit: "slices",
//         category: "Bread",
//       },
//       {
//         id: "2",
//         name: "Ripe avocados",
//         amount: "2",
//         unit: "",
//         category: "Vegetables",
//       },
//       { id: "3", name: "Eggs", amount: "4", unit: "", category: "Eggs" },
//       {
//         id: "4",
//         name: "Chili flakes",
//         amount: "1",
//         unit: "tsp",
//         category: "Spices",
//       },
//       { id: "5", name: "Lemon", amount: "1", unit: "", category: "Citrus" },
//       {
//         id: "6",
//         name: "Microgreens",
//         amount: "1",
//         unit: "handful",
//         category: "Vegetables",
//       },
//     ],
//     instructions: [
//       "Toast sourdough until golden and crispy.",
//       "Mash avocados with lemon juice, salt, and pepper.",
//       "Bring water to a gentle simmer for poaching.",
//       "Create a whirlpool and drop in eggs one at a time.",
//       "Spread avocado on toast, top with egg, chili flakes, and microgreens.",
//     ],
//   },
// ];

export const categories = [
  "Dinner, sorted",
  "New recipes",

  "Packed lunches",
  "Make-ahead breakfasts",
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
