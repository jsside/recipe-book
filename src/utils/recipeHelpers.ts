import { Recipe } from "@/data/recipes";

/**
 * Check if a recipe was added within the last 30 days
 */
export function isNewRecipe(recipe: Recipe): boolean {
  if (!recipe.createdAt) return false;

  const createdDate = new Date(recipe.createdAt);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return createdDate >= thirtyDaysAgo;
}

/**
 * Get all categories for a recipe, including auto-generated "New recipes" category
 */
export function getRecipeCategories(recipe: Recipe): string[] {
  const categories = [...(recipe.category || [])];

  // Add "New" automatically if recipe is less than 30 days old
  if (isNewRecipe(recipe)) {
    return ["New", ...categories];
  }

  return categories;
}

/**
 * Parse cook time string to extract minutes
 */
export function parseCookTime(cookTime: string): number {
  const match = cookTime.match(/(\d+)\s*(min|hour|hr)/i);
  if (!match) return 0;

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  if (unit.startsWith("hour") || unit === "hr") {
    return value * 60;
  }

  return value;
}

/**
 * Format cook time for display
 */
export function formatCookTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} mins`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;

  if (remainingMins === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  return `${hours}h ${remainingMins}m`;
}
