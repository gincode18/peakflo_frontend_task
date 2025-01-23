export type Status = string

export interface Task {
  id: string
  title: string
  description: string
  status: Status
}

export interface Column {
  id: Status
  title: string
  tasks: Task[]
}

export interface BoardState {
  columns: Column[]
}

