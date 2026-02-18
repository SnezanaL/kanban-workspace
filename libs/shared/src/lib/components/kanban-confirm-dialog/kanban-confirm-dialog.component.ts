import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  output,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'lib-kanban-confirm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog
      #dialog
      class="w-full max-w-sm rounded-xl bg-white dark:bg-dark-400 p-6 shadow-xl backdrop:bg-black/50 open:flex open:flex-col open:gap-4"
    >
      <h2 class="text-base font-bold text-red-500">{{ title() }}</h2>
      <p class="text-sm text-gray-600 dark:text-gray-400">{{ message() }}</p>

      <div class="flex gap-3 justify-end pt-2">
        <button type="button" class="btn btn-sm btn-secondary" (click)="cancel()">Cancel</button>
        <button
          type="button"
          class="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
          (click)="confirm()"
        >
          Delete
        </button>
      </div>
    </dialog>
  `,
})
export class KanbanConfirmDialogComponent {
  readonly confirmed = output<void>();

  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected title = signal('');
  protected message = signal('');

  open(title: string, message: string) {
    this.title.set(title);
    this.message.set(message);
    this.dialogRef().nativeElement.showModal();
  }

  close() {
    this.dialogRef().nativeElement.close();
  }

  protected confirm() {
    this.confirmed.emit();
    this.close();
  }

  protected cancel() {
    this.close();
  }
}
