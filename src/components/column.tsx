import { useState } from "react"
import { Droppable } from "@hello-pangea/dnd"
import { Add, MoreVert, Sort } from "@mui/icons-material"
import { TaskCard } from "./task-card"
import { useTaskStore } from "../store/tasks"
import type { Task, Status } from "../types/task"
import {
  Paper,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
} from "@mui/material"
import { NewTaskDialog } from "./new-task-dialog"

interface ColumnProps {
  id: Status
  title: string
  tasks: Task[]
}

export function Column({ id, title, tasks }: ColumnProps) {
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { updateColumn, deleteColumn, sortTasksByPriority } = useTaskStore()
  const theme = useTheme()

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
    deleteColumn(id)
    setIsDeleteDialogOpen(false)
  }

  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.paper,
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          {title}{" "}
          <Typography component="span" color="text.secondary">
            ({tasks.length})
          </Typography>
        </Typography>
        <Box>
          <IconButton onClick={() => sortTasksByPriority(id)} title="Sort by priority" size="small">
            <Sort />
          </IconButton>
          <IconButton onClick={handleMenuOpen} size="small">
            <MoreVert />
          </IconButton>
        </Box>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleEditColumn}>Edit</MenuItem>
          <MenuItem onClick={() => setIsDeleteDialogOpen(true)}>Delete</MenuItem>
        </Menu>
      </Box>
      <Droppable droppableId={id}>
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ flexGrow: 1, overflowY: "auto", px: 2, py: 1 }}
          >
            {tasks.map((task, index) => (
              <Box key={task.id} sx={{ mb: 2 }}>
                <TaskCard task={task} index={index} />
              </Box>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button
          startIcon={<Add />}
          fullWidth
          onClick={() => setIsNewTaskOpen(true)}
          variant="outlined"
          sx={{
            borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
            color: theme.palette.text.primary,
            "&:hover": {
              borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
              bgcolor: theme.palette.action.hover,
            },
            borderRadius: "20px",
          }}
        >
          Add Task
        </Button>
      </Box>
      <NewTaskDialog status={id} open={isNewTaskOpen} onClose={() => setIsNewTaskOpen(false)} />
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        <DialogTitle>Delete Column</DialogTitle>
        <DialogContent>Are you sure you want to delete this column? This action cannot be undone.</DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteColumn} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

