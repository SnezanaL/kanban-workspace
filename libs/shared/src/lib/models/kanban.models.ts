export interface KanbanSubtask {
  title: string;
  isCompleted: boolean;
}

export interface KanbanTask {
  title: string;
  description: string;
  status: string;
  subtasks: KanbanSubtask[];
  assignee?: string;
  priority?: 'Low' | 'Medium' | 'High';
}

export interface KanbanColumn {
  name: string;
  tasks: KanbanTask[];
}

export interface KanbanBoard {
  id?: number;
  name: string;
  columns: KanbanColumn[];
}

export interface KanbanData {
  boards: KanbanBoard[];
}

export interface KanbanUser {
  id: number;
  email: string;
  password: string;
  name: string;
}
