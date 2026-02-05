import { useState, useCallback, useMemo, ReactNode } from "react";
import { UnitSystem } from "./interfaces";
import { UnitConversionContext } from "./utils";

export type { UnitSystem } from "./interfaces";

interface ConversionRule {
  from: string;
  to: string;
  factor: number;
}

const metricToImperial: ConversionRule[] = [
  { from: "g", to: "oz", factor: 0.035274 },
  { from: "kg", to: "lb", factor: 2.20462 },
  { from: "ml", to: "fl oz", factor: 0.033814 },
  { from: "l", to: "qt", factor: 1.05669 },
];

const imperialToMetric: ConversionRule[] = [
  { from: "oz", to: "g", factor: 28.3495 },
  { from: "lb", to: "kg", factor: 0.453592 },
  { from: "fl oz", to: "ml", factor: 29.5735 },
  { from: "qt", to: "l", factor: 0.946353 },
  { from: "cup", to: "ml", factor: 236.588 },
  { from: "cups", to: "ml", factor: 236.588 },
];

export function UnitConversionProvider({ children }: { children: ReactNode }) {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");

  const toggleUnitSystem = useCallback(() => {
    setUnitSystem((prev) => (prev === "metric" ? "imperial" : "metric"));
  }, []);

  const convertAmount = useCallback(
    (amount: string, unit: string): { amount: string; unit: string } => {
      const numericAmount = parseFloat(amount);

      if (isNaN(numericAmount)) {
        return { amount, unit };
      }

      const conversions =
        unitSystem === "imperial" ? metricToImperial : imperialToMetric;
      const rule = conversions.find((r) => r.from === unit.toLowerCase());

      if (rule) {
        const convertedAmount = numericAmount * rule.factor;
        const rounded =
          convertedAmount < 10
            ? Math.round(convertedAmount * 10) / 10
            : Math.round(convertedAmount);
        return { amount: String(rounded), unit: rule.to };
      }

      return { amount, unit };
    },
    [unitSystem],
  );

  const formatIngredient = useCallback(
    (amount: string, unit: string, name: string): string => {
      const converted = convertAmount(amount, unit);
      if (converted.unit) {
        return `${converted.amount} ${converted.unit} ${name}`;
      }
      return `${converted.amount} ${name}`;
    },
    [convertAmount],
  );

  const value = useMemo(
    () => ({
      unitSystem,
      setUnitSystem,
      toggleUnitSystem,
      convertAmount,
      formatIngredient,
    }),
    [unitSystem, toggleUnitSystem, convertAmount, formatIngredient],
  );

  return (
    <UnitConversionContext.Provider value={value}>
      {children}
    </UnitConversionContext.Provider>
  );
}
