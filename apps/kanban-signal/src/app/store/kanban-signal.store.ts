import { Injectable, computed, inject, signal } from '@angular/core';
import { KanbanBoard, KanbanColumn, KanbanTask } from '@kanban-workspace/shared';
import { KanbanBackendService } from '@kanban-workspace/shared/lib/services/kanban-backend.service';

@Injectable({
  providedIn: 'root',
})
export class KanbanSignalStore {
  private readonly backend = inject(KanbanBackendService);

  // ── Read state (delegated to backend service) ────────────────────────────────
  readonly board = this.backend.selectedBoard;
  readonly boards = this.backend.boards;
  readonly columns = computed(() => this.board()?.columns ?? []);
  readonly isLoading = this.backend.isLoading;
  readonly error = this.backend.error;
  readonly totalTasks = computed(() =>
    this.columns().reduce((sum, col) => sum + col.tasks.length, 0)
  );

  // ── UI state ─────────────────────────────────────────────────────────────────
  readonly isBusy = signal(false);
  readonly actionError = signal<string | null>(null);

  // ── Board actions ────────────────────────────────────────────────────────────

  selectBoard(name: string) {
    this.backend.selectBoard(name);
  }

  createBoard(name: string, columns: KanbanColumn[] = []) {
    this.run(() => this.backend.createBoard(name, columns));
  }

  renameBoard(newName: string) {
    const board = this.requireBoard();
    if (!board) return;
    this.run(() => this.backend.renameBoard(board, newName));
  }

  deleteBoard() {
    const board = this.requireBoard();
    if (!board) return;
    this.run(() => this.backend.deleteBoard(board));
  }

  // ── Column actions ───────────────────────────────────────────────────────────

  addColumn(columnName: string) {
    const board = this.requireBoard();
    if (!board) return;
    this.run(() => this.backend.addColumn(board, columnName));
  }

  renameColumn(oldName: string, newName: string) {
    const board = this.requireBoard();
    if (!board) return;
    this.run(() => this.backend.renameColumn(board, oldName, newName));
  }

  deleteColumn(columnName: string) {
    const board = this.requireBoard();
    if (!board) return;
    this.run(() => this.backend.deleteColumn(board, columnName));
  }

  // ── Task actions ─────────────────────────────────────────────────────────────

  addTask(columnName: string, task: KanbanTask) {
    const board = this.requireBoard();
    if (!board) return;
    this.run(() => this.backend.addTask(board, columnName, task));
  }

  updateTask(columnName: string, taskIndex: number, changes: Partial<KanbanTask>) {
    const board = this.requireBoard();
    if (!board) return;
    this.run(() => this.backend.updateTask(board, columnName, taskIndex, changes));
  }

  moveTask(fromColumn: string, toColumn: string, taskIndex: number) {
    const board = this.requireBoard();
    if (!board) return;
    this.run(() => this.backend.moveTask(board, fromColumn, toColumn, taskIndex));
  }

  deleteTask(columnName: string, taskIndex: number) {
    const board = this.requireBoard();
    if (!board) return;
    this.run(() => this.backend.deleteTask(board, columnName, taskIndex));
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  private requireBoard(): KanbanBoard | null {
    const board = this.board();
    if (!board) {
      this.actionError.set('No board selected.');
    }
    return board ?? null;
  }

  private run(action: () => import('rxjs').Observable<unknown>) {
    this.isBusy.set(true);
    this.actionError.set(null);
    action().subscribe({
      error: (err) => {
        this.actionError.set(err?.message ?? 'An error occurred.');
        this.isBusy.set(false);
      },
      complete: () => this.isBusy.set(false),
    });
  }
}
