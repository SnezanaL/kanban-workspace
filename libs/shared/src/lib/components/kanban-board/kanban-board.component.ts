import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanBoard } from '../../models/kanban.models';
import { KanbanColumnComponent } from '../kanban-column/kanban-column.component';

@Component({
  selector: 'lib-kanban-board',
  standalone: true,
  imports: [CommonModule, KanbanColumnComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kanban-board">
      <header class="board-header">
        <h1>{{ board.title }}</h1>
      </header>
      <div class="columns-container">
        @for (column of board.columns; track column.id) {
          <lib-kanban-column 
            [column]="column"
            (deleteCard)="onDeleteCard($event)"
            (addCard)="onAddCard($event)">
          </lib-kanban-column>
        }
      </div>
    </div>
  `,
  styles: [`
    .kanban-board {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: #e0e0e0;
    }
    
    .board-header {
      background: white;
      padding: 20px 32px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  `]
})
export class KanbanBoardComponent {
  @Input({ required: true }) board!: KanbanBoard;
  @Output() deleteCard = new EventEmitter<{ columnId: string; cardId: string }>();
  @Output() addCard = new EventEmitter<string>();

  onDeleteCard(event: { columnId: string; cardId: string }): void {
    this.deleteCard.emit(event);
  }

  onAddCard(columnId: string): void {
    this.addCard.emit(columnId);
  }
}
