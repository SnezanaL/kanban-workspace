import { KanbanBoard } from '@kanban-workspace/shared';

export interface KanbanStateModel {
  boards: KanbanBoard[];
  selectedBoardName: string;
  board: KanbanBoard | null;
  loading: boolean;
}

export const defaultKanbanState: KanbanStateModel = {
  boards: [],
  selectedBoardName: '',
  board: null,
  loading: false,
};
