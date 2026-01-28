import { createTheme } from '@mui/material/styles';

// Warm lime color palette matching the existing design
const theme = createTheme({
  palette: {
    primary: {
      main: '#C8D96F', // Lime accent
      contrastText: '#1f1a14',
    },
    secondary: {
      main: '#1f1a14', // Dark foreground
      contrastText: '#f9f7f4',
    },
    background: {
      default: '#f9f7f4', // Warm cream
      paper: '#ffffff',
    },
    text: {
      primary: '#1f1a14',
      secondary: '#6b6560',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    success: {
      main: '#10b981',
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: {
      fontFamily: '"Fraunces", serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Fraunces", serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Fraunces", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Fraunces", serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Fraunces", serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Fraunces", serif',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 24,
          fontWeight: 500,
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#b8c95f',
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: '#2f2a24',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px -2px rgba(31, 26, 20, 0.08), 0 4px 16px -4px rgba(31, 26, 20, 0.12)',
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
          borderRadius: '16px 0 0 16px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(249, 247, 244, 0.95)',
          backdropFilter: 'blur(8px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(31, 26, 20, 0.1)',
        },
      },
    },
  },
});

export default theme;
