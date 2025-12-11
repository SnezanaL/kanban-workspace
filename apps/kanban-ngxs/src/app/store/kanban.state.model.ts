import { KanbanBoard } from '@kanban-workspace/shared';

export interface KanbanStateModel {
  board: KanbanBoard | null;
  loading: boolean;
}

export const defaultKanbanState: KanbanStateModel = {
  board: null,
  loading: false
};
