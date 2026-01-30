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
          borderRadius: 8,
          fontWeight: 500,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#1e7a1e",
          },
        },
        containedSecondary: {
          "&:hover": {
            backgroundColor: "#333333",
          },
        },
        outlined: {
          borderWidth: 1,
          "&:hover": {
            borderWidth: 1,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "none",
          border: "1px solid rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(248, 247, 244, 0.98)",
          backdropFilter: "blur(8px)",
          boxShadow: "none",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        elevation0: {
          boxShadow: "none",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
