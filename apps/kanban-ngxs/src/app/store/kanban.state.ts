import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { map, of, switchMap } from 'rxjs';
import { KanbanStateModel, defaultKanbanState } from './kanban.state.model';
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
} from './kanban.actions';
import { KanbanBoard } from '@kanban-workspace/shared';

const API_URL = 'http://localhost:3001';

// ── Private setter actions (dispatched after async ops to update state synchronously) ──

class _SetBoards {
  static readonly type = '[Kanban ★] Set Boards';
  constructor(public boards: KanbanBoard[], public selectedName?: string) {}
}

class _SetBoard {
  static readonly type = '[Kanban ★] Set Board';
  constructor(public board: KanbanBoard | null) {}
}

// ─────────────────────────────────────────────────────────────────────────────

@State<KanbanStateModel>({
  name: 'kanban',
  defaults: defaultKanbanState,
})
@Injectable()
export class KanbanState {
  private readonly http = inject(HttpClient);

  // ── Selectors ────────────────────────────────────────────────────────────────

  @Selector()
  static boards(state: KanbanStateModel): KanbanBoard[] {
    return state.boards;
  }

  @Selector()
  static board(state: KanbanStateModel): KanbanBoard | null {
    return state.board;
  }

  @Selector()
  static selectedBoardName(state: KanbanStateModel): string {
    return state.selectedBoardName;
  }

  @Selector()
  static columns(state: KanbanStateModel) {
    return state.board?.columns ?? [];
  }

  @Selector()
  static columnNames(state: KanbanStateModel): string[] {
    return state.board?.columns.map((c) => c.name) ?? [];
  }

