import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { KanbanBoardComponent, KanbanDataService, KanbanBoard } from '@kanban-workspace/shared';
import { KanbanHeaderComponent } from '@kanban-workspace/shared/lib/components/kanban-header/kanban-header.component';
import { KanbanSidebarComponent } from '@kanban-workspace/shared/lib/components/kanban-sidebar/kanban-sidebar.component';
import { KanbanState } from './store/kanban.state';
import { SetBoard, AddCard, DeleteCard } from './store/kanban.actions';

@Component({
  imports: [
    KanbanBoardComponent,
    KanbanHeaderComponent,
    KanbanSidebarComponent,
    RouterModule,
    AsyncPipe,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private store = inject(Store);
  private dataService = inject(KanbanDataService);
  protected title = 'Kanban NGXS App';

  boards$ = this.store.select(KanbanState.board);

  ngOnInit(): void {
    // Load mock data
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
      createdAt: new Date(),
    };
    this.store.dispatch(new AddCard(columnId, newCard));
  }
}
