import { useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { useTaskStore } from "../store/tasks"
import { Column } from "./column"
import { NewColumnDialog } from "./new-column-dialog"
import type { Status } from "../types/task"
import {
  Container,
  Grid,
  Button,
  Box,
  TextField,
  InputAdornment,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import SearchIcon from "@mui/icons-material/Search"
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import FileUploadIcon from "@mui/icons-material/FileUpload"

export default function TaskBoard() {
  const { columns, reorderTasks, exportBoard, importBoard } = useTaskStore()
  const [isNewColumnOpen, setIsNewColumnOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importData, setImportData] = useState("")
  const theme = useTheme()

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, type } = result

    if (!destination) return

    if (type === "column") {
      const newColumns = Array.from(columns)
      const [reorderedColumn] = newColumns.splice(source.index, 1)
      newColumns.splice(destination.index, 0, reorderedColumn)
      useTaskStore.setState({ columns: newColumns })
      return
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    reorderTasks(source.droppableId as Status, source.index, destination.droppableId as Status, destination.index)
  }

  const filteredColumns = columns.map((column) => ({
    ...column,
    tasks: column.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  }))

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportBoard())
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "kanban_board_export.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const handleImport = () => {
    importBoard(importData)
    setIsImportDialogOpen(false)
    setImportData("")
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <TextField
          placeholder="Search tasks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
              },
              "&:hover fieldset": {
                borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
            "& .MuiInputBase-input": {
              color: theme.palette.text.primary,
            },
            "& .MuiInputAdornment-root .MuiSvgIcon-root": {
              color: theme.palette.text.secondary,
            },
          }}
        />
        <Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsNewColumnOpen(true)} sx={{ mr: 1 }}>
            Add Column
          </Button>
          <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExport} sx={{ mr: 1 }}>
            Export
          </Button>
          <Button variant="outlined" startIcon={<FileUploadIcon />} onClick={() => setIsImportDialogOpen(true)}>
            Import
          </Button>
        </Box>
      </Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" type="column" direction="horizontal">
          {(provided) => (
            <Grid container spacing={2} {...provided.droppableProps} ref={provided.innerRef}>
              {filteredColumns.map((column, index) => (
                <Draggable key={column.id} draggableId={column.id} index={index}>
                  {(provided) => (
                    <Grid item xs={12} md={4} lg={3} {...provided.draggableProps} ref={provided.innerRef}>
                      <div {...provided.dragHandleProps}>
                        <Column id={column.id} title={column.title} tasks={column.tasks} />
                      </div>
                    </Grid>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>
      <NewColumnDialog open={isNewColumnOpen} onClose={() => setIsNewColumnOpen(false)} />
      <Dialog open={isImportDialogOpen} onClose={() => setIsImportDialogOpen(false)}>
        <DialogTitle>Import Board Data</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Paste JSON data here"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsImportDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleImport}>Import</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

