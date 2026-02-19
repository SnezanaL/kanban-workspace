import { KanbanColumn, KanbanTask } from '@kanban-workspace/shared';

// ── Board actions ──────────────────────────────────────────────────────────────

export class LoadBoards {
  static readonly type = '[Kanban] Load Boards';
}

export class SelectBoard {
  static readonly type = '[Kanban] Select Board';
  constructor(public name: string) {}
}

export class CreateBoard {
  static readonly type = '[Kanban] Create Board';
  constructor(public name: string, public columns: KanbanColumn[] = []) {}
}

export class RenameBoard {
  static readonly type = '[Kanban] Rename Board';
  constructor(public newName: string) {}
}

export class DeleteBoard {
  static readonly type = '[Kanban] Delete Board';
}

// ── Column actions ─────────────────────────────────────────────────────────────

export class AddColumn {
  static readonly type = '[Kanban] Add Column';
  constructor(public columnName: string) {}
}

// ── Task actions ───────────────────────────────────────────────────────────────

export class AddTask {
  static readonly type = '[Kanban] Add Task';
  constructor(public columnName: string, public task: KanbanTask) {}
}

export class UpdateTask {
  static readonly type = '[Kanban] Update Task';
  constructor(
    public columnName: string,
    public taskIndex: number,
    public changes: Partial<KanbanTask>
  ) {}
}

export class MoveTask {
  static readonly type = '[Kanban] Move Task';
  constructor(public fromColumn: string, public toColumn: string, public taskIndex: number) {}
}

export class DeleteTask {
  static readonly type = '[Kanban] Delete Task';
  constructor(public columnName: string, public taskIndex: number) {}
}
