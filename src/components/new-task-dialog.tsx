import { useState } from "react"
import { useTaskStore } from "../store/tasks"
import type { Status } from "../types/task"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from "@mui/material"

interface NewTaskDialogProps {
  status: Status
  open: boolean
  onClose: () => void
}

export function NewTaskDialog({ status, open, onClose }: NewTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const addTask = useTaskStore((state:any) => state.addTask)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addTask({
      title,
      description,
      status,
    })
    setTitle("")
    setDescription("")
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create Task
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

