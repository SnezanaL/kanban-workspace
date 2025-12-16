import { Component, OnInit, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KanbanBoardComponent, KanbanDataService } from '@kanban-workspace/shared';
import { KanbanHeaderComponent } from '@kanban-workspace/shared/lib/components/kanban-header/kanban-header.component';
import { KanbanSidebarComponent } from '@kanban-workspace/shared/lib/components/kanban-sidebar/kanban-sidebar.component';
import { KanbanSignalStore } from './store/kanban-signal.store';
import { KanbanBackendService } from '@kanban-workspace/shared/lib/services/kanban-backend.service';

@Component({
  imports: [KanbanBoardComponent, KanbanHeaderComponent, KanbanSidebarComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private store = inject(KanbanSignalStore);
  private dataService = inject(KanbanDataService);
  private backend = inject(KanbanBackendService);
  protected title = 'Kanban Signal App';

  constructor() {
    // Effect to track board state changes
    effect(() => {
      const board = this.store.board();
      console.log('Board updated:', board);
    });
  }

  ngOnInit(): void {
    // Load board from fake backend
    const board = this.backend.selectedBoard();
    this.store.setBoard(board);
  }

  onBoardSelected(boardName: string): void {
    this.backend.selectBoard(boardName);
    const board = this.backend.selectedBoard();
    this.store.setBoard(board);
  }
}
