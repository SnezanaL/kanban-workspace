import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-kanban-header',
  standalone: true,
  imports: [CommonModule],
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
        <button
          type="button"
          class="btn btn-md btn-primary hidden sm:inline-flex"
          (click)="addTaskClicked.emit()"
        >
          + Add New Task
        </button>
        <button
          type="button"
          class="btn btn-sm btn-primary sm:hidden rounded-full px-3 py-2"
          aria-label="Add New Task"
          (click)="addTaskClicked.emit()"
        >
          +
        </button>

        <!-- More options menu -->
        <div class="relative">
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-dark-300"
            aria-label="More options"
            (click)="menuOpen.set(!menuOpen())"
          >
            &#x22EE;
          </button>

          @if (menuOpen()) {
          <div
            class="absolute right-0 top-10 z-50 w-44 rounded-lg border border-gray-100 bg-white dark:bg-dark-400 dark:border-dark-300 shadow-lg py-1"
            (mouseleave)="menuOpen.set(false)"
          >
            <button
              type="button"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-dark-100 hover:bg-gray-50 dark:hover:bg-dark-300"
              (click)="editBoardClicked.emit(); menuOpen.set(false)"
            >
              Edit Board
            </button>
            <button
              type="button"
              class="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              (click)="deleteBoardClicked.emit(); menuOpen.set(false)"
            >
              Delete Board
            </button>
          </div>
          }
        </div>
      </div>
    </header>
  `,
})
export class KanbanHeaderComponent {
  readonly boardTitle = input<string>('');

  readonly addTaskClicked = output<void>();
  readonly editBoardClicked = output<void>();
  readonly deleteBoardClicked = output<void>();

  protected readonly menuOpen = signal(false);
}
