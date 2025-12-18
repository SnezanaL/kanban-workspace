import { KanbanBackendService } from '@kanban-workspace/shared/lib/services/kanban-backend.service';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KanbanBoardComponent } from '@kanban-workspace/shared';
import { KanbanHeaderComponent } from '@kanban-workspace/shared/lib/components/kanban-header/kanban-header.component';
import { KanbanSidebarComponent } from '@kanban-workspace/shared/lib/components/kanban-sidebar/kanban-sidebar.component';

@Component({
  imports: [KanbanBoardComponent, KanbanHeaderComponent, KanbanSidebarComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private backend = inject(KanbanBackendService);
  protected title = 'Kanban Signal App';

  public boards = this.backend.boards;
  public boardResource = this.backend.selectedBoard;
  public selectedBoardName = this.backend.selectedBoardName;

  onBoardSelected(boardName: string): void {
    this.backend.selectBoard(boardName);
  }
}
