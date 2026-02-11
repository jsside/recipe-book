import * as React from "react";
import { Box, Paper, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDrag } from "@use-gesture/react";
import { StickyNoteProps } from "./interfaces";
import { useUpdateUserNote } from "@/hooks/useUpdateUserNote";
import { useState } from "react";
import { useDeleteUserNote } from "@/hooks/useDeleteUserNote";

// TODO: on create, should be highest. figure out best way to do this.
export const BASE_STICKY_ZINDEX = 1000;
// TODO: add resize
// allow change color on right click. should have own menu.
// copy, paste, duplicate, change color,
// add visual indicator for how to save and edit

export function StickyNoteContainer(note: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState(note.content);
  const [isDirty, setIsDirty] = useState(false);

  const updateNote = useUpdateUserNote();
  const deleteNote = useDeleteUserNote();

  const lastPosition = React.useRef({ x: note.x, y: note.y });
  const isSaving = updateNote.isPending;

  // Sync from server only when NOT editing
  React.useEffect(() => {
    if (!isEditing && note.content !== draftContent) {
      setDraftContent(note.content);
      setIsDirty(false);
    }
  }, [note.content, isEditing, draftContent]);

  const commitContent = () => {
    if (!isEditing || !isDirty) return;

    updateNote.mutate({
      id: note.id,
      content: draftContent,
      z_index: note.zIndex + 1,
    });

    setIsEditing(false);
    setIsDirty(false);
  };

  return (
    <StickyNote
      {...note}
      content={draftContent}
      isSaving={isSaving}
      onClick={() => setIsEditing(true)}
      onKeyDown={(e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
          commitContent();
        }
        if (e.key === "Escape") {
          setIsEditing(false);
          setDraftContent(note.content);
          setIsDirty(false);
        }
      }}
      onChangeContent={(v) => {
        setDraftContent(v);
        setIsDirty(true);
      }}
      onMoveEnd={({ x, y }) => {
        if (isEditing) return;

        const dx = Math.abs(x - lastPosition.current.x);
        const dy = Math.abs(y - lastPosition.current.y);

        // Ignore clicks / tiny jitter
        if (dx < 2 && dy < 2) {
          return;
        }

        lastPosition.current = { x, y };

        updateNote.mutate({
          id: note.id,
          position_x: x,
          position_y: y,
          z_index: note.zIndex + 1,
        });
      }}
      onDelete={() => deleteNote.mutate(note.id)}
    />
  );
}

export function StickyNote({
  content,
  color = "yellow",
  x,
  y,
  zIndex = 1,
  isSaving,
  onClick,
  onKeyDown,
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

        {isSaving && (
          <Box
            sx={{
              position: "absolute",
              bottom: 6,
              right: 8,
              fontSize: 12,
              opacity: 0.6,
            }}
          >
            Saving…
          </Box>
        )}

        <TextField
          multiline
          fullWidth
          variant="standard"
          value={content}
          onKeyDown={onKeyDown}
          onChange={(e) => onChangeContent?.(e.target.value)}
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: 14,
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        />
      </Paper>
    </Box>
  );
}
