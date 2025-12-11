import { Component, OnInit, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KanbanBoardComponent, KanbanDataService } from '@kanban-workspace/shared';
import { KanbanSignalStore } from './store/kanban-signal.store';

@Component({
  imports: [KanbanBoardComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'Kanban Signal App';
  
  constructor(
    public store: KanbanSignalStore,
    private dataService: KanbanDataService
  ) {
    // Effect za praćenje promena board state-a
    effect(() => {
      const board = this.store.board();
      console.log('Board updated:', board);
    });
  }

  ngOnInit(): void {
    // Učitaj mock podatke
    const mockBoard = this.dataService.getMockBoard();
    this.store.setBoard(mockBoard);
  }

  onDeleteCard(event: { columnId: string; cardId: string }): void {
    this.store.deleteCard(event.columnId, event.cardId);
  }

  onAddCard(columnId: string): void {
    const newCard = {
      id: `card-${Date.now()}`,
      title: 'New Card',
      description: 'Add description here',
      createdAt: new Date()
    };
    this.store.addCard(columnId, newCard);
  }
}
