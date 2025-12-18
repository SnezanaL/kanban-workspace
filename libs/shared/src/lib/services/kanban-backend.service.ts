import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { KanbanBoard, KanbanUser } from '../models/kanban.models';

@Injectable({
  providedIn: 'root',
})
export class KanbanBackendService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3001';

  // Currently selected board (default to first)
  private readonly selectedBoardNameSignal = signal<string>('');

  readonly selectedBoardName = this.selectedBoardNameSignal.asReadonly();

  // Resource koji učitava sve board-ove sa mock API-ja
  private readonly boardsResource = rxResource<KanbanBoard[], void>({
    defaultValue: [],
    stream: () => this.http.get<KanbanBoard[]>(`${this.apiUrl}/boards`),
  });

  // Bez effect-a: ako user nije eksplicitno izabrao board, koristimo prvi učitani.
  private readonly effectiveSelectedBoardName = computed(() => {
    const explicit = this.selectedBoardName().trim();
    if (explicit) {
      return explicit;
    }

    const boards = this.boards();
    return boards[0]?.name ?? '';
  });

  // Resource koji zavisi od selectedBoardName i vraća samo izabranu board-u
  public boardResource = rxResource<KanbanBoard | null, string>({
    defaultValue: null,
    params: this.effectiveSelectedBoardName,
    stream: ({ params }) => {
      const name = params.trim();
      if (!name) {
        return of(null);
      }

      return this.http
        .get<KanbanBoard[]>(`${this.apiUrl}/boards`, { params: { name } })
        .pipe(map((boards) => boards[0] ?? null));
    },
  });

  // Resource za trenutno ulogovanog korisnika (za sada prvi user iz /users)
  private readonly userResource = rxResource<KanbanUser | null, void>({
    defaultValue: null,
    stream: () =>
      this.http.get<KanbanUser[]>(`${this.apiUrl}/users`).pipe(map((users) => users[0] ?? null)),
  });

  readonly isLoading = computed(() => this.boardResource.isLoading());
  readonly error = computed(() => this.boardResource.error());

  // All boards from JSON
  readonly boards = computed<KanbanBoard[]>(() => {
    return this.boardsResource.value() ?? [];
  });

  readonly selectedBoard = computed<KanbanBoard | null>(() => {
    const board = this.boardResource.value();
    return board ?? null;
  });

  // Trenutni user (može se koristiti za fake auth)
  readonly currentUser = computed<KanbanUser | null>(() => {
    return this.userResource.value() ?? null;
  });

  selectBoard(boardName: string): void {
    this.selectedBoardNameSignal.set(boardName);
  }
}
