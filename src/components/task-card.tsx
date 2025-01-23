import { Draggable } from "@hello-pangea/dnd"
import { Link } from "react-router-dom"
import type { Task } from "../types/task"
import { Paper, Typography, Chip, Box } from "@mui/material"

interface TaskCardProps {
  task: Task
  index: number
}

export function TaskCard({ task, index }: TaskCardProps) {
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
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Chip label={task.status} size="small" />
            </Box>
          </Paper>
        </Link>
      )}
    </Draggable>
  )
}

