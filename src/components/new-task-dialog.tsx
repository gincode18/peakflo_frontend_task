import { useState } from "react"
import { useTaskStore } from "../store/tasks"
import type { Status, Priority } from "../types/task"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

interface NewTaskDialogProps {
  status: Status
  open: boolean
  onClose: () => void
}

export function NewTaskDialog({ status, open, onClose }: NewTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const addTask = useTaskStore((state) => state.addTask)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addTask({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? dueDate.toISOString() : null,
    })
    setTitle("")
    setDescription("")
    setPriority("medium")
    setDueDate(null)
    onClose()
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} label="Priority">
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
              <DesktopDatePicker
                label="Due Date"
                value={dueDate}
                onChange={(newValue) => setDueDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
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
    </LocalizationProvider>
  )
}

