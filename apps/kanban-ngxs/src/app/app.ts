import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { KanbanBoardComponent, KanbanDataService, KanbanBoard } from '@kanban-workspace/shared';
import { KanbanState } from './store/kanban.state';
import { SetBoard, AddCard, DeleteCard } from './store/kanban.actions';

@Component({
  imports: [KanbanBoardComponent, RouterModule, AsyncPipe],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'Kanban NGXS App';
  
  @Select(KanbanState.board) board$!: Observable<KanbanBoard | null>;

  constructor(
    private store: Store,
    private dataService: KanbanDataService
  ) {}

  ngOnInit(): void {
    // Učitaj mock podatke
    const mockBoard = this.dataService.getMockBoard();
    this.store.dispatch(new SetBoard(mockBoard));
  }

  onDeleteCard(event: { columnId: string; cardId: string }): void {
    this.store.dispatch(new DeleteCard(event.columnId, event.cardId));
  }

  onAddCard(columnId: string): void {
    const newCard = {
      id: `card-${Date.now()}`,
      title: 'New Card',
      description: 'Add description here',
      createdAt: new Date()
    };
    this.store.dispatch(new AddCard(columnId, newCard));
  }
}
