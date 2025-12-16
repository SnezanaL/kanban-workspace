import { Injectable, computed, effect, inject, resource, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { KanbanData, KanbanBoard } from '../models/kanban.models';

@Injectable({
  providedIn: 'root',
})
export class KanbanBackendService {
  private readonly http = inject(HttpClient);

  // Currently selected board (default to first)
  private readonly selectedBoardNameSignal = signal<string>('');
  readonly selectedBoardName = this.selectedBoardNameSignal.asReadonly();

  // Resource koji učitava kompletan KanbanData (sve board-ove)
  private readonly boardsResource = resource<KanbanData, void>({
    loader: () => firstValueFrom(this.http.get<KanbanData>('/assets/data/data.json')),
  });

  // Resource koji zavisi od selectedBoardName i vraća samo izabranu board-u
  private readonly boardResource = resource<KanbanBoard | null, string>({
    params: this.selectedBoardName,
    loader: ({ params }) =>
      firstValueFrom(this.http.get<KanbanData>('/assets/data/data.json')).then(
        (data) => data.boards.find((b) => b.name === params) ?? null
      ),
  });

  constructor() {
    // Kada se prvi put učitaju board-ovi iz backend-a,
    // postavi podrazumevanu izabranu board-u ako još nije setovana.
    effect(() => {
      const boards = this.boards();
      const current = this.selectedBoardName();

      if (!boards.length) {
        return;
      }

      if (!current) {
        this.selectedBoardNameSignal.set(boards[0].name);
      }
    });
  }

  readonly isLoading = computed(() => this.boardResource.isLoading());
  readonly error = computed(() => this.boardResource.error());

  // All boards from JSON
  readonly boards = computed<KanbanBoard[]>(() => {
    const value = this.boardsResource.value();
    return value?.boards || [];
  });

  readonly selectedBoard = computed<KanbanBoard | null>(() => {
    const board = this.boardResource.value();
    return board ?? null;
  });

  selectBoard(boardName: string): void {
    this.selectedBoardNameSignal.set(boardName);
  }
}
