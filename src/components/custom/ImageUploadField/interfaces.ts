export interface ImageUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export interface ImageItemProps {
  image: string;
  index: number;
  isPrimary: boolean;
  canRemove: boolean;
  onRemove: () => void;
  onChange: (value: string) => void;
}
