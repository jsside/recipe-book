import { createTheme } from "@mui/material/styles";
import { THEME_COLORS } from "./colors";
import { THEME_TYPOGRAPHY } from "./typography";
import { THEME_SHAPES } from "./shapes";

// Warm lime color palette matching the existing design
const theme = createTheme({
  palette: {
    ...THEME_COLORS,
  },
  typography: {
    ...THEME_TYPOGRAPHY,
  },
  shape: {
    ...THEME_SHAPES,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 24,
          fontWeight: 500,
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#b8c95f",
          },
        },
        containedSecondary: {
          "&:hover": {
            backgroundColor: "#2f2a24",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow:
            "0 2px 8px -2px rgba(31, 26, 20, 0.08), 0 4px 16px -4px rgba(31, 26, 20, 0.12)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          fontWeight: 500,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: "16px 0 0 16px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(249, 247, 244, 0.95)",
          backdropFilter: "blur(8px)",
          boxShadow: "none",
          borderBottom: "1px solid rgba(31, 26, 20, 0.1)",
        },
      },
    },
  },
});

export default theme;
