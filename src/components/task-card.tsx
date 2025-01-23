import { Draggable } from "@hello-pangea/dnd"
import { Link } from "react-router-dom"
import type { Task } from "../types/task"
import { Paper } from "@mui/material"

interface TaskCardProps {
  task: Task
  index: number
}

export function TaskCard({ task, index }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Link to={`/task/${task.id}`} style={{ textDecoration: "none" }}>
          <Paper
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            elevation={1}
            sx={{
              p: 2,
              cursor: "pointer",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            {task.title}
          </Paper>
        </Link>
      )}
    </Draggable>
  )
}

