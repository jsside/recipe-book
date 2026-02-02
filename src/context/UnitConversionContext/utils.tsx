import { useContext } from "react";
import { UnitConversionContext } from "./index";

export function useUnitConversion() {
  const context = useContext(UnitConversionContext);
  if (!context) {
    throw new Error(
      "useUnitConversion must be used within a UnitConversionProvider",
    );
  }
  return context;
}
