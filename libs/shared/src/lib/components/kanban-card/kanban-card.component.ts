import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCard } from '../../models/kanban.models';

@Component({
  selector: 'lib-kanban-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="kanban-card" [class.priority-high]="card.priority === 'high'"
         [class.priority-medium]="card.priority === 'medium'"
         [class.priority-low]="card.priority === 'low'">
      <div class="card-header">
        <h4>{{ card.title }}</h4>
        <button class="delete-btn" (click)="onDelete()">×</button>
      </div>
      @if (card.description) {
        <p class="card-description">{{ card.description }}</p>
      }
      <div class="card-footer">
        @if (card.assignee) {
          <span class="assignee">👤 {{ card.assignee }}</span>
        }
        @if (card.priority) {
          <span class="priority">{{ card.priority }}</span>
        }
      </div>
    </div>
  `,
  styles: [`
    .kanban-card {
      background: white;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-left: 4px solid #ccc;
      cursor: move;
    }
    
    .priority-high {
      border-left-color: #f44336;
    }
    
    .priority-medium {
      border-left-color: #ff9800;
    }
    
    .priority-low {
      border-left-color: #4caf50;
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    
    .card-header h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    
    .delete-btn {
      background: none;
      border: none;
      color: #999;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }
    
    .delete-btn:hover {
      color: #f44336;
    }
    
    .card-description {
      color: #666;
      font-size: 14px;
      margin: 8px 0;
    }
    
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
      font-size: 12px;
      color: #888;
    }
    
    .priority {
      text-transform: uppercase;
      font-weight: 600;
    }
  `]
})
export class KanbanCardComponent {
  @Input({ required: true }) card!: KanbanCard;
  @Output() delete = new EventEmitter<string>();

  onDelete(): void {
    this.delete.emit(this.card.id);
  }
}
