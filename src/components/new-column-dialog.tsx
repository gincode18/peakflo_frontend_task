import { useState } from "react"
import { useTaskStore } from "../store/tasks"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material"

interface NewColumnDialogProps {
  open: boolean
  onClose: () => void
}

export function NewColumnDialog({ open, onClose }: NewColumnDialogProps) {
  const [title, setTitle] = useState("")
  const addColumn = useTaskStore((state:any) => state.addColumn)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addColumn(title)
    setTitle("")
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Column</DialogTitle>
        <DialogContent>
          <TextField
            label="Column Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create Column
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

