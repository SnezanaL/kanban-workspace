import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-kanban-logo',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center gap-2">
      <!-- Light / dark logo swap based on theme; adjust src paths to your actual SVG files -->
      <img src="assets/logo-light.svg" alt="Kanban logo" class="h-8 w-auto block dark:hidden" />
      <img src="assets/logo-dark.svg" alt="Kanban logo" class="h-8 w-auto hidden dark:block" />
    </div>
  `,
})
export class KanbanLogoComponent {}
