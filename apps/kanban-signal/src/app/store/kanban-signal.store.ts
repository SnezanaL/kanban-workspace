import { Injectable, signal, computed } from '@angular/core';
import { KanbanBoard } from '@kanban-workspace/shared';

@Injectable({
  providedIn: 'root',
})
export class KanbanSignalStore {
  // Signal za board state
  private boardSignal = signal<KanbanBoard | null>(null);

  // Computed signals
  readonly board = this.boardSignal.asReadonly();
  readonly columns = computed(() => this.board()?.columns || []);
  readonly totalTasks = computed(() =>
    this.columns().reduce((sum, col) => sum + col.tasks.length, 0)
  );

  setBoard(board: KanbanBoard | null): void {
    this.boardSignal.set(board);
  }
}
