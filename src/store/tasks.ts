import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Task, Status, BoardState, Comment } from "../types/task"

interface TaskState extends BoardState {
  tasks: Task[]
  addTask: (task: Omit<Task, "id" | "comments">) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (taskId: string, newStatus: Status) => void
  reorderTasks: (sourceColId: Status, sourceIndex: number, destColId: Status, destIndex: number) => void
  addColumn: (title: string) => void
  updateColumn: (id: Status, title: string) => void
  deleteColumn: (id: Status) => void
  sortTasksByPriority: (columnId: Status) => void
  addComment: (taskId: string, content: string) => void
  deleteComment: (taskId: string, commentId: string) => void
  exportBoard: () => string
  importBoard: (data: string) => void
}

const defaultColumns: BoardState["columns"] = [
  { id: "not-started", title: "Not Started", tasks: [] },
  { id: "in-progress", title: "In Progress", tasks: [] },
  { id: "completed", title: "Completed", tasks: [] },
]

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      columns: defaultColumns,
      addTask: (task) =>
        set((state) => {
          const newTask: Task = {
            ...task,
            id: crypto.randomUUID(),
            comments: [],
            priority: task.priority || "medium",
            dueDate: task.dueDate || null,
          }
          return {
            tasks: [...state.tasks, newTask],
            columns: state.columns.map((column) =>
              column.id === task.status ? { ...column, tasks: [...column.tasks, newTask] } : column,
            ),
          }
        }),
      updateTask: (id, updatedTask) =>
        set((state) => {
          const newTasks = state.tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
          return {
            tasks: newTasks,
            columns: state.columns.map((column) => ({
              ...column,
              tasks: newTasks.filter((task) => task.status === column.id),
            })),
          }
        }),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          columns: state.columns.map((column) => ({
            ...column,
            tasks: column.tasks.filter((task) => task.id !== id),
          })),
        })),
      moveTask: (taskId, newStatus) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId)
          if (!task) return state

          const newTasks = state.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
          return {
            tasks: newTasks,
            columns: state.columns.map((column) => ({
              ...column,
              tasks: newTasks.filter((t) => t.status === column.id),
            })),
          }
        }),
      reorderTasks: (sourceColId, sourceIndex, destColId, destIndex) =>
        set((state) => {
          const newColumns = [...state.columns]
          const sourceCol = newColumns.find((col) => col.id === sourceColId)
          const destCol = newColumns.find((col) => col.id === destColId)

          if (!sourceCol || !destCol) return state

          const [movedTask] = sourceCol.tasks.splice(sourceIndex, 1)
          destCol.tasks.splice(destIndex, 0, movedTask)

          if (sourceColId !== destColId) {
            movedTask.status = destColId
          }

          return {
            columns: newColumns,
            tasks: state.tasks.map((task) => (task.id === movedTask.id ? movedTask : task)),
          }
        }),
      addColumn: (title) =>
        set((state) => ({
          columns: [...state.columns, { id: title.toLowerCase().replace(/\s+/g, "-"), title, tasks: [] }],
        })),
      updateColumn: (id, title) =>
        set((state) => ({
          columns: state.columns.map((column) => (column.id === id ? { ...column, title } : column)),
        })),
      deleteColumn: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.status !== id),
          columns: state.columns.filter((column) => column.id !== id),
        })),
      sortTasksByPriority: (columnId: Status) =>
        set((state) => {
          const column = state.columns.find((col) => col.id === columnId)
          if (!column) return state

          const priorityOrder = { high: 0, medium: 1, low: 2 }
          const sortedTasks = [...column.tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

          return {
            columns: state.columns.map((col) => (col.id === columnId ? { ...col, tasks: sortedTasks } : col)),
          }
        }),
      addComment: (taskId: string, content: string) =>
        set((state) => {
          const newComment: Comment = {
            id: crypto.randomUUID(),
            taskId,
            content,
            createdAt: new Date().toISOString(),
          }
          return {
            tasks: state.tasks.map((task) =>
              task.id === taskId ? { ...task, comments: [...task.comments, newComment] } : task,
            ),
          }
        }),
      deleteComment: (taskId: string, commentId: string) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, comments: task.comments.filter((comment) => comment.id !== commentId) }
              : task,
          ),
        })),
      exportBoard: () => {
        const state = get()
        return JSON.stringify({
          tasks: state.tasks,
          columns: state.columns,
        })
      },
      importBoard: (data: string) => {
        try {
          const parsedData = JSON.parse(data)
          set({
            tasks: parsedData.tasks,
            columns: parsedData.columns,
          })
        } catch (error) {
          console.error("Failed to import board data:", error)
        }
      },
    }),
    {
      name: "task-storage",
    },
  ),
)

