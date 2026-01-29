import React from "react";
import { Typography } from "@mui/material";
import { Ingredient } from "@/data/recipes";

/**
 * Parse instruction text and bold ingredient names with their measurements in parentheses.
 * Example: "Add the garlic" -> "Add the **garlic (2 cloves)**"
 */
export function parseInstructionWithIngredients(
  instruction: string,
  ingredients: Ingredient[],
  convertAmount?: (
    amount: string,
    unit: string,
  ) => { amount: string; unit: string },
  scaleIngredient?: (ingredient: Ingredient) => {
    amount: string;
    unit: string;
    name: string;
  },
): React.ReactNode {
  if (!ingredients.length) {
    return instruction;
  }

  // Sort ingredients by name length (longest first) to avoid partial matches
  const sortedIngredients = [...ingredients].sort(
    (a, b) => b.name.length - a.name.length,
  );

  // Create a regex pattern for all ingredient names (case-insensitive)
  const ingredientNames = sortedIngredients.map((ing) =>
    ing.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const pattern = new RegExp(`\\b(${ingredientNames.join("|")})\\b`, "gi");

  // Track which ingredients have been mentioned to avoid duplicate measurements
  const mentionedIngredients = new Set<string>();

  // Split the instruction by ingredient matches
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  const regex = new RegExp(pattern);
  while ((match = regex.exec(instruction)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(instruction.slice(lastIndex, match.index));
    }

    const matchedName = match[0];
    const ingredient = sortedIngredients.find(
      (ing) => ing.name.toLowerCase() === matchedName.toLowerCase(),
    );

    if (
      ingredient &&
      !mentionedIngredients.has(ingredient.name.toLowerCase())
    ) {
      mentionedIngredients.add(ingredient.name.toLowerCase());

      // Get scaled and converted amounts
      let displayAmount = ingredient.amount;
      let displayUnit = ingredient.unit;

      if (scaleIngredient) {
        const scaled = scaleIngredient(ingredient);
        displayAmount = scaled.amount;
        displayUnit = scaled.unit;
      }

      if (convertAmount) {
        const converted = convertAmount(displayAmount, displayUnit);
        displayAmount = converted.amount;
        displayUnit = converted.unit;
      }

      // Format measurement string
      const measurement = displayUnit
        ? `${displayAmount} ${displayUnit}`
        : displayAmount;

      parts.push(
        <React.Fragment key={`${ingredient.id}-${match.index}`}>
          <Typography component="span" sx={{ fontWeight: 700 }}>
            {matchedName}
          </Typography>
          <Typography
            component="span"
            sx={{ color: "text.secondary", fontWeight: 400 }}
          >
            {" "}
            ({measurement})
          </Typography>
        </React.Fragment>,
      );
    } else {
      // Already mentioned or not found, just bold the name
      parts.push(
        <Typography
          component="span"
          sx={{ fontWeight: 700 }}
          key={`bold-${match.index}`}
        >
          {matchedName}
        </Typography>,
      );
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < instruction.length) {
    parts.push(instruction.slice(lastIndex));
  }

  return parts.length > 0 ? parts : instruction;
}
