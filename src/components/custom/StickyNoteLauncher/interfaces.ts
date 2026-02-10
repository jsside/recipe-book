export type PlacementState =
  | { active: false }
  | {
      active: true;
      x: number;
      y: number;
    };
