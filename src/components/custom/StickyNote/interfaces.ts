export type StickyNoteProps = {
  id: string;
  content: string;
  color?: StickyNoteColors;

  x: number;
  y: number;
  zIndex?: number;

  onMoveEnd?: (pos: { x: number; y: number }) => void;
  onResizeEnd?: (size: { width: number; height: number }) => void;
  onChangeContent?: (content: string) => void;
  onDelete?: () => void;
};

export type StickyNoteColors = "yellow" | "green" | "red" | "purple" | "blue";
