import { Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import type { Task } from "../types/task";
import { Paper, Typography, Chip, Box, useTheme, TextField } from "@mui/material";
import { format, isBefore, addDays } from "date-fns";
import { CalendarToday, Flag } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { useState ,useRef} from "react";
import { useTaskStore } from "../store/tasks";


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
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const { updateTask } = useTaskStore();
  const getDueDateColor = () => {
    if (!task.dueDate) return theme.palette.text.secondary;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    if (isBefore(dueDate, today)) return theme.palette.error.main;
    if (isBefore(dueDate, addDays(today, 3))) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  const handleEdit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (inputRef.current) {
        updateTask(task.id, { title: newTitle });
        setNewTitle(task.title);
      }
    }
  };

  // const handleSave = () => {
  //   updateTask(task.id, { title: task.title, description: task.description });
  //   setIsEditing(false);
  // };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };



  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        // <Link to={`/task/${task.id}`} style={{ textDecoration: "none" }}>
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
              {isEditing ? (
                <TextField
                  inputRef={inputRef}
                  value={newTitle}
                  onChange={onChange}
                  onKeyDown={handleEdit}
                  autoFocus
                />
              ) : (
                task.title
              )}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{ mb: 2 }}
              >
                {task.description}
              </Typography>
              <EditIcon
                fontSize="small"
                sx={{ cursor: "pointer" }}
                onClick={() => setIsEditing(true)}
              />
            </Box>
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
        // </Link>
      )}
    </Draggable>
  );
}
