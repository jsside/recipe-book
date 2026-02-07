export interface InstructionFormStep {
  text: string;
  timer?: number;
}

export interface InstructionGroupFormItem {
  heading: string;
  steps: InstructionFormStep[];
}

export interface InstructionGroupFormProps {
  groups: InstructionGroupFormItem[];
  onChange: (groups: InstructionGroupFormItem[]) => void;
}
