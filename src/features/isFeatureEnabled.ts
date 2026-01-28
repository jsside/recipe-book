import { Features } from ".";

export const isFeatureEnabled = (feature: string) => {
  return Features[feature];
};

export function insertIf(condition: boolean, obj: any) {
  return condition ? obj : [];
}
