import { Box } from "@mui/material";

export function StickyNoteGhost({ x, y }: { x: number; y: number }) {
  return (
    <Box
      sx={{
        position: "fixed",
        transform: `translate3d(${x}px, ${y}px, 0)`,
        width: 220,
        height: 160,
        backgroundColor: "rgba(255,243,176,0.75)",
        borderRadius: 1,
        boxShadow: 6,
        pointerEvents: "none",
        zIndex: 1300,
      }}
    />
  );
}
