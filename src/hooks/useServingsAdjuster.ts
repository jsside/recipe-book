import { useState, useCallback, useMemo } from "react";
import { Ingredient } from "@/data/recipes";

export interface UseServingsAdjusterReturn {
  adjustedServings: number;
  scaleFactor: number;
  incrementServings: () => void;
  decrementServings: () => void;
  setServings: (value: number) => void;
  scaleIngredient: (ingredient: Ingredient) => {
    amount: string;
    unit: string;
    name: string;
  };
}

export function useServingsAdjuster(
  originalServings: number,
): UseServingsAdjusterReturn {
  const [adjustedServings, setAdjustedServings] = useState(originalServings);

  const scaleFactor = useMemo(() => {
    return adjustedServings / originalServings;
  }, [adjustedServings, originalServings]);

  const incrementServings = useCallback(() => {
    setAdjustedServings((prev) => prev + 1);
  }, []);

  const decrementServings = useCallback(() => {
    setAdjustedServings((prev) => Math.max(1, prev - 1));
  }, []);

  const setServings = useCallback((value: number) => {
    setAdjustedServings(Math.max(1, value));
  }, []);

  const scaleIngredient = useCallback(
    (ingredient: Ingredient) => {
      const originalAmount = parseFloat(ingredient.amount);

      if (isNaN(originalAmount)) {
        return {
          amount: ingredient.amount,
          unit: ingredient.unit,
          name: ingredient.name,
        };
      }

      const scaledAmount = originalAmount * scaleFactor;

      // Format the number nicely (remove trailing zeros, max 2 decimal places)
      let formattedAmount: string;
      if (scaledAmount === Math.floor(scaledAmount)) {
        formattedAmount = scaledAmount.toString();
      } else {
        formattedAmount = scaledAmount.toFixed(2).replace(/\.?0+$/, "");
      }

      return {
        amount: formattedAmount,
        unit: ingredient.unit,
        name: ingredient.name,
      };
    },
    [scaleFactor],
  );

  return {
    adjustedServings,
    scaleFactor,
    incrementServings,
    decrementServings,
    setServings,
    scaleIngredient,
  };
}
