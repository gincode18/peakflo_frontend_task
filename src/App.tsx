import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import TaskBoard from "./components/TaskBoard"
// import TaskPage from "./components/TaskPage"

const theme = createTheme({
  palette: {
    mode: "light",
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<TaskBoard />} />
          {/* <Route path="/task/:id" element={<TaskPage />} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App

