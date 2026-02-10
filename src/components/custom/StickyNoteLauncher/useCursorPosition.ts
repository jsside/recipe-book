import { useEffect, useState } from "react";

export function useCursorPosition(enabled: boolean) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const handler = (e: MouseEvent) => {
      setPos({ x: e.clientX - 110, y: e.clientY - 80 });
    };

    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [enabled]);

  return pos;
}
