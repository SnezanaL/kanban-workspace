import { Injectable, signal, computed } from '@angular/core';
import { KanbanBoard, KanbanCard } from '@kanban-workspace/shared';

@Injectable({
  providedIn: 'root'
})
export class KanbanSignalStore {
  // Signal za board state
  private boardSignal = signal<KanbanBoard | null>(null);
  
  // Computed signals
  readonly board = this.boardSignal.asReadonly();
  readonly columns = computed(() => this.board()?.columns || []);
  readonly totalCards = computed(() => 
    this.columns().reduce((sum, col) => sum + col.cards.length, 0)
  );

  setBoard(board: KanbanBoard): void {
    this.boardSignal.set(board);
  }

  addCard(columnId: string, card: KanbanCard): void {
    const currentBoard = this.boardSignal();
    if (!currentBoard) return;

    const updatedColumns = currentBoard.columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          cards: [...col.cards, card]
        };
      }
      return col;
    });

    this.boardSignal.set({
      ...currentBoard,
      columns: updatedColumns
    });
  }

  deleteCard(columnId: string, cardId: string): void {
    const currentBoard = this.boardSignal();
    if (!currentBoard) return;

    const updatedColumns = currentBoard.columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          cards: col.cards.filter(card => card.id !== cardId)
        };
      }
      return col;
    });

    this.boardSignal.set({
      ...currentBoard,
      columns: updatedColumns
    });
  }

  moveCard(cardId: string, fromColumnId: string, toColumnId: string): void {
    const currentBoard = this.boardSignal();
    if (!currentBoard) return;

    let cardToMove: KanbanCard | null = null;
    
    const updatedColumns = currentBoard.columns.map(col => {
      if (col.id === fromColumnId) {
        const card = col.cards.find(c => c.id === cardId);
        if (card) {
          cardToMove = card;
          return {
            ...col,
            cards: col.cards.filter(c => c.id !== cardId)
          };
        }
      }
      return col;
    });

    if (!cardToMove) return;

    const finalColumns = updatedColumns.map(col => {
      if (col.id === toColumnId && cardToMove) {
        return {
          ...col,
          cards: [...col.cards, cardToMove]
        };
      }
      return col;
    });

    this.boardSignal.set({
      ...currentBoard,
      columns: finalColumns
    });
  }
}
