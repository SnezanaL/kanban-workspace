import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanBoard } from '../../models/kanban.models';
import { KanbanLogoComponent } from '../kanban-header/kanban-logo.component';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'lib-kanban-sidebar',
  standalone: true,
  imports: [CommonModule, KanbanLogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kanban-sidebar.component.html',
})
export class KanbanSidebarComponent {
  protected readonly sidebar = inject(SidebarService);

  readonly boards = input<KanbanBoard[]>([]);
  readonly selectedBoardName = input<string>('');
  readonly boardSelected = output<string>();
  readonly createBoardClicked = output<void>();
}
