import { Box, styled } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { type PlacementState } from "./interfaces";
import { StickyNoteGhost } from "./StickyNoteGhost";
import { StickyNote2Outlined } from "@mui/icons-material";

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

function StickyNoteLauncherButton({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  return (
    <StickyNoteBox onClick={onClick}>
      <StickyNote2Outlined
        className="StickyNoteLauncher--button"
        sx={{ color: "transparent" }}
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
  const isPlacing = !!placement;
  const ignoreNextClick = useRef(false);

  const startPlacement = (e: React.MouseEvent) => {
    ignoreNextClick.current = true;
    setPlacement({ active: true, x: e.clientX + 8, y: e.clientY + 8 });
  };

  // Track mouse movement only while placing
  useEffect(() => {
    if (!isPlacing) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPlacement((prev) =>
        prev ? { ...prev, x: e.clientX - 110, y: e.clientY - 80 } : prev,
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isPlacing]);

  // Place or cancel
  const onCreateRef = useRef(onCreate);
  onCreateRef.current = onCreate;

  useEffect(() => {
    if (!isPlacing) return;

    const handleClick = () => {
      if (ignoreNextClick.current) {
        ignoreNextClick.current = false;
        return;
      }
      setPlacement((prev) => {
        if (prev) onCreateRef.current(prev.x, prev.y);
        return null;
      });
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPlacement(null);
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isPlacing]);

  return (
    <>
      <StickyNoteLauncherButton onClick={() => {}} />
      <StickyNoteBox onClick={startPlacement}>
        <StickyNote2Outlined
          className="StickyNoteLauncher--button"
          sx={{ color: "transparent" }}
        />
      </StickyNoteBox>
      {placement && <StickyNoteGhost x={placement.x} y={placement.y} />}
    </>
  );
}