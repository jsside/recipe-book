import { ReactNode } from "react";

export interface InstructionStepProps {
  stepNumber: number;
  instruction: ReactNode;
  isActive: boolean;
  onClick: () => void;
}
