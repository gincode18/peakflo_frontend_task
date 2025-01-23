import { useState } from "react"
import { Droppable } from "@hello-pangea/dnd"
import { Add, MoreVert } from "@mui/icons-material"
import { TaskCard } from "./task-card"
import { useTaskStore } from "../store/tasks"
import type { Task, Status } from "../types/task"
import { Paper, Typography, Button, Box, IconButton, Menu, MenuItem } from "@mui/material"
import { NewTaskDialog } from "./new-task-dialog"

interface ColumnProps {
  id: Status
  title: string
  tasks: Task[]
}

export function Column({ id, title, tasks }: ColumnProps) {
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { updateColumn, deleteColumn } = useTaskStore()

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEditColumn = () => {
    const newTitle = prompt("Enter new column title", title)
    if (newTitle) {
      updateColumn(id, newTitle)
    }
    handleMenuClose()
  }

  const handleDeleteColumn = () => {
    if (window.confirm("Are you sure you want to delete this column?")) {
      deleteColumn(id)
    }
    handleMenuClose()
  }

  return (
    <Paper elevation={3} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" component="div">
          {title}{" "}
          <Typography component="span" color="text.secondary">
            ({tasks.length})
          </Typography>
        </Typography>
        <IconButton onClick={handleMenuOpen}>
          <MoreVert />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleEditColumn}>Edit</MenuItem>
          <MenuItem onClick={handleDeleteColumn}>Delete</MenuItem>
        </Menu>
      </Box>
      <Droppable droppableId={id}>
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ flexGrow: 1, overflowY: "auto", px: 2, pb: 2 }}
          >
            {tasks.map((task, index) => (
              <Box key={task.id} sx={{ mb: 1 }}>
                <TaskCard task={task} index={index} />
              </Box>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
      <Box sx={{ p: 2 }}>
        <Button startIcon={<Add />} fullWidth onClick={() => setIsNewTaskOpen(true)} variant="outlined">
          Add Task
        </Button>
      </Box>
      <NewTaskDialog status={id} open={isNewTaskOpen} onClose={() => setIsNewTaskOpen(false)} />
    </Paper>
  )
}

