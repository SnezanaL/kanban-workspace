import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  output,
  signal,
  viewChild,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KanbanTask, KanbanSubtask } from '../../models/kanban.models';

export interface TaskSavedEvent {
  task: KanbanTask;
  column: string;
  /** Index of the task in original column — present when editing */
  taskIndex?: number;
  /** Original column name — present when moving task to another column */
  originalColumn?: string;
}

@Component({
  selector: 'lib-kanban-task-modal',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog
      #dialog
      class="w-full max-w-lg rounded-xl bg-white dark:bg-dark-400 p-6 shadow-xl backdrop:bg-black/50 open:flex open:flex-col open:gap-5"
    >
      <h2 class="text-base font-bold text-gray-900 dark:text-dark-100">
        {{ isEditing() ? 'Edit Task' : 'Add New Task' }}
      </h2>

      <!-- Title -->
      <label class="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-dark-200">
        Title
        <input
          class="input"
          type="text"
          [(ngModel)]="title"
          placeholder="e.g. Take coffee break"
          required
        />
      </label>

      <!-- Description -->
      <label class="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-dark-200">
        Description
        <textarea
          class="input resize-none"
          rows="3"
          [(ngModel)]="description"
          placeholder="e.g. It's always good to take a break."
        ></textarea>
      </label>

      <!-- Subtasks -->
      <div class="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-dark-200">
        Subtasks @for (sub of subtasks(); track $index) {
        <div class="flex gap-2 items-center">
          <input
            type="checkbox"
            class="h-4 w-4 rounded accent-primary cursor-pointer shrink-0"
            [checked]="sub.isCompleted"
            (change)="toggleSubtask($index)"
          />
          <input
            class="input flex-1"
            [class.line-through]="sub.isCompleted"
            [class.opacity-50]="sub.isCompleted"
            type="text"
            [(ngModel)]="sub.title"
            placeholder="Subtask title"
          />
          <button
            type="button"
            class="text-gray-400 hover:text-red-500 transition-colors"
            (click)="removeSubtask($index)"
            title="Remove subtask"
          >
            &#x2715;
          </button>
        </div>
        }
        <button type="button" class="btn btn-sm btn-secondary w-full" (click)="addSubtask()">
          + Add New Subtask
        </button>
      </div>

      <!-- Column (status) -->
      <label class="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-dark-200">
        Status
        <select class="input" [(ngModel)]="selectedColumn">
          @for (col of columns(); track col) {
          <option [value]="col">{{ col }}</option>
          }
        </select>
      </label>

      <!-- Actions -->
      <div class="flex gap-3 justify-end pt-2">
        <button type="button" class="btn btn-sm btn-secondary" (click)="close()">Cancel</button>
        <button type="button" class="btn btn-sm btn-primary" (click)="save()">
          {{ isEditing() ? 'Save Changes' : 'Create Task' }}
        </button>
      </div>
    </dialog>
  `,
})
export class KanbanTaskModalComponent {
  readonly columns = input.required<string[]>();

  readonly taskSaved = output<TaskSavedEvent>();
  readonly subtaskToggled = output<{
    column: string;
    taskIndex: number;
    subtaskIndex: number;
    isCompleted: boolean;
  }>();

  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  // Form state
  protected title = '';
  protected description = '';
  protected subtasks = signal<KanbanSubtask[]>([]);
  protected selectedColumn = '';
  protected isEditing = signal(false);
  private taskIndex?: number;
  private originalColumn?: string;

  open(options?: { task?: KanbanTask; column?: string; taskIndex?: number }) {
    const cols = this.columns();
    if (options?.task) {
      this.isEditing.set(true);
      this.title = options.task.title;
      this.description = options.task.description;
      this.subtasks.set(options.task.subtasks.map((s) => ({ ...s })));
      this.selectedColumn = options.column ?? cols[0] ?? '';
      this.taskIndex = options.taskIndex;
      this.originalColumn = options.column;
    } else {
      this.isEditing.set(false);
      this.title = '';
      this.description = '';
      this.subtasks.set([]);
      this.selectedColumn = options?.column ?? cols[0] ?? '';
      this.taskIndex = undefined;
      this.originalColumn = undefined;
    }
    this.dialogRef().nativeElement.showModal();
  }

  close() {
    this.dialogRef().nativeElement.close();
  }

  protected toggleSubtask(subIndex: number) {
    this.subtasks.update((s) =>
      s.map((sub, i) => (i === subIndex ? { ...sub, isCompleted: !sub.isCompleted } : sub))
    );
    if (this.isEditing() && this.taskIndex !== undefined && this.originalColumn) {
      this.subtaskToggled.emit({
        column: this.originalColumn,
        taskIndex: this.taskIndex,
        subtaskIndex: subIndex,
        isCompleted: this.subtasks()[subIndex].isCompleted,
      });
    }
  }

  protected addSubtask() {
    this.subtasks.update((s) => [...s, { title: '', isCompleted: false }]);
  }

  protected removeSubtask(index: number) {
    this.subtasks.update((s) => s.filter((_, i) => i !== index));
  }

  protected save() {
    if (!this.title.trim()) return;

    const task: KanbanTask = {
      title: this.title.trim(),
      description: this.description.trim(),
      status: this.selectedColumn,
      subtasks: this.subtasks().filter((s) => s.title.trim()),
    };

    this.taskSaved.emit({
      task,
      column: this.selectedColumn,
      taskIndex: this.taskIndex,
      originalColumn: this.originalColumn,
    });

    this.close();
  }
}
