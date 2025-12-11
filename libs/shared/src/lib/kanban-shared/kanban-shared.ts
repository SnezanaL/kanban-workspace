import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-kanban-shared',
  imports: [],
  templateUrl: './kanban-shared.html',
  styleUrl: './kanban-shared.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanShared {}
