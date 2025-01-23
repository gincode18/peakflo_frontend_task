"use client";

import { useTaskStore } from "../store/tasks";
import type { Status, Priority } from "../types/task";
import {
  Container,
  Paper,
  TextField,
  Button,
  Stack,
  MenuItem,
  Box,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Comments } from "./comments";
import { useNavigate, useParams } from "react-router-dom";

export default function TaskPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { tasks, columns, updateTask, deleteTask } = useTaskStore();
  const task = tasks.find((t) => t.id === params.id);

  if (!task) {
    return <Typography variant="h6">Task not found</Typography>;
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id);
      navigate("/");
    }
  };

  return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h4" gutterBottom>
                  Task Details
                </Typography>
                <Chip label={task.status} color="primary" />
              </Box>
              <TextField
                label="Title"
                value={task.title}
                onChange={(e) => updateTask(task.id, { title: e.target.value })}
                fullWidth
                variant="outlined"
              />
              <TextField
                select
                label="Status"
                value={task.status}
                onChange={(e) =>
                  updateTask(task.id, { status: e.target.value as Status })
                }
                fullWidth
                variant="outlined"
              >
                {columns.map((column) => (
                  <MenuItem key={column.id} value={column.id}>
                    {column.title}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Description"
                value={task.description}
                onChange={(e) =>
                  updateTask(task.id, { description: e.target.value })
                }
                multiline
                rows={4}
                fullWidth
                variant="outlined"
              />
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={task.priority}
                  onChange={(e) =>
                    updateTask(task.id, {
                      priority: e.target.value as Priority,
                    })
                  }
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
              <DatePicker
                label="Due Date"
                value={task.dueDate ? new Date(task.dueDate) : null}
                onChange={(newValue) =>
                  updateTask(task.id, {
                    dueDate: newValue ? newValue.toISOString() : null,
                  })
                }
                // renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <Comments taskId={task.id} comments={task.comments} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate("/")}
                >
                  Back to Board
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                >
                  Delete Task
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </LocalizationProvider>
  );
}
