import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface BoardSavedEvent {
  name: string;
  /** Column names — only present when creating a new board */
  columns?: string[];
}

@Component({
  selector: 'lib-kanban-board-modal',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog
      #dialog
      class="w-full max-w-lg rounded-xl bg-white dark:bg-dark-400 p-6 shadow-xl backdrop:bg-black/50 open:flex open:flex-col open:gap-5"
    >
      <h2 class="text-base font-bold text-gray-900 dark:text-dark-100">
        {{ isEditing() ? 'Edit Board' : 'Add New Board' }}
      </h2>

      <!-- Board name -->
      <label class="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-dark-200">
        Board Name
        <input
          class="input"
          type="text"
          [(ngModel)]="boardName"
          placeholder="e.g. Web Project"
          required
        />
      </label>

      <!-- Columns (only when creating) -->
      @if (!isEditing()) {
      <div class="flex flex-col gap-2 text-sm font-medium text-gray-700 dark:text-dark-200">
        Board Columns @for (col of columnNames(); track $index) {
        <div class="flex gap-2 items-center">
          <input class="input flex-1" type="text" [(ngModel)]="col.value" placeholder="e.g. Todo" />
          <button
            type="button"
            class="text-gray-400 hover:text-red-500 transition-colors"
            (click)="removeColumn($index)"
            title="Remove column"
          >
            &#x2715;
          </button>
        </div>
        }
        <button type="button" class="btn btn-sm btn-secondary w-full" (click)="addColumn()">
          + Add New Column
        </button>
      </div>
      }

      <!-- Actions -->
      <div class="flex gap-3 justify-end pt-2">
        <button type="button" class="btn btn-sm btn-secondary" (click)="close()">Cancel</button>
        <button type="button" class="btn btn-sm btn-primary" (click)="save()">
          {{ isEditing() ? 'Save Changes' : 'Create New Board' }}
        </button>
      </div>
    </dialog>
  `,
})
export class KanbanBoardModalComponent {
  readonly boardSaved = output<BoardSavedEvent>();

  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected boardName = '';
  protected columnNames = signal<{ value: string }[]>([
    { value: 'Todo' },
    { value: 'Doing' },
    { value: 'Done' },
  ]);
  protected isEditing = signal(false);

  open(existingName?: string) {
    if (existingName) {
      this.isEditing.set(true);
      this.boardName = existingName;
    } else {
      this.isEditing.set(false);
      this.boardName = '';
      this.columnNames.set([{ value: 'Todo' }, { value: 'Doing' }, { value: 'Done' }]);
    }
    this.dialogRef().nativeElement.showModal();
  }

  close() {
    this.dialogRef().nativeElement.close();
  }

  protected addColumn() {
    this.columnNames.update((cols) => [...cols, { value: '' }]);
  }

  protected removeColumn(index: number) {
    this.columnNames.update((cols) => cols.filter((_, i) => i !== index));
  }

  protected save() {
    if (!this.boardName.trim()) return;

    const event: BoardSavedEvent = { name: this.boardName.trim() };
    if (!this.isEditing()) {
      event.columns = this.columnNames()
        .map((c) => c.value.trim())
        .filter(Boolean);
    }

    this.boardSaved.emit(event);
    this.close();
  }
}
