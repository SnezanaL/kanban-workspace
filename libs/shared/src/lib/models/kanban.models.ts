export interface KanbanSubtask {
  title: string;
  isCompleted: boolean;
}

export interface KanbanTask {
  title: string;
  description: string;
  status: string;
  subtasks: KanbanSubtask[];
}

export interface KanbanColumn {
  name: string;
  tasks: KanbanTask[];
}

export interface KanbanBoard {
  name: string;
  columns: KanbanColumn[];
}

export interface KanbanData {
  boards: KanbanBoard[];
}