  @Selector()
  static loading(state: KanbanStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static totalTasks(state: KanbanStateModel): number {
    return state.board?.columns.reduce((sum, col) => sum + col.tasks.length, 0) ?? 0;
  }

  // ── Private setter handlers (synchronous state mutations) ─────────────────────

  @Action(_SetBoards)
  private _setBoards(ctx: StateContext<KanbanStateModel>, action: _SetBoards) {
    const name =
      action.selectedName?.trim() ||
      ctx.getState().selectedBoardName.trim() ||
      action.boards[0]?.name ||
      '';
    ctx.patchState({ boards: action.boards, selectedBoardName: name });
  }

  @Action(_SetBoard)
  private _setBoard(ctx: StateContext<KanbanStateModel>, action: _SetBoard) {
    ctx.patchState({ board: action.board });
  }

  // ── Helper: load board currently selected in state ────────────────────────────

  private loadCurrentBoard(ctx: StateContext<KanbanStateModel>) {
    const name = ctx.getState().selectedBoardName;
    if (!name.trim()) {
      return ctx.dispatch(new _SetBoard(null));
    }
    return this.http
      .get<KanbanBoard[]>(`${API_URL}/boards`, { params: { name } })
      .pipe(
        map((boards) => boards[0] ?? null),
        switchMap((board) => ctx.dispatch(new _SetBoard(board)))
      );
  }

  // ── Helper: patch board on server then reload everything ─────────────────────

  private patchBoard$(ctx: StateContext<KanbanStateModel>, changes: Partial<KanbanBoard>) {
    const board = ctx.getState().board;
    if (!board) return of(null);
    return this.http
      .patch<KanbanBoard>(`${API_URL}/boards/${board.id}`, changes)
      .pipe(
        switchMap(() => this.http.get<KanbanBoard[]>(`${API_URL}/boards`)),
        switchMap((boards) => ctx.dispatch(new _SetBoards(boards))),
        switchMap(() => this.loadCurrentBoard(ctx))
      );
  }

  // ── Board actions ─────────────────────────────────────────────────────────────

  @Action(LoadBoards)
  loadBoards(ctx: StateContext<KanbanStateModel>) {
    ctx.patchState({ loading: true });
    return this.http.get<KanbanBoard[]>(`${API_URL}/boards`).pipe(
      switchMap((boards) => ctx.dispatch(new _SetBoards(boards))),
      switchMap(() => this.loadCurrentBoard(ctx))
    );
  }

  @Action(SelectBoard)
  selectBoard(ctx: StateContext<KanbanStateModel>, action: SelectBoard) {
    ctx.patchState({ selectedBoardName: action.name });
    return this.loadCurrentBoard(ctx);
  }

  @Action(CreateBoard)
  createBoard(ctx: StateContext<KanbanStateModel>, action: CreateBoard) {
    const newBoard: KanbanBoard = { name: action.name, columns: action.columns };
    return this.http.post<KanbanBoard>(`${API_URL}/boards`, newBoard).pipe(
      switchMap((created) => this.http.get<KanbanBoard[]>(`${API_URL}/boards`).pipe(
        switchMap((boards) => ctx.dispatch(new _SetBoards(boards, created.name)))
      )),
      switchMap(() => this.loadCurrentBoard(ctx))
    );
  }

  @Action(RenameBoard)
  renameBoard(ctx: StateContext<KanbanStateModel>, action: RenameBoard) {
    const board = ctx.getState().board;
    if (!board) return of(null);
    return this.http
      .patch<KanbanBoard>(`${API_URL}/boards/${board.id}`, { name: action.newName })
      .pipe(
        switchMap(() => this.http.get<KanbanBoard[]>(`${API_URL}/boards`)),
        switchMap((boards) => ctx.dispatch(new _SetBoards(boards, action.newName))),
        switchMap(() => this.loadCurrentBoard(ctx))
      );
  }

  @Action(DeleteBoard)
  deleteBoard(ctx: StateContext<KanbanStateModel>) {
    const board = ctx.getState().board;
    if (!board) return of(null);
    ctx.patchState({ board: null, selectedBoardName: '' });
    return this.http.delete(`${API_URL}/boards/${board.id}`).pipe(
      switchMap(() => this.http.get<KanbanBoard[]>(`${API_URL}/boards`)),
      switchMap((boards) => ctx.dispatch(new _SetBoards(boards))),
      switchMap(() => this.loadCurrentBoard(ctx))
    );
  }

  // ── Column actions ────────────────────────────────────────────────────────────

  @Action(AddColumn)
  addColumn(ctx: StateContext<KanbanStateModel>, action: AddColumn) {
    const board = ctx.getState().board;
    if (!board) return of(null);
    const columns = [...board.columns, { name: action.columnName, tasks: [] }];
    return this.patchBoard$(ctx, { columns });
  }

  // ── Task actions ──────────────────────────────────────────────────────────────

  @Action(AddTask)
  addTask(ctx: StateContext<KanbanStateModel>, action: AddTask) {
    const board = ctx.getState().board;
    if (!board) return of(null);
    const columns = board.columns.map((col) =>
      col.name === action.columnName ? { ...col, tasks: [...col.tasks, action.task] } : col
    );
    return this.patchBoard$(ctx, { columns });
  }

  @Action(UpdateTask)
  updateTask(ctx: StateContext<KanbanStateModel>, action: UpdateTask) {
    const board = ctx.getState().board;
    if (!board) return of(null);
    const columns = board.columns.map((col) => {
      if (col.name !== action.columnName) return col;
      const tasks = col.tasks.map((t, i) =>
        i === action.taskIndex ? { ...t, ...action.changes } : t
      );
      return { ...col, tasks };
    });
    return this.patchBoard$(ctx, { columns });
  }

  @Action(MoveTask)
  moveTask(ctx: StateContext<KanbanStateModel>, action: MoveTask) {
    const board = ctx.getState().board;
    if (!board) return of(null);
    const task = board.columns.find((c) => c.name === action.fromColumn)?.tasks[action.taskIndex];
    if (!task) return of(null);
    const columns = board.columns.map((col) => {
      if (col.name === action.fromColumn) {
        return { ...col, tasks: col.tasks.filter((_, i) => i !== action.taskIndex) };
      }
      if (col.name === action.toColumn) {
        return { ...col, tasks: [...col.tasks, { ...task, status: action.toColumn }] };
      }
      return col;
    });
    return this.patchBoard$(ctx, { columns });
  }

  @Action(DeleteTask)
  deleteTask(ctx: StateContext<KanbanStateModel>, action: DeleteTask) {
    const board = ctx.getState().board;
    if (!board) return of(null);
    const columns = board.columns.map((col) =>
      col.name === action.columnName
        ? { ...col, tasks: col.tasks.filter((_, i) => i !== action.taskIndex) }
        : col
    );
    return this.patchBoard$(ctx, { columns });
  }
}
