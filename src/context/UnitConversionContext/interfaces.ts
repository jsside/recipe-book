export type UnitSystem = "metric" | "imperial";

export interface UnitConversionContextType {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  toggleUnitSystem: () => void;
  convertAmount: (
    amount: string,
    unit: string,
  ) => { amount: string; unit: string };
  formatIngredient: (amount: string, unit: string, name: string) => string;
}
