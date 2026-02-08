import { Box } from "@mui/material";
import { ReactNode } from "react";

// TODO [blocking]: update so can scroll on mouse drag as well.
// Example: https://cabagges.world/
export const HorizontalScrollRail = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        scrollSnapType: "x mandatory",
        scrollPaddingLeft: {
          xs: 16,
          sm: 24,
          md: "calc((100vw - 1200px) / 2)",
        },

        /* ⬇️ alignment at rest */
        pl: {
          xs: 2,
          sm: 3,
          md: "calc((100vw - 1200px) / 2)",
        },

        /* ⬇️ no right cutoff */
        pr: 2,

        /* ⬇️ hide scrollbar */
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {children}
    </Box>
  );
};
