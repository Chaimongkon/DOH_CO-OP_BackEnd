"use client";
import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Switch from "@mui/material/Switch";

import '../../styles/global.css';

const darkTheme = createTheme({
  direction: "ltr",
  palette: {
    mode: "dark",
    primary: {
      main: "#ffffff",
      light: "#bb86fc",
      dark: "#bb86fc",
    },
    secondary: {
      main: "#03dac6",
      light: "#03dac6",
      dark: "#018786",
    },
    success: {
      main: "#4caf50",
      light: "#dff0d8",
      dark: "#388e3c",
      contrastText: "#ffffff",
    },
    info: {
      main: "#2196f3",
      light: "#bbdefb",
      dark: "#1976d2",
      contrastText: "#ffffff",
    },
    error: {
      main: "#f44336",
      light: "#ffccd2",
      dark: "#d32f2f",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ff9800",
      light: "#ffe0b2",
      dark: "#f57c00",
      contrastText: "#ffffff",
    },
    grey: {
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
    text: {
      primary: "#ffffff",
      secondary: "#ffffff",
    },
    action: {
      disabledBackground: "rgba(255, 255, 255, 0.12)",
      hoverOpacity: 0.08,
      hover: "#333",
    },
    divider: "#757575",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
  typography: {
    fontFamily: 'Mitr, sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: "2.25rem",
      lineHeight: "2.75rem",
      fontFamily: 'Mitr, sans-serif',
    },
    h2: {
      fontWeight: 600,
      fontSize: "1.875rem",
      lineHeight: "2.25rem",
      fontFamily: 'Mitr, sans-serif',
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: "1.75rem",
      fontFamily: 'Mitr, sans-serif',
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.3125rem",
      lineHeight: "1.6rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: "1.6rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: "1.2rem",
    },
    button: {
      textTransform: "capitalize",
      fontWeight: 400,
    },
    body1: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: "1.334rem",
    },
    body2: {
      fontSize: "0.75rem",
      letterSpacing: "0rem",
      fontWeight: 400,
      lineHeight: "1rem",
    },
    subtitle1: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ".MuiPaper-elevation9, .MuiPopover-root .MuiPaper-elevation": {
          boxShadow: "0 9px 17.5px rgb(0,0,0,0.05) !important",
        },
        ".rounded-bars .apexcharts-bar-series.apexcharts-plot-series .apexcharts-series path":
          {
            clipPath: "inset(0 0 5% 0 round 20px)",
          },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "18px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          boxShadow: "none",
          borderRadius: "25px",
        },
        text: {
          padding: "5px 15px",
        },
      },
    },
  },
});

export {  darkTheme };
