import { Injectable, signal } from '@angular/core';
import { KanbanData, KanbanBoard } from '../models/kanban.models';

@Injectable({
  providedIn: 'root',
})
export class KanbanDataService {
  private readonly dataSignal = signal<KanbanData>({
    boards: [
      {
        name: 'Platform Launch',
        columns: [
          {
            name: 'Todo',
            tasks: [
              {
                title: 'Build UI for onboarding flow',
                description: '',
                status: 'Todo',
                subtasks: [
                  { title: 'Sign up page', isCompleted: true },
                  { title: 'Sign in page', isCompleted: false },
                  { title: 'Welcome page', isCompleted: false },
                ],
              },
            ],
          },
          {
            name: 'Doing',
            tasks: [],
          },
          {
            name: 'Done',
            tasks: [],
          },
        ],
      },
    ],
  });

  readonly data = this.dataSignal.asReadonly();
  readonly boards = signal(this.data().boards);

  getMockBoard(boardName: string): KanbanBoard | null {
    return this.data().boards.find((b) => b.name === boardName) || null;
  }

  getAllBoards(): KanbanBoard[] {
    return this.data().boards;
  }
}
