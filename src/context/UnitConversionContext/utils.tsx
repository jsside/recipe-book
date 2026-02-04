import { createContext, useContext } from "react";
import { UnitConversionContextType } from "./interfaces";

export const UnitConversionContext = createContext<
  UnitConversionContextType | undefined
>(undefined);

export function useUnitConversion() {
  const context = useContext(UnitConversionContext);
  if (!context) {
    throw new Error(
      "useUnitConversion must be used within a UnitConversionProvider",
    );
  }
  return context;
}
