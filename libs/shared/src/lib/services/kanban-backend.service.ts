import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, of, tap } from 'rxjs';
import { KanbanBoard, KanbanColumn, KanbanTask, KanbanUser } from '../models/kanban.models';

@Injectable({
  providedIn: 'root',
})
export class KanbanBackendService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3001';

  // Name of the explicitly selected board; empty string means "use default (first board)"
  private readonly selectedBoardNameSignal = signal<string>('');
  readonly selectedBoardName = this.selectedBoardNameSignal.asReadonly();

  // --- Private resources (raw HTTP data) ---

  // Loads all boards from the API
  private readonly boardsResource = rxResource<KanbanBoard[], void>({
    defaultValue: [],
    stream: () => this.http.get<KanbanBoard[]>(`${this.apiUrl}/boards`),
  });

  // Loads the first user from /users (used for fake auth)
  private readonly userResource = rxResource<KanbanUser | null, void>({
    defaultValue: null,
    stream: () =>
      this.http.get<KanbanUser[]>(`${this.apiUrl}/users`).pipe(map((users) => users[0] ?? null)),
  });

  // --- Derived signals ---

  // All available boards
  readonly boards = computed<KanbanBoard[]>(() => this.boardsResource.value()!);

  // Falls back to the first board when no board has been explicitly selected
  private readonly effectiveSelectedBoardName = computed(() => {
    const explicit = this.selectedBoardName().trim();
    return explicit || (this.boards()[0]?.name ?? '');
  });

  // Loads the currently selected board; re-fetches whenever effectiveSelectedBoardName changes
  readonly boardResource = rxResource<KanbanBoard | null, string>({
    defaultValue: null,
    params: this.effectiveSelectedBoardName,
    stream: ({ params: name }) => {
      if (!name.trim()) {
        return of(null);
      }
      return this.http
        .get<KanbanBoard[]>(`${this.apiUrl}/boards`, { params: { name } })
        .pipe(map((boards) => boards[0] ?? null));
    },
  });

  // --- Public API ---

  readonly isLoading = computed(() => this.boardResource.isLoading());
  readonly error = computed(() => this.boardResource.error());
  readonly selectedBoard = computed<KanbanBoard | null>(() => this.boardResource.value());
  readonly currentUser = computed<KanbanUser | null>(() => this.userResource.value());

  selectBoard(boardName: string): void {
    this.selectedBoardNameSignal.set(boardName);
  }

  // ─── Board CRUD ─────────────────────────────────────────────────────────────

  createBoard(name: string, columns: KanbanColumn[] = []) {
    const board: KanbanBoard = { name, columns };
    return this.http
      .post<KanbanBoard>(`${this.apiUrl}/boards`, board)
      .pipe(tap(() => this.boardsResource.reload()));
  }

  renameBoard(board: KanbanBoard, newName: string) {
    return this.http
      .patch<KanbanBoard>(`${this.apiUrl}/boards/${board.id}`, { name: newName })
      .pipe(tap(() => this.refreshAll()));
  }

  deleteBoard(board: KanbanBoard) {
    return this.http.delete(`${this.apiUrl}/boards/${board.id}`).pipe(
      tap(() => {
        // Reset selection if the deleted board was selected
        if (this.selectedBoardName() === board.name) {
          this.selectedBoardNameSignal.set('');
        }
        this.boardsResource.reload();
      })
    );
  }

  // ─── Column CRUD ─────────────────────────────────────────────────────────────

  addColumn(board: KanbanBoard, columnName: string) {
    const updated = {
      columns: [...board.columns, { name: columnName, tasks: [] }],
    };
    return this.patchBoard(board.id!, updated);
  }

  renameColumn(board: KanbanBoard, oldName: string, newName: string) {
    const updated = {
      columns: board.columns.map((col) => (col.name === oldName ? { ...col, name: newName } : col)),
    };
    return this.patchBoard(board.id!, updated);
  }

  deleteColumn(board: KanbanBoard, columnName: string) {
    const updated = {
      columns: board.columns.filter((col) => col.name !== columnName),
    };
    return this.patchBoard(board.id!, updated);
  }

  // ─── Task CRUD ───────────────────────────────────────────────────────────────

  addTask(board: KanbanBoard, columnName: string, task: KanbanTask) {
    const updated = {
      columns: board.columns.map((col) =>
        col.name === columnName ? { ...col, tasks: [...col.tasks, task] } : col
      ),
    };
    return this.patchBoard(board.id!, updated);
  }

  updateTask(
    board: KanbanBoard,
    columnName: string,
    taskIndex: number,
    changes: Partial<KanbanTask>
  ) {
    const updated = {
      columns: board.columns.map((col) => {
        if (col.name !== columnName) return col;
        const tasks = col.tasks.map((t, i) => (i === taskIndex ? { ...t, ...changes } : t));
        return { ...col, tasks };
      }),
    };
    return this.patchBoard(board.id!, updated);
  }

  moveTask(board: KanbanBoard, fromColumn: string, toColumn: string, taskIndex: number) {
    const task = board.columns.find((c) => c.name === fromColumn)?.tasks[taskIndex];
    if (!task) return of(null);

    const updated = {
      columns: board.columns.map((col) => {
        if (col.name === fromColumn) {
          return { ...col, tasks: col.tasks.filter((_, i) => i !== taskIndex) };
        }
        if (col.name === toColumn) {
          return { ...col, tasks: [...col.tasks, { ...task, status: toColumn }] };
        }
        return col;
      }),
    };
    return this.patchBoard(board.id!, updated);
  }

  deleteTask(board: KanbanBoard, columnName: string, taskIndex: number) {
    const updated = {
      columns: board.columns.map((col) =>
        col.name === columnName
          ? { ...col, tasks: col.tasks.filter((_, i) => i !== taskIndex) }
          : col
      ),
    };
    return this.patchBoard(board.id!, updated);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────────

  private patchBoard(id: number, changes: Partial<KanbanBoard>) {
    return this.http
      .patch<KanbanBoard>(`${this.apiUrl}/boards/${id}`, changes)
      .pipe(tap(() => this.refreshAll()));
  }

  private refreshAll() {
    this.boardsResource.reload();
    this.boardResource.reload();
  }
}
