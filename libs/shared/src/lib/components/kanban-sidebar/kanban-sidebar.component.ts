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
  template: `
    <aside
      class="hidden h-screen md:flex w-64 flex-col justify-between border-r border-gray-200 bg-white dark:bg-dark-400 dark:border-dark-400"
    >
      <div class="px-4 pt-6">
        <div class="flex flex-col items-start my-3">
          <lib-kanban-logo></lib-kanban-logo>
        </div>
        <p class="mb-4 text-xs font-semibold tracking-[0.2em] text-gray-500 dark:text-dark-200">
          ALL BOARDS ({{ boards().length }})
        </p>
        <nav class="space-y-1 text-sm">
          @for (board of boards(); track board.name) {
          <button
            type="button"
            (click)="boardSelected.emit(board.name)"
            [class]="
              selectedBoardName() === board.name
                ? 'flex w-full items-center gap-3 rounded-r-full bg-primary text-white px-4 py-2 text-left text-xs font-medium'
                : 'flex w-full items-center gap-3 rounded-r-full  py-2 text-left text-xs font-medium text-gray-500 hover:bg-gray-100 dark:text-dark-200 dark:hover:bg-dark-500'
            "
          >
            <span class="text-base">•</span>
            <span>{{ board.name }}</span>
          </button>
          }
          <button
            type="button"
            class="mt-2 flex w-full items-center gap-3 rounded-r-full py-2 text-left text-xs font-medium text-primary hover:bg-primary-light/40"
          >
            <span class="text-base">+</span>
            <span>Create New Board</span>
          </button>
        </nav>
      </div>

      <div class="px-4 pb-6">
        <div
          class="mb-3 flex items-center justify-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-500 dark:bg-dark-500 dark:text-dark-200"
        >
          <img
            src="assets/images/icon-light-theme.svg"
            alt="Light theme"
            class="h-4 w-4"
            [class.opacity-50]="sidebar.isDarkMode()"
          />

          <button
            type="button"
            class="relative h-5 w-10 rounded-full bg-primary-light"
            [attr.aria-pressed]="sidebar.isDarkMode()"
            (click)="sidebar.toggleDarkMode()"
          >
            <span
              class="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200"
              [class.translate-x-5]="sidebar.isDarkMode()"
            ></span>
          </button>

          <img
            src="assets/images/icon-dark-theme.svg"
            alt="Dark theme"
            class="h-4 w-4"
            [class.opacity-50]="!sidebar.isDarkMode()"
          />
        </div>

        <button
          type="button"
          class="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-gray-500 hover:bg-gray-100 dark:text-dark-200 dark:hover:bg-dark-500"
        >
          Hide Sidebar
        </button>
      </div>
    </aside>
  `,
})
export class KanbanSidebarComponent {
  protected readonly sidebar = inject(SidebarService);

  readonly boards = input<KanbanBoard[]>([]);
  readonly selectedBoardName = input<string>('');
  readonly boardSelected = output<string>();

  readonly darkModeEnabled = this.sidebar.isDarkMode();
}
