import { Box, styled } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { type PlacementState } from "./interfaces";
import { StickyNoteGhost } from "./StickyNoteGhost";
import { useCursorPosition } from "./useCursorPosition";
import { StickyNote2Outlined } from "@mui/icons-material";

// TODO
// [fix]: resize not working
// [fix]: shouldn't be able to click under the postit
const StickyNoteBox = styled(Box)(() => ({
  position: "fixed",

  right: 0,
  height: "100vh",
  width: 48,
  zIndex: 1200,

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  borderLeft: "1px solid transparent",
  cursor: "pointer",

  transition: "all 200ms ease",

  "&:hover": {
    borderLeft: "1px solid rgba(0,0,0,0.3)",
    backgroundColor: "rgba(0,0,0,0.03)",
    ".StickyNoteLauncher--button": {
      color: "rgba(0,0,0,0.5)",
    },
  },
}));

function StickyNoteLauncherButton({ onClick }: { onClick: () => void }) {
  return (
    <StickyNoteBox onClick={onClick}>
      <StickyNote2Outlined
        className="StickyNoteLauncher--button"
        sx={{
          color: "transparent",
        }}
      />
    </StickyNoteBox>
  );
}

export function StickyNoteLauncher({
  onCreate,
}: {
  onCreate: (x: number, y: number) => void;
}) {
  const [placement, setPlacement] = useState<PlacementState | null>(null);
  const cursor = useCursorPosition(!!placement);
  const ignoreNextClick = useRef(false);

  /* Start placement */
  const startPlacement = (e: React.MouseEvent) => {
    ignoreNextClick.current = true;

    setPlacement({
      active: true,
      x: e.clientX + 8,
      y: e.clientY + 8,
    });
  };

  /* Keep ghost synced to cursor */
  useEffect(() => {
    if (!placement) return;

    setPlacement((prev) =>
      prev
        ? {
            ...prev,
            x: cursor.x + 8,
            y: cursor.y + 8,
          }
        : prev,
    );
  }, [cursor.x, cursor.y, placement]);

  /* Place or cancel */
  useEffect(() => {
    if (!placement) return;

    const handleClick = (e: MouseEvent) => {
      if (ignoreNextClick.current) {
        ignoreNextClick.current = false;
        return;
      }

      onCreate(placement.x, placement.y);
      setPlacement(null);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPlacement(null);
      }
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [placement, onCreate]);

  return (
    <>
      <StickyNoteLauncherButton onClick={startPlacement} />

      {placement && <StickyNoteGhost x={placement.x} y={placement.y} />}
    </>
  );
}
