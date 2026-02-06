export interface InstructionFormStep {
  tempId: string;
  text: string;
  timer?: number;
}

export interface InstructionGroupFormItem {
  tempId: string;
  heading: string;
  steps: InstructionFormStep[];
}

export interface InstructionGroupFormProps {
  groups: InstructionGroupFormItem[];
  onChange: (groups: InstructionGroupFormItem[]) => void;
}
