import { Injectable } from '@angular/core';
import { KanbanBoard, KanbanColumn, KanbanCard } from '../models/kanban.models';

@Injectable({
  providedIn: 'root'
})
export class KanbanDataService {
  
  getMockBoard(): KanbanBoard {
    return {
      id: '1',
      title: 'Project Board',
      columns: [
        {
          id: 'col-1',
          title: 'To Do',
          order: 1,
          cards: [
            {
              id: 'card-1',
              title: 'Setup project',
              description: 'Initialize Angular workspace',
              priority: 'high',
              createdAt: new Date('2025-12-01')
            },
            {
              id: 'card-2',
              title: 'Create components',
              description: 'Build shared components',
              priority: 'medium',
              createdAt: new Date('2025-12-02')
            }
          ]
        },
        {
          id: 'col-2',
          title: 'In Progress',
          order: 2,
          cards: [
            {
              id: 'card-3',
              title: 'Implement state management',
              description: 'Add Signals and NGXS',
              assignee: 'Developer',
              priority: 'high',
              createdAt: new Date('2025-12-10')
            }
          ]
        },
        {
          id: 'col-3',
          title: 'Done',
          order: 3,
          cards: [
            {
              id: 'card-4',
              title: 'Design mockups',
              description: 'Created UI designs',
              priority: 'medium',
              createdAt: new Date('2025-11-20')
            }
          ]
        }
      ]
    };
  }

  addCard(columnId: string, card: KanbanCard): void {
    console.log(`Adding card ${card.id} to column ${columnId}`);
  }

  moveCard(cardId: string, fromColumnId: string, toColumnId: string): void {
    console.log(`Moving card ${cardId} from ${fromColumnId} to ${toColumnId}`);
  }

  deleteCard(columnId: string, cardId: string): void {
    console.log(`Deleting card ${cardId} from column ${columnId}`);
  }
}
