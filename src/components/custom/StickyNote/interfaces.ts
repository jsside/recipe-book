export type StickyNoteProps = {
  id: string;
  content: string;
  color?: StickyNoteColors;

  readOnly: boolean;
  isSaving?: boolean;

  x: number;
  y: number;
  zIndex?: number;

  onClick?: () => void;
  onKeyDown?: (e) => void;
  // onKeyDown?: (e: KeyboardEvent<Element>) => void;
  onBlur?: () => void;
  onMoveEnd?: (pos: { x: number; y: number }) => void;
  onResizeEnd?: (size: { width: number; height: number }) => void;
  onChangeContent?: (content: string) => void;
  onDelete?: () => void;
};

export type StickyNoteColors = "yellow" | "green" | "red" | "purple" | "blue";
