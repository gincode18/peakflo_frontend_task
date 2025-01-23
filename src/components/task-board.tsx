import { useState } from "react"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import { useTaskStore } from "../store/tasks"
import { Column } from "./column"
import { NewColumnDialog } from "./new-column-dialog"
import type { Column as Coltypes, Status } from "../types/task"
import { Container, Grid, Button, Box } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"

export default function TaskBoard() {
  const { columns, moveTask } = useTaskStore()
  const [isNewColumnOpen, setIsNewColumnOpen] = useState(false)

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    moveTask(draggableId, destination.droppableId as Status)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsNewColumnOpen(true)}>
          Add Column
        </Button>
      </Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={2}>
          {columns.map((column:Coltypes) => (
            <Grid item xs={12} md={4} key={column.id}>
              <Column id={column.id} title={column.title} tasks={column.tasks} />
            </Grid>
          ))}
        </Grid>
      </DragDropContext>
      <NewColumnDialog open={isNewColumnOpen} onClose={() => setIsNewColumnOpen(false)} />
    </Container>
  )
}

