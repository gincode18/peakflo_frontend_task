import { useNavigate, useParams } from "react-router-dom"
import { useTaskStore } from "../store/tasks"
import type { Status } from "../types/task"
import { Container, Paper, TextField, Button, Stack, MenuItem, Box } from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

const theme = createTheme({
  palette: {
    mode: "light",
  },
})

// const statuses: { value: Status; label: string }[] = [
//   { value: "not-started", label: "Not Started" },
//   { value: "in-progress", label: "In Progress" },
//   { value: "completed", label: "Completed" },
// ]

export default function TaskPage() {
  const params = useParams()
  const navigate = useNavigate()
  const { tasks, columns, updateTask, deleteTask } = useTaskStore()
  const task = tasks.find((t:any) => t.id === params.id)

  if (!task) {
    return <div>Task not found</div>
  }

  const handleDelete = () => {
    deleteTask(task.id)
    navigate("/")
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Stack spacing={3}>
            <TextField
              label="Title"
              value={task.title}
              onChange={(e) => updateTask(task.id, { title: e.target.value })}
              fullWidth
            />
            <TextField
              select
              label="Status"
              value={task.status}
              onChange={(e) => updateTask(task.id, { status: e.target.value as Status })}
              fullWidth
            >
              {columns.map((column:any) => (
                <MenuItem key={column.id} value={column.id}>
                  {column.title}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Description"
              value={task.description}
              onChange={(e) => updateTask(task.id, { description: e.target.value })}
              multiline
              rows={4}
              fullWidth
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="outlined" onClick={() => navigate("/")}>
                Back
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete Task
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </ThemeProvider>
  )
}

