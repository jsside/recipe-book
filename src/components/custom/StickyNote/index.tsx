import * as React from "react";
import { Box, Paper, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDrag } from "@use-gesture/react";
import { StickyNoteProps } from "./interfaces";

// TODO: add resize
// allow change color on right click. should have own menu.
// copy, paste, duplicate, change color,
export function StickyNote({
  content,
  color = "yellow",
  x,
  y,
  zIndex = 1,
  onMoveEnd,
  onChangeContent,
  onDelete,
}: StickyNoteProps) {
  const [{ dx, dy }, setOffset] = React.useState({ dx: 0, dy: 0 });

  const bind = useDrag(
    ({ down, movement: [mx, my] }) => {
      if (down) {
        setOffset({ dx: mx, dy: my });
      } else {
        setOffset({ dx: 0, dy: 0 });
        onMoveEnd?.({ x: x + mx, y: y + my });
      }
    },
    { filterTaps: true },
  );

  return (
    <Box
      {...bind()}
      sx={{
        position: "absolute",
        transform: `translate3d(${x + dx}px, ${y + dy}px, 0)`,
        zIndex,
        touchAction: "none",
        cursor: "grab",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 220,
          minHeight: 160,
          backgroundColor: `components.stickyNote.${color}`,
          p: 1.5,
          borderRadius: 0,
          cursor: "inherit",
          userSelect: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box sx={{ fontWeight: 600, fontSize: 12 }}>Note</Box>
          <IconButton size="small" onClick={onDelete}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <TextField
          multiline
          fullWidth
          variant="standard"
          value={content}
          onChange={(e) => onChangeContent?.(e.target.value)}
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: 14,
            },
          }}
        />
      </Paper>
    </Box>
  );
}
