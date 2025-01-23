import { Draggable } from "@hello-pangea/dnd"
import { Link } from "react-router-dom"
import type { Task } from "../types/task"
import { Paper, Typography, Chip, Box, useTheme } from "@mui/material"
import { format, isBefore, addDays } from "date-fns"

interface TaskCardProps {
  task: Task
  index: number
}

const priorityColors = {
  low: "#4caf50",
  medium: "#ff9800",
  high: "#f44336",
}

export function TaskCard({ task, index }: TaskCardProps) {
  const theme = useTheme()

  const getDueDateColor = () => {
    if (!task.dueDate) return theme.palette.text.secondary
    const today = new Date()
    const dueDate = new Date(task.dueDate)
    if (isBefore(dueDate, today)) return theme.palette.error.main
    if (isBefore(dueDate, addDays(today, 3))) return theme.palette.warning.main
    return theme.palette.success.main
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Link to={`/task/${task.id}`} style={{ textDecoration: "none" }}>
          <Paper
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            elevation={snapshot.isDragging ? 6 : 1}
            sx={{
              p: 2,
              cursor: "pointer",
              transition: "all 0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
              },
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              {task.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
              {task.description}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Chip
                label={task.priority}
                size="small"
                sx={{ bgcolor: priorityColors[task.priority], color: "white" }}
              />
              {task.dueDate && (
                <Typography variant="caption" sx={{ color: getDueDateColor() }}>
                  Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                </Typography>
              )}
            </Box>
          </Paper>
        </Link>
      )}
    </Draggable>
  )
}

