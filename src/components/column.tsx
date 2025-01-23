import { useState } from "react"
import { Droppable } from "@hello-pangea/dnd"
import { Add } from "@mui/icons-material"
import { TaskCard } from "./task-card"
// import { useTaskStore } from "@/store/tasks"
import type { Task, Status } from "../types/task"
import { Paper, Typography, Button, Box } from "@mui/material"
import { NewTaskDialog } from "./new-task-dialog"

interface ColumnProps {
  id: Status
  title: string
  tasks: Task[]
}

export function Column({ id, title, tasks }: ColumnProps) {
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)

  return (
    <Paper elevation={2} sx={{ height: "100%" }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {title}{" "}
          <Typography component="span" color="text.secondary">
            ({tasks.length})
          </Typography>
        </Typography>
        <Droppable droppableId={id}>
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: 100, mb: 2 }}>
              {tasks.map((task, index) => (
                <Box key={task.id} sx={{ mb: 1 }}>
                  <TaskCard task={task} index={index} />
                </Box>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
        <Button startIcon={<Add />} fullWidth onClick={() => setIsNewTaskOpen(true)}>
          New
        </Button>
      </Box>
      <NewTaskDialog status={id} open={isNewTaskOpen} onClose={() => setIsNewTaskOpen(false)} />
    </Paper>
  )
}

