import { KanbanBoard, KanbanCard } from '@kanban-workspace/shared';

export class SetBoard {
  static readonly type = '[Kanban] Set Board';
  constructor(public board: KanbanBoard) {}
}

export class AddCard {
  static readonly type = '[Kanban] Add Card';
  constructor(public columnId: string, public card: KanbanCard) {}
}

export class DeleteCard {
  static readonly type = '[Kanban] Delete Card';
  constructor(public columnId: string, public cardId: string) {}
}

export class MoveCard {
  static readonly type = '[Kanban] Move Card';
  constructor(
    public cardId: string,
    public fromColumnId: string,
    public toColumnId: string
  ) {}
}
