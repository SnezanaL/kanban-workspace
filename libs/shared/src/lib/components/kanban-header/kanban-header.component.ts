import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanLogoComponent } from './kanban-logo.component';

@Component({
  selector: 'lib-kanban-header',
  standalone: true,
  imports: [CommonModule, KanbanLogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="flex items-center justify-between px-6 h-16 border-b border-gray-200 bg-white dark:bg-dark-400 dark:border-dark-400"
    >
      <div class="flex items-center gap-4">
        <div class="h-6 w-px bg-gray-200 dark:bg-dark-300"></div>
        <h1 class="text-sm font-semibold text-gray-900 dark:text-dark-100">{{ boardTitle() }}</h1>
      </div>

      <div class="flex items-center gap-3">
        <button type="button" class="btn btn-md btn-primary hidden sm:inline-flex">
          + Add New Task
        </button>
        <button
          type="button"
          class="btn btn-sm btn-primary sm:hidden rounded-full px-3 py-2"
          aria-label="Add New Task"
        >
          +
        </button>
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-dark-300"
          aria-label="More options"
        >
          &#x22EE;
        </button>
      </div>
    </header>
  `,
})
export class KanbanHeaderComponent {
  readonly boardTitle = input<string>('Platform Launch');
}
