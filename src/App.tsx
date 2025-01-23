import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import TaskBoard from "./components/task-board";
import TaskPage from "./components/task-page";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useMediaQuery,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { lightTheme, darkTheme } from "./lib/theme";
import { useEffect, useState } from "react";


function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    setIsDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Kanban Board
          </Typography>
          <IconButton color="inherit" onClick={toggleTheme}>
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          mt: 2,
          bgcolor: "background.default",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<TaskBoard />} />
            <Route path="/task/:id" element={<TaskPage />} />
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
