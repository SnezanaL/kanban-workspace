import { Component, OnInit, computed, inject, viewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import {
  KanbanBoardComponent,
  TaskActionEvent,
} from '@kanban-workspace/shared/lib/components/kanban-board/kanban-board.component';
import { KanbanHeaderComponent } from '@kanban-workspace/shared/lib/components/kanban-header/kanban-header.component';
import { KanbanSidebarComponent } from '@kanban-workspace/shared/lib/components/kanban-sidebar/kanban-sidebar.component';
import {
  KanbanTaskModalComponent,
  TaskSavedEvent,
} from '@kanban-workspace/shared/lib/components/kanban-task-modal/kanban-task-modal.component';
import {
  KanbanBoardModalComponent,
  BoardSavedEvent,
} from '@kanban-workspace/shared/lib/components/kanban-board-modal/kanban-board-modal.component';
import { KanbanConfirmDialogComponent } from '@kanban-workspace/shared/lib/components/kanban-confirm-dialog/kanban-confirm-dialog.component';
import { KanbanState } from './store/kanban.state';
import {
  LoadBoards,
  SelectBoard,
  CreateBoard,
  RenameBoard,
  DeleteBoard,
  AddColumn,
  AddTask,
  UpdateTask,
  MoveTask,
  DeleteTask,
} from './store/kanban.actions';

@Component({
  imports: [
    KanbanBoardComponent,
    KanbanHeaderComponent,
    KanbanSidebarComponent,
    KanbanTaskModalComponent,
    KanbanBoardModalComponent,
    KanbanConfirmDialogComponent,
    RouterModule,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly store = inject(Store);

  // ── View children (modals) ────────────────────────────────────────────────────────
  private readonly taskModal = viewChild.required(KanbanTaskModalComponent);
  private readonly boardModal = viewChild.required(KanbanBoardModalComponent);
  private readonly confirmDialog = viewChild.required(KanbanConfirmDialogComponent);

  // ── State signals from NGXS ───────────────────────────────────────────────────
  readonly boards = this.store.selectSignal(KanbanState.boards);
  readonly boardResource = this.store.selectSignal(KanbanState.board);
  readonly selectedBoardName = this.store.selectSignal(KanbanState.selectedBoardName);
  readonly columnNames = this.store.selectSignal(KanbanState.columnNames);

  // ── Pending confirm action ────────────────────────────────────────────────────
  private pendingAction: (() => void) | null = null;

  ngOnInit() {
    this.store.dispatch(new LoadBoards());
  }

  // ── Board selection ────────────────────────────────────────────────────────────
  onBoardSelected(boardName: string) {
    this.store.dispatch(new SelectBoard(boardName));
  }

  // ── Board CRUD ────────────────────────────────────────────────────────────────
  onCreateBoard() {
    this.boardModal().open();
  }

  onEditBoard() {
    const board = this.boardResource();
    if (board) this.boardModal().open(board.name);
  }

  onDeleteBoard() {
    const board = this.boardResource();
    if (!board) return;
    this.pendingAction = () => this.store.dispatch(new DeleteBoard());
    this.confirmDialog().open(
      `Delete '${board.name}' board?`,
      'This action will remove this board and all its columns and tasks. This cannot be undone.'
    );
  }

  onBoardSaved(event: BoardSavedEvent) {
    const board = this.boardResource();
    if (board && !event.columns) {
      this.store.dispatch(new RenameBoard(event.name));
    } else {
      const columns = (event.columns ?? []).map((name) => ({ name, tasks: [] }));
      this.store.dispatch(new CreateBoard(event.name, columns));
    }
  }

  // ── Column actions ─────────────────────────────────────────────────────────────
  onAddColumn() {
    const name = prompt('New column name:');
    if (name?.trim()) {
      this.store.dispatch(new AddColumn(name.trim()));
    }
  }

  // ── Task CRUD ───────────────────────────────────────────────────────────────
  onAddTask(column?: string) {
    const cols = this.columnNames();
    if (!cols.length) return;
    this.taskModal().open({ column: column ?? cols[0] });
  }

  onTaskAction(event: TaskActionEvent) {
    const board = this.boardResource();
    if (!board) return;

    if (event.type === 'edit') {
      const task = board.columns.find((c) => c.name === event.column)?.tasks[event.taskIndex];
      if (task) {
        this.taskModal().open({ task, column: event.column, taskIndex: event.taskIndex });
      }
    } else if (event.type === 'delete') {
      this.pendingAction = () => this.store.dispatch(new DeleteTask(event.column, event.taskIndex));
      const task = board.columns.find((c) => c.name === event.column)?.tasks[event.taskIndex];
      this.confirmDialog().open(
        `Delete '${task?.title ?? 'task'}'?`,
        'This task will be permanently deleted. This cannot be undone.'
      );
    } else if (event.type === 'move' && event.toColumn) {
      this.store.dispatch(new MoveTask(event.column, event.toColumn, event.taskIndex));
    }
  }

  onSubtaskToggled(event: {
    column: string;
    taskIndex: number;
    subtaskIndex: number;
    isCompleted: boolean;
  }) {
    const board = this.boardResource();
    if (!board) return;
    const task = board.columns.find((c) => c.name === event.column)?.tasks[event.taskIndex];
    if (!task) return;
    const updatedSubtasks = task.subtasks.map((s, i) =>
      i === event.subtaskIndex ? { ...s, isCompleted: event.isCompleted } : s
    );
    this.store.dispatch(
      new UpdateTask(event.column, event.taskIndex, { subtasks: updatedSubtasks })
    );
  }

  onTaskSaved(event: TaskSavedEvent) {
    if (event.taskIndex !== undefined && event.originalColumn) {
      if (event.originalColumn !== event.column) {
        this.store.dispatch(new MoveTask(event.originalColumn, event.column, event.taskIndex));
      } else {
        this.store.dispatch(new UpdateTask(event.column, event.taskIndex, event.task));
      }
    } else {
      this.store.dispatch(new AddTask(event.column, event.task));
    }
  }

  // ── Confirm dialog callback ─────────────────────────────────────────────────────
  onConfirmed() {
    this.pendingAction?.();
    this.pendingAction = null;
  }
}
