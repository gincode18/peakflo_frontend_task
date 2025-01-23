export type Status = string

export type Priority = "low" | "medium" | "high"

export interface Task {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  dueDate: string | null
}

export interface Column {
  id: Status
  title: string
  tasks: Task[]
}

export interface BoardState {
  columns: Column[]
}

