import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanBoard, KanbanTask } from '../../models/kanban.models';

@Component({
  selector: 'lib-kanban-board',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex gap-6 h-full overflow-x-auto p-6">
      @for (column of board().columns; track column.name) {
      <div class="flex flex-col min-w-[280px] bg-gray-100 dark:bg-dark-400 rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3
            class="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400"
          >
            {{ column.name }} ({{ column.tasks.length }})
          </h3>
        </div>
        <div class="flex flex-col gap-3 overflow-y-auto">
          @for (task of column.tasks; track task.title) {
          <div class="card p-4">
            <h4 class="font-semibold text-sm mb-2">{{ task.title }}</h4>
            @if (task.description) {
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">{{ task.description }}</p>
            } @if (task.subtasks.length > 0) {
            <p class="text-xs text-gray-500 dark:text-gray-500">
              {{ getCompletedSubtasks(task) }} of {{ task.subtasks.length }} subtasks
            </p>
            }
          </div>
          }
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .kanban-board {
        height: 100vh;
        display: flex;
        flex-direction: column;
        background: #e0e0e0;
      }

      .board-header {
        background: white;
        padding: 20px 32px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .board-header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        color: #333;
      }

      .columns-container {
        flex: 1;
        display: flex;
        gap: 20px;
        padding: 32px;
        overflow-x: auto;
        overflow-y: hidden;
      }
    `,
  ],
})
export class KanbanBoardComponent {
  readonly board = input.required<KanbanBoard>();

  getCompletedSubtasks(task: KanbanTask): number {
    return task.subtasks.filter((st) => st.isCompleted).length;
  }
}
