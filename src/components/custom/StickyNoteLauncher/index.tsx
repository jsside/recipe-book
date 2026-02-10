import { Box, styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { type PlacementState } from "./interfaces";
import { StickyNoteGhost } from "./StickyNoteGhost";
import { useCursorPosition } from "./useCursorPosition";

// TODO
// [fix]: position not updating
// [fix]: resize not working
// [feat]: add update content
// [fix]: shouldn't be able to click under the postit
const StickyNoteBox = styled(Box)(() => ({
  position: "fixed",
  top: 0,
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
  },
}));

function StickyNoteLauncherButton({ onClick }: { onClick: () => void }) {
  return (
    <StickyNoteBox onClick={onClick}>
      <AddIcon sx={{ color: "rgba(0,0,0,0.5)" }} />
    </StickyNoteBox>
  );
}
export function StickyNoteLauncher({
  onCreate,
}: {
  onCreate: (x: number, y: number) => void;
}) {
  const [placement, setPlacement] = useState<PlacementState>({
    active: false,
  });

  const cursor = useCursorPosition(placement.active);

  // Place note on click
  useEffect(() => {
    if (!placement.active) return;

    const handleClick = () => {
      onCreate(cursor.x, cursor.y);
      setPlacement({ active: false });
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPlacement({ active: false });
      }
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [placement.active, cursor, onCreate]);

  return (
    <>
      <StickyNoteLauncherButton
        onClick={() => {
          setPlacement({ active: true, ...cursor });
        }}
      />

      {placement.active && <StickyNoteGhost x={cursor.x} y={cursor.y} />}
    </>
  );
}
