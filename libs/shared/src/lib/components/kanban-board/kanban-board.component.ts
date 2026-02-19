import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanBoard, KanbanTask } from '../../models/kanban.models';

export interface TaskActionEvent {
  type: 'edit' | 'delete' | 'move';
  column: string;
  taskIndex: number;
  toColumn?: string;
}

/** Notion-style column badge colours. Cycles through a palette for custom column names. */
const COLUMN_BADGE: Record<string, { dot: string; bg: string; text: string }> = {
  todo: {
    dot: 'bg-gray-400',
    bg: 'bg-gray-100 dark:bg-dark-300',
    text: 'text-gray-600 dark:text-gray-300',
  },
  doing: {
    dot: 'bg-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-700 dark:text-amber-300',
  },
  done: {
    dot: 'bg-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  now: {
    dot: 'bg-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-700 dark:text-blue-300',
  },
  next: {
    dot: 'bg-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-700 dark:text-purple-300',
  },
  later: {
    dot: 'bg-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    text: 'text-rose-700 dark:text-rose-300',
  },
};

const FALLBACK_DOTS = ['bg-cyan-400', 'bg-orange-400', 'bg-pink-400', 'bg-indigo-400'];

@Component({
  selector: 'lib-kanban-board',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
})
export class KanbanBoardComponent {
  readonly board = input.required<KanbanBoard>();

  readonly taskAction = output<TaskActionEvent>();
  readonly addTaskToColumn = output<string>();
  readonly addColumn = output<void>();

  readonly openMenuKey = signal<string | null>(null);
  readonly openStatusKey = signal<string | null>(null);

  toggleMenu(column: string, index: number, event: Event) {
    event.stopPropagation();
    const key = `${column}-${index}`;
    this.openMenuKey.update((k) => (k === key ? null : key));
    this.openStatusKey.set(null);
  }

  toggleStatus(column: string, index: number, event: Event) {
    event.stopPropagation();
    const key = `status-${column}-${index}`;
    this.openStatusKey.update((k) => (k === key ? null : key));
    this.openMenuKey.set(null);
  }

  selectStatus(fromColumn: string, toColumn: string, taskIndex: number, event: Event) {
    event.stopPropagation();
    this.openStatusKey.set(null);
    if (toColumn !== fromColumn) {
      this.taskAction.emit({ type: 'move', column: fromColumn, taskIndex, toColumn });
    }
  }

  getBadge(name: string, fallbackIndex: number) {
    const key = name.toLowerCase();
    if (COLUMN_BADGE[key]) return COLUMN_BADGE[key];
    const dot = FALLBACK_DOTS[fallbackIndex % FALLBACK_DOTS.length];
    return { dot, bg: 'bg-gray-100 dark:bg-dark-300', text: 'text-gray-600 dark:text-gray-300' };
  }

  protected onMoveTask(fromColumn: string, taskIndex: number, event: Event) {
    const toColumn = (event.target as HTMLSelectElement).value;
    if (toColumn !== fromColumn) {
      this.taskAction.emit({ type: 'move', column: fromColumn, taskIndex, toColumn });
    }
  }

  protected getCompletedSubtasks(task: KanbanTask): number {
    return task.subtasks.filter((st) => st.isCompleted).length;
  }

  protected getSubtaskPercent(task: KanbanTask): number {
    if (!task.subtasks.length) return 0;
    return Math.round((this.getCompletedSubtasks(task) / task.subtasks.length) * 100);
  }
}
