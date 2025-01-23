import { Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import type { Task } from "../types/task";
import { Paper, Typography, Chip, Box, useTheme } from "@mui/material";
import { format, isBefore, addDays } from "date-fns";
import { CalendarToday, Flag } from "@mui/icons-material";

interface TaskCardProps {
  task: Task;
  index: number;
}

const priorityColors = {
  low: "#4caf50",
  medium: "#ff9800",
  high: "#f44336",
};

export function TaskCard({ task, index }: TaskCardProps) {
  const theme = useTheme();

  const getDueDateColor = () => {
    if (!task.dueDate) return theme.palette.text.secondary;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    if (isBefore(dueDate, today)) return theme.palette.error.main;
    if (isBefore(dueDate, addDays(today, 3))) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

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
              borderRadius: "12px",
            }}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              {task.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ mb: 2 }}
            >
              {task.description}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Chip
                icon={<Flag />}
                label={task.priority}
                size="small"
                sx={{ bgcolor: priorityColors[task.priority], color: "white" }}
              />
              {task.dueDate && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: getDueDateColor(),
                  }}
                >
                  <CalendarToday fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="caption">
                    {format(new Date(task.dueDate), "MMM d, yyyy")}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Link>
      )}
    </Draggable>
  );
}
