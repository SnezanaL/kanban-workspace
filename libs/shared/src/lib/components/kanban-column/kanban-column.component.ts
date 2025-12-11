import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanColumn } from '../../models/kanban.models';
import { KanbanCardComponent } from '../kanban-card/kanban-card.component';

@Component({
  selector: 'lib-kanban-column',
  standalone: true,
  imports: [CommonModule, KanbanCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kanban-column">
      <div class="column-header">
        <h3>{{ column.title }}</h3>
        <span class="card-count">{{ column.cards.length }}</span>
      </div>
      <div class="cards-container">
        @for (card of column.cards; track card.id) {
          <lib-kanban-card 
            [card]="card"
            (delete)="onDeleteCard($event)">
          </lib-kanban-card>
        }
        @empty {
          <div class="empty-state">No cards</div>
        }
      </div>
      <button class="add-card-btn" (click)="onAddCard()">+ Add Card</button>
    </div>
  `,
  styles: [`
    .kanban-column {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 16px;
      min-width: 300px;
      max-width: 350px;
      display: flex;
      flex-direction: column;
      height: fit-content;
      max-height: 80vh;
    }
    
    .column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .column-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #333;
    }
    
    .card-count {
      background: #666;
      color: white;
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .cards-container {
      flex: 1;
      overflow-y: auto;
      margin-bottom: 12px;
      min-height: 100px;
    }
    
    .empty-state {
      text-align: center;
      color: #999;
      padding: 24px;
      font-style: italic;
    }
    
    .add-card-btn {
      width: 100%;
      padding: 10px;
      background: white;
      border: 2px dashed #ccc;
      border-radius: 6px;
      color: #666;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .add-card-btn:hover {
      background: #f0f0f0;
      border-color: #999;
      color: #333;
    }
  `]
})
export class KanbanColumnComponent {
  @Input({ required: true }) column!: KanbanColumn;
  @Output() deleteCard = new EventEmitter<{ columnId: string; cardId: string }>();
  @Output() addCard = new EventEmitter<string>();

  onDeleteCard(cardId: string): void {
    this.deleteCard.emit({ columnId: this.column.id, cardId });
  }

  onAddCard(): void {
    this.addCard.emit(this.column.id);
  }
}
