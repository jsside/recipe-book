import { Features } from ".";

export const isFeatureEnabled = (feature: string) => {
  return Features[feature];
};

export function insertIf(condition: boolean, obj: unknown) {
  return condition ? obj : [];
}
