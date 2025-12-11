export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  order: number;
}

export interface KanbanBoard {
  id: string;
  title: string;
  columns: KanbanColumn[];
}
