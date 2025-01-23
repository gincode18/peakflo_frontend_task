import { createTheme } from "@mui/material/styles"
import { blue, purple } from "@mui/material/colors"

const commonThemeOptions = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          variants: [],
        },
      },
    },
  },
}

export const lightTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: "light",
    primary: blue,
    secondary: purple,
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
})

export const darkTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: "dark",
    primary: blue,
    secondary: purple,
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
})

