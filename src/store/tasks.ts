import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Task, Status, BoardState } from "../types/task"

interface TaskState extends BoardState {
  tasks: Task[]
  addTask: (task: Omit<Task, "id">) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (taskId: string, newStatus: Status) => void
  addColumn: (title: string) => void
  updateColumn: (id: Status, title: string) => void
  deleteColumn: (id: Status) => void
}

const defaultColumns: BoardState["columns"] = [
  { id: "not-started", title: "Not Started", tasks: [] },
  { id: "in-progress", title: "In Progress", tasks: [] },
  { id: "completed", title: "Completed", tasks: [] },
]

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      columns: defaultColumns,
      addTask: (task) =>
        set((state) => {
          const newTask = { ...task, id: crypto.randomUUID() }
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
    }),
    {
      name: "task-storage",
    },
  ),
)

